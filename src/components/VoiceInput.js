import React, { useState, useRef } from "react";
import MicRecorder from "mic-recorder-to-mp3";
import { useTranslation } from 'react-i18next';

const recorder = new MicRecorder({ bitRate: 64 });

export default function VoiceInput({ lang, onSubmitQuery }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [crops, setCrops] = useState("");
  const [familySize, setFamilySize] = useState("");
  const [landSize, setLandSize] = useState("");
  const [query, setQuery] = useState("");
  const { t } = useTranslation();
  
  const [activeField, setActiveField] = useState(null);
  const [listening, setListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);


  const englishAudioRef = useRef(null);
  const hindiAudioRef = useRef(null);
  const marathiAudioRef = useRef(null);

  // 🎛 State to manage which audio is active
  const [activeLang, setActiveLang] = useState(null); // "en", "hi", "mr"
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // 🎵 Play audio for a specific language
  const playAudio = (langCode) => {
    stopAllAudio(); // stop others before playing new
    let ref = null;
    if (langCode === "en") ref = englishAudioRef.current;
    if (langCode === "hi") ref = hindiAudioRef.current;
    if (langCode === "mr") ref = marathiAudioRef.current;

    if (ref) {
      ref.currentTime = 0;
      ref.play();
      setActiveLang(langCode);
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  // ⏸ Pause the active audio
  const pauseAudio = () => {
    let ref = getActiveAudioRef();
    if (ref) {
      ref.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  // ▶ Resume
  const resumeAudio = () => {
    let ref = getActiveAudioRef();
    if (ref) {
      ref.play();
      setIsPaused(false);
      setIsPlaying(true);
    }
  };

  // ⏹ Stop
  const stopAudio = () => {
    let ref = getActiveAudioRef();
    if (ref) {
      ref.pause();
      ref.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setActiveLang(null);
  };

  // 🧠 Helper to get currently active ref
  const getActiveAudioRef = () => {
    if (activeLang === "en") return englishAudioRef.current;
    if (activeLang === "hi") return hindiAudioRef.current;
    if (activeLang === "mr") return marathiAudioRef.current;
    return null;
  };

  // 🚫 Stop all before switching
  const stopAllAudio = () => {
    [englishAudioRef, hindiAudioRef, marathiAudioRef].forEach((ref) => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Reset state when audio ends naturally
  const handleAudioEnd = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setActiveLang(null);
  };
  
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
      {/* 🔊 Hidden Audio Player */}
      <audio
        ref={englishAudioRef}
        src={`${process.env.PUBLIC_URL}/audio/instructions_en.mp3`}
        preload="auto"
        onEnded={handleAudioEnd}
      />
      <audio
        ref={hindiAudioRef}
        src={`${process.env.PUBLIC_URL}/audio/instructions_hi.mp3`}
        preload="auto"
        onEnded={handleAudioEnd}
      />
      <audio
        ref={marathiAudioRef}
        src="/audio/instructions_mr.mp3"
        preload="auto"
        onEnded={handleAudioEnd}
      />

      {/* 🌐 Language Audio Control Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
          marginBottom: 16,
        }}
      >
        <button
          onClick={() => playAudio("en")}
          disabled={activeLang === "en" && isPlaying}
          style={{
            background: activeLang === "en" ? "#2563eb" : "#3b82f6",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🇬🇧 English
        </button>

        <button
          onClick={() => playAudio("hi")}
          disabled={activeLang === "hi" && isPlaying}
          style={{
            background: activeLang === "hi" ? "#dc2626" : "#ef4444",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🇮🇳 हिंदी
        </button>

        <button
          onClick={() => playAudio("mr")}
          disabled={activeLang === "mr" && isPlaying}
          style={{
            background: activeLang === "mr" ? "#059669" : "#10b981",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🇲🇷 मराठी
        </button>

        {/* Pause / Resume / Stop buttons */}
        {(isPlaying || isPaused) && (
          <>
            {isPlaying && (
              <button
                onClick={pauseAudio}
                style={{
                  background: "#f59e0b",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "8px",
                }}
              >
                ⏸ Pause
              </button>
            )}

            {isPaused && (
              <button
                onClick={resumeAudio}
                style={{
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "8px",
                }}
              >
                ▶ Resume
              </button>
            )}

            <button
              onClick={stopAudio}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "8px",
              }}
            >
              ⏹ Stop
            </button>
          </>
        )}
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
          {t("Search")}
        </button>
      </div>
    </div>
  );
}