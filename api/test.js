export default async function handler(req, res) {
  const { apiKey } = req.body || {};

  if (!apiKey) {
    return res.status(400).json({ error: "missing apiKey" });
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 100,
      messages: [{ role: "user", content: "Say OK." }],
    }),
  });

  const data = await response.json();
  return res.status(response.status).json(data);
}
