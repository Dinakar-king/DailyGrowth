// client/src/components/CommunicationDrill.jsx
import React, { useState } from "react";

export default function CommunicationDrill({ targetSentence, onScoreCalculated }) {
  const [userTranscript, setUserTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [accuracy, setAccuracy] = useState(null);

  // Play Native TTS Audio
  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(targetSentence);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Record User Voice & Transcribe
  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported in this browser.");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setIsRecording(true);

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setUserTranscript(spokenText);
      setIsRecording(false);

      // Levenshtein / Exact match evaluation
      const cleanTarget = targetSentence.toLowerCase().replace(/[^a-z0-9 ]/g, "");
      const cleanSpoken = spokenText.toLowerCase().replace(/[^a-z0-9 ]/g, "");
      const score = cleanTarget === cleanSpoken ? 100 : Math.round((cleanSpoken.length / cleanTarget.length) * 75);
      
      setAccuracy(score);
      onScoreCalculated(score);
    };

    recognition.onerror = () => setIsRecording(false);
  };

  return (
    <div style={{ backgroundColor: "#0f172a", padding: "20px", borderRadius: "16px", border: "1px solid #1e293b" }}>
      <h3 style={{ color: "#fff", margin: "0 0 10px" }}>1. Speech Repetition Drill</h3>
      <p style={{ color: "#94a3b8", fontSize: "13px" }}>Listen to the foreign audio and repeat the exact sentence clearly.</p>

      <button onClick={playAudio} style={commStyles.listenBtn}>🔊 Play Foreign Audio</button>

      <div style={{ marginTop: "16px" }}>
        <button onClick={startRecording} style={isRecording ? commStyles.recordBtnActive : commStyles.recordBtn}>
          {isRecording ? "🎙️ Listening..." : "🎤 Click & Repeat Sentence"}
        </button>
      </div>

      {userTranscript && (
        <div style={{ marginTop: "14px", fontSize: "13px", color: "#cbd5e1" }}>
          You said: <em>"{userTranscript}"</em>
          <div style={{ color: accuracy >= 80 ? "#34d399" : "#f87171", fontWeight: "700", marginTop: "6px" }}>
            Speech Accuracy Score: {accuracy}/100
          </div>
        </div>
      )}
    </div>
  );
}

const commStyles = {
  listenBtn: { padding: "8px 16px", borderRadius: "8px", backgroundColor: "#0284c7", color: "#fff", border: "none", cursor: "pointer", fontWeight: "600" },
  recordBtn: { padding: "10px 18px", borderRadius: "10px", backgroundColor: "#334155", color: "#fff", border: "1px solid #475569", cursor: "pointer", fontWeight: "600" },
  recordBtnActive: { padding: "10px 18px", borderRadius: "10px", backgroundColor: "#ef4444", color: "#fff", border: "none", fontWeight: "600" },
};