import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/auth";
import { useNavigate, useLocation } from "react-router-dom";
import MicRecorder from "mic-recorder-to-mp3";

const recorder = new MicRecorder({ bitRate: 64 });

export default function LoginRegister() {
  const auth = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const redirectTo = loc.state?.redirectTo;

  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    password: "",
    age: "",
    gender: "",
    crops: "",
    familySize: "",
    landSize: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // 🎙️ Voice state
  const [listening, setListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const pending = localStorage.getItem("pendingQueryData");
    if (pending) {
      const parsed = JSON.parse(pending);
      setForm(prev => ({ ...prev, ...parsed }));
    }
  }, []);


  const fieldQuestions = {
    name: "What is your name?",
    password: "Say your password",
    age: "What is your age?",
    gender: "What is your gender?",
    crops: "What crops do you grow?",
    familySize: "What is your family size?",
    landSize: "How much land do you have?",
  };

  // 🎙️ Start Recording
  const startRecording = (fieldName) => {
    setActiveField(fieldName);
    recorder
      .start()
      .then(() => setListening(true))
      .catch((err) => console.error("Recording error:", err));
  };

  // 🎙️ Stop Recording & Transcribe
  const stopRecording = () => {
    recorder
      .stop()
      .getMp3()
      .then(async ([buffer, blob]) => {
        setListening(false);
        setTranscribing(true);

        const formData = new FormData();
        formData.append("audio", blob, "speech.mp3");

        try {
          const res = await fetch(
            `${process.env.REACT_APP_TRANSCRIBE_URL}/api/transcribe`,
            { method: "POST", body: formData }
          );
          const data = await res.json();

          if (data.text) {
            setForm((prev) => ({
              ...prev,
              [activeField]: data.text,
            }));
          }
        } catch (e) {
          console.error("Transcription failed:", e);
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

  const VoiceButton = ({ fieldName }) => (
    <button
      type="button"
      className="mic-button"
      onClick={() =>
        listening && activeField === fieldName
          ? stopRecording()
          : startRecording(fieldName)
      }
      disabled={listening && activeField !== fieldName}
      style={{
        padding: "6px 10px",
        background:
          listening && activeField === fieldName ? "#ef4444" : "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor:
          listening && activeField !== fieldName ? "not-allowed" : "pointer",
        opacity: listening && activeField !== fieldName ? 0.5 : 1,
      }}
    >
      {listening && activeField === fieldName ? "⏹️" : "🎙️"}
    </button>
  );

  const validateForm = () => {
    if (!form.name.trim()) {
      setErr("Name is required");
      return false;
    }
    if (!form.password.trim()) {
      setErr("Password is required");
      return false;
    }
    if (form.password.length < 6) {
      setErr("Password must be at least 6 characters");
      return false;
    }
    if (isRegister) {
      if (!form.age || parseInt(form.age) < 1) {
        setErr("Please enter a valid age");
        return false;
      }
      if (!form.gender) {
        setErr("Please select gender");
        return false;
      }
      if (!form.crops.trim()) {
        setErr("Please enter crops");
        return false;
      }
      if (!form.familySize || parseInt(form.familySize) < 1) {
        setErr("Please enter family size");
        return false;
      }
      if (!form.landSize || parseFloat(form.landSize) <= 0) {
        setErr("Please enter valid land size");
        return false;
      }
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      let ok = false;
      if (isRegister) {
        ok = await auth.register({form, queryId: localStorage.getItem("pendingQuery")});
        if (!ok)
          setErr("Registration failed. Try another name or check server.");
      } else {
        ok = await auth.login({
          name: form.name,
          password: form.password,
        });
        if (!ok) setErr("Invalid credentials.");
      }
      if (ok) navigate(redirectTo || "/profile");
    } catch (e) {
      setErr(e.message || "Something went wrong. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setErr("");
    setForm({
      name: "",
      password: "",
      age: "",
      gender: "",
      crops: "",
      familySize: "",
      landSize: "",
    });
  };

  return (
    <div className="card">
      {/* 🔊 Instructions Toggle */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <button
          type="button"
          className="voice-button"
          onClick={() => setShowInstructions(!showInstructions)}
          style={{ background: "#10b981", color: "white", borderRadius: 8, padding: "8px 12px", border: "none" }}
        >
          🔊 Instructions
        </button>
      </div>

      {showInstructions && (
        <div
          style={{
            background: "#f0f9ff",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "16px",
            border: "1px solid #bae6fd",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#0369a1" }}>
            How to use voice input:
          </h3>
          <ol
            style={{
              margin: 0,
              paddingLeft: "20px",
              fontSize: "14px",
              color: "#0c4a6e",
            }}
          >
            <li>Click the 🎙️ next to each field</li>
            <li>Speak your answer clearly</li>
            <li>Click ⏹️ to stop</li>
            <li>Wait for transcription</li>
          </ol>
        </div>
      )}

      {/* Status Display */}
      {(listening || transcribing) && (
        <div
          style={{
            padding: "12px",
            background: listening ? "#fef3c7" : "#dbeafe",
            borderRadius: "8px",
            marginBottom: "16px",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {transcribing
            ? "⏳ Transcribing..."
            : listening
            ? `🎙️ Recording: ${fieldQuestions[activeField]}`
            : null}
        </div>
      )}

      <h3>{isRegister ? "Register" : "Login"}</h3>
      <form onSubmit={submit}>
        {/* Name */}
        <div className="form-row" style={{ display: "flex", gap: 8 }}>
          <VoiceButton fieldName="name" />
          <input
            className="input"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={{ flex: 1 }}
          />
        </div>

        {/* Password */}
        <div className="form-row" style={{ display: "flex", gap: 8 }}>
          <VoiceButton fieldName="password" />
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={{ flex: 1 }}
          />
        </div>

        {isRegister && (
          <>
            {/* Age & Gender */}
            <div className="form-row" style={{ display: "flex", gap: 8 }}>
              <VoiceButton fieldName="age" />
              <input
                type="number"
                className="input"
                placeholder="Age"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                min="1"
                required
              />
              <VoiceButton fieldName="gender" />
              <select
                className="input"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Family Size & Land Size */}
            <div className="form-row" style={{ display: "flex", gap: 8 }}>
              <VoiceButton fieldName="familySize" />
              <input
                type="number"
                className="input"
                placeholder="Family Size"
                value={form.familySize}
                onChange={(e) => setForm({ ...form, familySize: e.target.value })}
                min="1"
                required
              />
              <VoiceButton fieldName="landSize" />
              <input
                type="number"
                step="0.1"
                className="input"
                placeholder="Land Size (acres)"
                value={form.landSize}
                onChange={(e) => setForm({ ...form, landSize: e.target.value })}
                min="0.1"
                required
              />
            </div>

            {/* Crops */}
            <div className="form-row" style={{ display: "flex", gap: 8 }}>
              <VoiceButton fieldName="crops" />
              <input
                className="input"
                placeholder="Crops (comma separated)"
                value={form.crops}
                onChange={(e) => setForm({ ...form, crops: e.target.value })}
                required
                style={{ flex: 1 }}
              />
            </div>
          </>
        )}

        {err && (
          <div
            style={{
              color: "crimson",
              marginBottom: 8,
              fontSize: "14px",
            }}
          >
            {err}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Submit"}
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={toggleMode}
            disabled={loading}
          >
            {isRegister ? "Login instead" : "Register instead"}
          </button>
        </div>
      </form>
    </div>
  );
}
