import React, { useState } from "react";
import MicRecorder from "mic-recorder-to-mp3";

const recorder = new MicRecorder({ bitRate: 64 });

export default function VoiceInput({ lang, onSubmitQuery }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [crops, setCrops] = useState("");
  const [familySize, setFamilySize] = useState("");
  const [landSize, setLandSize] = useState("");
  const [query, setQuery] = useState("");
  
  const [activeField, setActiveField] = useState(null);
  const [listening, setListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const fieldQuestions = {
    name: "What is your name?",
    age: "What is your age?",
    gender: "What is your gender?",
    crops: "What crops do you grow?",
    familySize: "What is your family size?",
    landSize: "How much land do you have?",
    query: "What is your query?"
  };

  const startRecording = (fieldName) => {
    setActiveField(fieldName);
    recorder
      .start()
      .then(() => setListening(true))
      .catch((err) => console.error("Recording error:", err));
  };

  const stopRecording = () => {
    recorder
      .stop()
      .getMp3()
      .then(async ([buffer, blob]) => {
        setListening(false);
        setTranscribing(true);

        const formData = new FormData();
        formData.append("audio", blob, "speech.mp3");

        const res = await fetch(
          `${process.env.REACT_APP_TRANSCRIBE_URL}/api/transcribe`,
          { method: "POST", body: formData }
        );

        const data = await res.json();
        
        if (data.text) {
          // Set the appropriate field based on activeField
          switch(activeField) {
            case "name": setName(data.text); break;
            case "age": setAge(data.text); break;
            case "gender": setGender(data.text); break;
            case "crops": setCrops(data.text); break;
            case "familySize": setFamilySize(data.text); break;
            case "landSize": setLandSize(data.text); break;
            case "query": setQuery(data.text); break;
            default: break;
          }
        }
        
        setTranscribing(false);
        setActiveField(null);
      })
      .catch((err) => {
        console.error("Stop recording error:", err);
        setListening(false);
        setTranscribing(false);
        setActiveField(null);
      });
  };

  const submit = () => {
    if (onSubmitQuery)
      onSubmitQuery({ name, age, gender, crops, familySize, landSize, query });
  };

  const VoiceButton = ({ fieldName }) => (
    <button
      className="mic-button"
      onClick={() => listening && activeField === fieldName ? stopRecording() : startRecording(fieldName)}
      disabled={listening && activeField !== fieldName}
      style={{
        padding: "8px 12px",
        background: listening && activeField === fieldName ? "#ef4444" : "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: listening && activeField !== fieldName ? "not-allowed" : "pointer",
        fontSize: "18px",
        opacity: listening && activeField !== fieldName ? 0.5 : 1
      }}
    >
      {listening && activeField === fieldName ? "⏹️" : "🎙️"}
    </button>
  );

  return (
    <div className="card">
      {/* Instructions Speaker Button */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <button
          className="voice-button"
          onClick={() => setShowInstructions(!showInstructions)}
          style={{ background: "#10b981" }}
        >
          🔊
          <div>Instructions</div>
        </button>
      </div>

      {/* Instructions Panel */}
      {showInstructions && (
        <div style={{
          background: "#f0f9ff",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "16px",
          border: "1px solid #bae6fd"
        }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#0369a1" }}>
            How to use voice input:
          </h3>
          <ol style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", color: "#0c4a6e" }}>
            <li>Click the 🎙️ button next to each field</li>
            <li>Speak your answer clearly</li>
            <li>Click ⏹️ to stop recording</li>
            <li>Wait for transcription to complete</li>
            <li>Repeat for all fields</li>
            <li>Click "Search" when done</li>
          </ol>
        </div>
      )}

      {/* Status Display */}
      {(listening || transcribing) && (
        <div style={{
          padding: "12px",
          background: listening ? "#fef3c7" : "#dbeafe",
          borderRadius: "8px",
          marginBottom: "16px",
          textAlign: "center",
          fontSize: "14px",
          fontWeight: "500"
        }}>
          {transcribing ? (
            "⏳ Transcribing..."
          ) : listening ? (
            <>🎙️ Recording: {fieldQuestions[activeField]}</>
          ) : null}
        </div>
      )}

      {/* Form Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Name */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <VoiceButton fieldName="name" />
          <input
            className="input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>

        {/* Age & Gender */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: 1, display: "flex", gap: "8px", alignItems: "center" }}>
            <VoiceButton fieldName="age" />
            <input
              className="input"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ flex: 1, display: "flex", gap: "8px", alignItems: "center" }}>
            <VoiceButton fieldName="gender" />
            <select
              className="input"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Family Size & Land Size */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: 1, display: "flex", gap: "8px", alignItems: "center" }}>
            <VoiceButton fieldName="familySize" />
            <input
              className="input"
              placeholder="Family Size"
              value={familySize}
              onChange={(e) => setFamilySize(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ flex: 1, display: "flex", gap: "8px", alignItems: "center" }}>
            <VoiceButton fieldName="landSize" />
            <input
              className="input"
              placeholder="Land Size (acres)"
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {/* Crops */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <VoiceButton fieldName="crops" />
          <input
            className="input"
            placeholder="Crops (comma separated)"
            value={crops}
            onChange={(e) => setCrops(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>

        {/* Query */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <VoiceButton fieldName="query" />
          <input
            className="input"
            placeholder="Your query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>

        {/* Submit Button */}
        <button
          className="btn"
          onClick={submit}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px"
          }}
        >
          Search Schemes
        </button>
      </div>
    </div>
  );
}