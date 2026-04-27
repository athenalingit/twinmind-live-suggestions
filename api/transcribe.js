import Groq from "groq-sdk";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
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
  try {
    const apiKey = req.headers["x-groq-api-key"];

    if (!apiKey) {
      return res.status(401).json({ error: "Missing Groq API key" });
    }

    const { files } = await parseForm(req);

    console.log("FILES:", files);

    const audioFile = Array.isArray(files.audio)
      ? files.audio[0]
      : files.audio;

    if (!audioFile) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const filePath = audioFile.filepath || audioFile.path;

    console.log("FILE PATH:", filePath);

    const groq = new Groq({ apiKey });

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-large-v3",
    });

    return res.status(200).json({ text: transcription.text });
  } catch (error) {
    console.error("Error transcribing audio:", error);

    return res.status(500).json({
      error: "Failed to transcribe audio",
      details: error.message,
    });
  }
}