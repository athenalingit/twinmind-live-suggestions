import Groq from "groq-sdk";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = req.headers["x-groq-api-key"];

    if (!apiKey) {
      return res.status(401).json({ error: "Missing Groq API key" });
    }

    const { files } = await parseForm(req);

    const audioFile = Array.isArray(files.audio)
      ? files.audio[0]
      : files.audio;

    if (!audioFile) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const groq = new Groq({ apiKey });

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(audioFile.filepath),
      model: "whisper-large-v3",
    });

    res.status(200).json({ text: transcription.text });
  } catch (err) {
    console.error("Transcription error:", err);
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
}