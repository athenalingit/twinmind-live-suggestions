An AI-powered web app that records audio, transcribes it in real time, and generates actionable meeting suggestions.

## Features

- **Audio Recording**
  - Record audio directly in the browser using the MediaRecorder API

- **Transcription**
  - Converts speech → text using Groq Whisper (`whisper-large-v3`)

- **AI Suggestions**
  - Generates structured suggestions from transcripts

- **Customizable Suggestions**
  - Users can select what types of suggestions they want

- **Chat (Coming Soon)**

---

## Tech Stack

**Frontend**
- React (Vite)
- MediaRecorder API

**Backend (Serverless)**
- Vercel Functions (`/api/*`)
- formidable (file upload parsing)

**AI**
- Groq API
  - Speech-to-text: `whisper-large-v3`
  - LLM: `openai/gpt-oss-120b`

