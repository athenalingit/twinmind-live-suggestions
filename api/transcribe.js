import Groq from "groq-sdk";
import formidable from "formidable";
import fs from "fs";

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
  maxFileSize: 25 * 1024 * 1024,
    });

  const buffer = Buffer.concat(chunks);

  const filePath = audioFile.filepath || audioFile.path;

  const transcription = await groq.audio.transcriptions.create({
  file: fs.createReadStream(filePath),
  model: "whisper-large-v3",
    });

  res.status(200).json({ text: transcription.text });
}