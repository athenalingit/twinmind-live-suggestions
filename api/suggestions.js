import Groq from "groq-sdk";

export default async function handler(req, res) {
  const apiKey = req.headers["x-groq-api-key"];
  const { transcript, suggestionTypes = ["Ask", "Insight", "Clarify", "Action Item", "Risk", "Follow-up", "Summary"] } = req.body;

  const groq = new Groq({ apiKey });

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      { role: "system", 
        content: `You are a helpful assistant that generates suggestions based on meeting transcripts.
        The user has selected the following categories: ${suggestionTypes.join(", ")}.
        For each category, generate one suggestion based on the transcript. Format your response as follows:
        Category: [Your suggestion here]`
      },
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