import { CLAUDE_VISION_PROMPT } from "./constants";

export async function parseReceipt(imageBase64, apiKey) {
  if (!apiKey) {
    throw new Error("API key not set. Please configure it in Settings.");
  }

  if (!imageBase64 || imageBase64.length === 0) {
    throw new Error("Invalid image data");
  }

  try {
    const response = await fetch("/api/parse-receipt", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        imageBase64,
        apiKey,
        prompt: CLAUDE_VISION_PROMPT,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to parse receipt");
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
