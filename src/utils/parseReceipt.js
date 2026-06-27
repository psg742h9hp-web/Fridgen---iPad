import { CLAUDE_VISION_PROMPT } from "./constants";

export async function parseReceipt(imageBase64, apiKey) {
  if (!apiKey) {
    throw new Error("API key not set. Please configure it in Settings.");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-20241022",
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

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error?.message || "Failed to parse receipt with Claude API"
    );
  }

  const data = await response.json();
  const textContent = data.content.find(c => c.type === "text")?.text || "{}";

  try {
    const parsed = JSON.parse(textContent);
    return parsed.items || [];
  } catch (e) {
    throw new Error("Invalid JSON response from Claude API");
  }
}
