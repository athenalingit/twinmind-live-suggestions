import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/suggestions", async (req, res) => {
  const { transcript } = req.body;

  // TEMP FAKE RESPONSE (we'll replace with Groq next)
  const suggestions = [
    "Ask: What is the main goal here?",
    "Insight: This could impact timelines",
    "Clarify: What assumptions are we making?"
  ];

  res.json({ suggestions });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});