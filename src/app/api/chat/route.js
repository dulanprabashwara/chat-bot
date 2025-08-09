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
    });

    const safetySystemPrompt =
      "You are a helpful AI assistant. Keep responses concise, avoid repetition, and end at a natural sentence boundary.";

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

    const modelPrimary = "mistralai/mistral-7b-instruct";
    const modelFallback = "openrouter/auto"; // OpenRouter will choose an available model
    let modelTried = modelPrimary;

    async function callModel(model) {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          // Accept header can help with some proxies
          Accept: "application/json",
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": "AI Character Chat Platform",
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 300,
          temperature: 0.4,
          top_p: 0.9,
          frequency_penalty: 0.6,
          presence_penalty: 0.2,
        }),
      });
      return res;
    }

    let response = await callModel(modelPrimary);
    if (!response.ok) {
      const errorText = await response.text();
      console.warn("[CHAT] Primary model failed", response.status, errorText);
      // Retry once with fallback on typical model errors
      if ([401, 403, 404, 422, 500, 503].includes(response.status)) {
        modelTried = modelFallback;
        response = await callModel(modelFallback);
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
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
