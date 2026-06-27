import { CLAUDE_VISION_PROMPT } from "./constants";

export async function parseReceipt(imageBase64, apiKey) {
  if (!apiKey) {
    throw new Error("API key not set. Please configure it in Settings.");
  }

  if (!imageBase64 || imageBase64.length === 0) {
    throw new Error("Invalid image data");
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: imageBase64,
                },
              },
              {
                type: "text",
                text: CLAUDE_VISION_PROMPT,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || "Failed to call Claude API");
    }

    if (!data.content || data.content.length === 0) {
      throw new Error("No response from Claude API");
    }

    const textContent = data.content.find(c => c.type === "text")?.text || "{}";

    try {
      const parsed = JSON.parse(textContent);
      if (!parsed.items || !Array.isArray(parsed.items)) {
        throw new Error("Invalid response format - expected items array");
      }
      return parsed.items;
    } catch (e) {
      console.error("Parse error:", e, "Response:", textContent);
      throw new Error("Could not parse receipt. Try a clearer photo.");
    }
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Network error. Check internet connection and API key.");
  }
}
