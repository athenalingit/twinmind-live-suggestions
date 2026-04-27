import Groq from "groq-sdk";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const apiKey = req.headers["x-groq-api-key"];
  const groq = new Groq({ apiKey });

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const form = formidable({
  multiples: false,
  keepExtensions: true,
  uploadDir: "/tmp",
    });

  const buffer = Buffer.concat(chunks);

  const transcription = await groq.audio.transcriptions.create({
    file: buffer,
    model: "whisper-large-v3",
  });

  res.status(200).json({ text: transcription.text });
}