import { useState } from "react";

function App() {
  const [transcript, setTranscript] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [apiKey, setApiKey] = useState("");

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: recorder.mimeType });
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

  console.log("Blob size:", blob.size); //delete
  console.log("Blob type:", blob.type); //dete 

  setAudioUrl(URL.createObjectURL(blob));

      const res = await fetch("api/transcribe", {
        method: "POST",
        headers: {
          "x-groq-api-key": apiKey},
        body: formData,
      });

      const data = await res.json();
      console.log("Transcribe response:", data);
      setTranscript((prev) => prev + "\n" + data.text);
    };

    recorder.start(1000);
    setMediaRecorder(recorder);
    setIsRecording(true);
  };  

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const generateSuggestions = async () => {
    const res = await fetch("/api/suggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-groq-api-key": apiKey,
      },
      body: JSON.stringify({ transcript }),
    });

    const data = await res.json();
    setSuggestions(data.suggestions);
  };

  return (
    <div style={{ padding: "20px" }}>

      <input
        type="password"
        placeholder="Paste Groq API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
    
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      
      {/* LEFT: Transcript */}

      <div style={{ flex: 1 }}>
        <h2>Transcript</h2>
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        {audioUrl && <audio controls src={audioUrl} />}
        <textarea
          rows={15}
          style={{ width: "100%" }}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />

      </div>


      {/* MIDDLE: Suggestions */}
      <div style={{ flex: 1 }}>
        <h2>Suggestions</h2>
        <button onClick={generateSuggestions}>Generate</button>

        {suggestions.map((s, i) => (
          <div key={i} style={{ border: "1px solid #ccc", marginTop: "10px", padding: "10px" }}>
            {s}
          </div>
        ))}
      </div>

      {/* RIGHT: Chat (placeholder for now) */}
      <div style={{ flex: 1 }}>
        <h2>Chat</h2>
        <p>Coming next...</p>
      </div>

    </div>
    </div>
  );
}

export default App;