import { useState } from "react";

function App() {
  const [transcript, setTranscript] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const generateSuggestions = async () => {
    const res = await fetch("http://localhost:3000/suggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcript }),
    });

    const data = await res.json();
    setSuggestions(data.suggestions);
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      
      {/* LEFT: Transcript */}
      <div style={{ flex: 1 }}>
        <h2>Transcript</h2>
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
  );
}

export default App;