import Groq from "groq-sdk";

export default async function handler(req, res) {
  const apiKey = req.headers["x-groq-api-key"];
  const { transcript } = req.body;

  const groq = new Groq({ apiKey });

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      { role: "system", content: "Give 3 suggestions: Ask, Insight, Clarify" },
      { role: "user", content: transcript },
    ],
  });

  const text = completion.choices[0].message.content;

  const suggestions = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l);

  res.status(200).json({ suggestions });
}