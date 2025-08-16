export const runtime = "nodejs";

// Helper: safe JSON parsing of request body
async function parseBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function POST(request) {
  const started = Date.now();
  const isDev = process.env.NODE_ENV !== "production";
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("Missing OPENROUTER_API_KEY (set in .env.local)");
    }
    if (/^(pk_|sk-test|YOUR_|REPLACE)/i.test(process.env.OPENROUTER_API_KEY)) {
      throw new Error(
        "Placeholder or test OPENROUTER_API_KEY detected; supply a real key."
      );
    }

    const {
      message,
      characterPrompt,
      conversationHistory = [],
    } = await parseBody(request);

    if (!message || !characterPrompt) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: message & characterPrompt",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Basic shape validation of history
    const history = Array.isArray(conversationHistory)
      ? conversationHistory.filter(
          (m) =>
            m && typeof m.role === "string" && typeof m.content === "string"
        )
      : [];

    console.log("[CHAT] Incoming", {
      msgLen: message.length,
      promptLen: characterPrompt.length,
      history: history.length,
      modelOverride: process.env.OPENROUTER_MODEL || null,
    });

    const safetySystemPrompt =
      "You are an AI assistant that MUST strictly follow the character description provided. Stay in character at all times and embody the personality, tone, and behavior described. Be consistent with your character throughout the conversation and maintain the same energy and approach in every response. Keep responses engaging but concise.";

    const sanitizeText = (text) => {
      if (!text) return text;
      let output = String(text)
        .replace(/[ \t]+/g, " ")
        .replace(/\s+\n/g, "\n")
        .trim();
      output = output.replace(/([^\p{L}\p{N}\s])\1{3,}/gu, (m, ch) =>
        ch.repeat(2)
      );
      output = output.replace(
        /\b(\w+)(?:\s+\1){2,}\b/gi,
        (m, w) => `${w} ${w}`
      );
      return output;
    };

    const messages = [
      { role: "system", content: safetySystemPrompt },
      { role: "system", content: sanitizeText(characterPrompt) },
      ...history.map((m) => ({
        role: m.role,
        content: sanitizeText(m.content),
      })),
      { role: "user", content: sanitizeText(message) },
    ];

    const configuredModel = process.env.OPENROUTER_MODEL?.trim();
    const modelPrimary = configuredModel || "mistralai/mistral-7b-instruct";
    const modelFallback = "openrouter/auto"; // OpenRouter will choose an available model
    let modelTried = modelPrimary;

    async function callModel(model) {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": "AI Character Chat Platform",
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 400,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.3,
          presence_penalty: 0.4,
        }),
      });
      return res;
    }

    let response = await callModel(modelPrimary);
    if (!response.ok) {
      const primaryStatus = response.status;
      const errorText = await response.text();
      console.warn("[CHAT] Primary model failed", primaryStatus, errorText);
      if ([401, 403, 404, 422, 500, 503].includes(primaryStatus)) {
        modelTried = modelFallback;
        response = await callModel(modelFallback);
        if (!response.ok) {
          const fbStatus = response.status;
          const fbText = await response.text();
          throw new Error(
            `Both models failed. Primary(${primaryStatus}) '${modelPrimary}' -> '${errorText.slice(
              0,
              300
            )}'; Fallback(${fbStatus}) '${modelFallback}' -> '${fbText.slice(
              0,
              300
            )}'`
          );
        }
      }
    }

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(
        `Upstream error (${
          response.status
        }) after model '${modelTried}': ${errBody.slice(0, 500)}`
      );
    }

    const data = await response.json();
    let aiResponse = data.choices?.[0]?.message?.content;
    if (!aiResponse)
      throw new Error("No response content in choices[0].message.content");

    aiResponse = sanitizeText(aiResponse);
    const lastEnd = Math.max(
      aiResponse.lastIndexOf("."),
      aiResponse.lastIndexOf("!"),
      aiResponse.lastIndexOf("?")
    );
    if (lastEnd !== -1 && aiResponse.length - lastEnd > 60)
      aiResponse = aiResponse.slice(0, lastEnd + 1).trim();
    const MAX_LEN = 2000;
    if (aiResponse.length > MAX_LEN)
      aiResponse = aiResponse.slice(0, MAX_LEN).trim();

    console.log("[CHAT] Success", {
      ms: Date.now() - started,
      model: modelTried,
      outLen: aiResponse.length,
    });

    return new Response(
      JSON.stringify({ response: aiResponse, model: modelTried }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[CHAT] Error", error);
    return new Response(
      JSON.stringify({
        error: "Failed to get AI response",
        details: isDev ? error.message : undefined,
        code: error.message.includes("Placeholder")
          ? "CONFIG_KEY_PLACEHOLDER"
          : error.message.includes("Missing OPENROUTER_API_KEY")
          ? "CONFIG_KEY_MISSING"
          : error.message.startsWith("Both models failed")
          ? "UPSTREAM_BOTH_FAILED"
          : error.message.startsWith("Upstream error")
          ? "UPSTREAM_ERROR"
          : "UNKNOWN",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
