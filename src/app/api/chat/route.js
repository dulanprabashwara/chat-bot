export const runtime = "nodejs";
export async function POST(request) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    const { message, characterPrompt, conversationHistory } =
      await request.json();

    if (!message || !characterPrompt) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("Processing chat request:", {
      message,
      characterPrompt: characterPrompt.substring(0, 50) + "...", // Log first 50 chars
      historyLength: conversationHistory.length,
    });

    // System guardrails to reduce repetition/noise
    const safetySystemPrompt =
      "You are a helpful AI assistant. Keep responses concise and clear. Do not repeat words or symbols. Do not add trailing emojis or repeated characters. Use at most 2 emojis total if appropriate. End your response cleanly at a sentence boundary.";

    // Sanitize function available for both input history and output
    const sanitizeText = (text) => {
      if (!text) return text;
      let output = String(text);
      output = output
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

    // Prepare messages for OpenRouter
    const messages = [
      {
        role: "system",
        content: safetySystemPrompt,
      },
      {
        role: "system",
        content: sanitizeText(characterPrompt),
      },
      ...conversationHistory.map((m) => ({
        role: m.role,
        content: sanitizeText(m.content),
      })),
      {
        role: "user",
        content: sanitizeText(message),
      },
    ];

    // Call OpenRouter API
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": "AI Character Chat Platform",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: messages,
          max_tokens: 300,
          temperature: 0.4,
          top_p: 0.9,
          frequency_penalty: 0.6,
          presence_penalty: 0.2,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API error:", errorData);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI model");
    }

    // Sanitize model output to remove repetitive trailing noise
    aiResponse = sanitizeText(aiResponse);
    // If there's obvious trailing junk, cut to last sentence end
    const lastEnd = Math.max(
      aiResponse.lastIndexOf("."),
      aiResponse.lastIndexOf("!"),
      aiResponse.lastIndexOf("?")
    );
    if (lastEnd !== -1 && aiResponse.length - lastEnd > 60) {
      aiResponse = aiResponse.slice(0, lastEnd + 1).trim();
    }
    const MAX_LEN = 2000;
    if (aiResponse.length > MAX_LEN) {
      aiResponse = aiResponse.slice(0, MAX_LEN).trim();
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to get AI response",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
