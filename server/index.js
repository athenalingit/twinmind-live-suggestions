import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import multer from "multer";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `recording-${Date.now()}.webm`);
  },
});

const upload = multer({ storage });


app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try{
    const filePath = req.file.path;
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-large-v3"
    });
    fs.unlinkSync(filePath);
    res.json({ text:transcription.text });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
});

app.post("/suggestions", async (req, res) => {
  const { transcript } = req.body;

  try{
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {role: "system", content: "You are a helpful assistant that generates suggestions based on meeting transcripts. You provide three types of suggestions: 1) Ask: A clarifying question to ask the team, 2) Insight: An insight or observation about the project, 3) Clarify: A point that needs clarification or further discussion."
        },
        { role: "user", content: `Here is the transcript of the meeting:\n\n${transcript}\n\nBased on this transcript, generate one suggestion for each of the three categories: Ask, Insight, Clarify. Format your response as follows:\n\nAsk: [Your question here]\nInsight: [Your insight here]\nClarify: [Your clarification point here]`
        }
      ]
    });

    const text = completion.choices[0].message.content;
    const suggestions = text.split("\n").map(line => line.trim()).filter(line => line);
    res.json({ suggestions });
  }

  catch (error) {
    console.error("Error generating suggestions:", error);
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});