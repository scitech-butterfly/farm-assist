import React, { useState } from "react";
import VoiceInput from "../components/VoiceInput";
import { fetchSchemesForQuery, fetchAllSchemes } from "../utils/api";
import SchemeCard from "../components/SchemeCard";

const API_BASE = process.env.REACT_APP_API_URL || "https://farm-assist-backend-3fi2.onrender.com";

export default function Home({ lang }) {
  const [query, setQuery] = useState("");
  const [crops, setCrops] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [familySize, setFamilySize] = useState("");
  const [landSize, setLandSize] = useState("");

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // ✅ Save anonymous search query to backend + localStorage
  const saveUserQuery = async (form) => {
    try {
      const res = await fetch(`${API_BASE}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const saved = await res.json();

      // Save ID for linking during registration
      localStorage.setItem("pendingQuery", saved._id);

      // Save form values so they get prefilled during registration
      localStorage.setItem("pendingQueryData", JSON.stringify(form));
    } catch (err) {
      console.error("Failed to save user query:", err);
    }
  };

  // ✅ NLP/text-based searching
  const fetchSchemesForQuery = async ({ query, crops }) => {
    if (!query.trim()) return;
    setLoading(true);
    setShowAll(false);

    // ✅ Save the user's complete query data for the registration page
    await saveUserQuery({
      query,
      age,
      gender,
      crops,
      familySize,
      landSize,
      name: "", // anonymous user; name is taken during registration
    });

    const res = await fetchSchemesForQuery({ query, crops });
    setSchemes(res);
    setLoading(false);
  };

  // ✅ Load all schemes
  const loadAllSchemes = async () => {
    setLoading(true);
    setShowAll(true);
    try {
      const res = await fetchAllSchemes();
      setSchemes(res);
    } catch (err) {
      console.error("Load all error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Browse All */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <button className="btn" onClick={loadAllSchemes}>Browse All Schemes</button>
      </div>

      {/* Voice + Query Input */}
      <div className="card">
        <VoiceInput
          lang={lang}
          onQueryDetected={(q) => {
            setQuery(q);
            fetchSchemesForQuery({ query: q, crops });
          }}
          onSubmitQuery={({ query, age, gender, crops, familySize, landSize }) => {
            setQuery(query);
            setAge(age);
            setGender(gender);
            setCrops(crops);
            setFamilySize(familySize);
            setLandSize(landSize);

            fetchSchemesForQuery({ query, crops });
          }}
        />
      </div>

      {/* Results */}
      <div className="card" style={{ marginTop: 16 }}>
        {loading ? (
          <div className="small">Loading...</div>
        ) : schemes.length === 0 ? (
          <div className="small" style={{ marginTop: 8 }}>
            {showAll
              ? "No schemes found."
              : query
              ? "No relevant schemes found."
              : "Enter a query or browse all schemes."}
          </div>
        ) : (
          <div className="results-list">
            {schemes.map((s) => (
              <SchemeCard key={s._id || s.id} scheme={s} lang={lang} />
            ))}
          </div>
        )}
      </div>

      {/* Tip */}
      <div className="card small" style={{ marginTop: 12 }}>
        Tip: This demo uses a mocked voice input. Connect your NLP model by setting
        <code> REACT_APP_NLP_API </code> to your deployed endpoint.
      </div>
    </div>
  );
}
