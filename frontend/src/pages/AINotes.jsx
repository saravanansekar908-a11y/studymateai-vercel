import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { generateNotes } from "../services/notesApi";

export default function AINotes() {
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!topic.trim()) {
      alert("Please enter a topic.");
      return;
    }

    setLoading(true);

    try {
      const data = await generateNotes(topic);
      setNotes(data.notes);
    } catch (err) {
      console.error(err);
      alert("Unable to generate notes.");
    }

    setLoading(false);
  }

  function copyNotes() {
    navigator.clipboard.writeText(notes);
    alert("Notes copied successfully!");
  }

  return (
    <div
      style={{
        display: "flex",
        background: "#F3F4F6",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div className="responsive-page-container">

          <h1 style={{ color: "#2563EB", marginBottom: "16px" }}>📝 AI Notes Generator</h1>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
            <input
              type="text"
              placeholder="Enter Topic (e.g., Photosynthesis, Binary Search)..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={{
                flex: "1 1 240px",
                padding: "12px 16px",
                fontSize: 16,
                borderRadius: 10,
                border: "1px solid #CBD5E1",
              }}
            />

            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                padding: "12px 24px",
                background: "#2563EB",
                color: "white",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "15px",
                whiteSpace: "nowrap",
              }}
            >
              {loading ? "Generating..." : "Generate Notes"}
            </button>
          </div>

          <div
            style={{
              background: "white",
              padding: 25,
              borderRadius: 15,
              boxShadow: "0 5px 15px rgba(0,0,0,.1)",
            }}
          >
            <h2>📚 AI Generated Notes</h2>

            <hr />

            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.8,
                minHeight: 250,
              }}
            >
              {notes || "Generated notes will appear here..."}
            </div>

            {notes && (
              <>
                <br />

                <button
                  onClick={copyNotes}
                  style={{
                    padding: "10px 20px",
                    background: "#10B981",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  📋 Copy Notes
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}