import React, { useState } from "react";
import VoiceInput from "../components/VoiceInput";
import { fetchSchemesForQuery, fetchAllSchemes } from "../utils/api";
import SchemeCard from "../components/SchemeCard";
import { useTranslation } from 'react-i18next';

const API_BASE = process.env.REACT_APP_API_URL || "https://farm-assist-backend-3fi2.onrender.com";
const API_BASE1 = "https://nand0zz-farmassist.hf.space"
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
      const res = await fetch(`${API_BASE}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const saved = await res.json();

      localStorage.setItem("pendingQuery", saved._id);
      localStorage.setItem("pendingQueryData", JSON.stringify(form));
    } catch (err) {
      console.error("Failed to save user query:", err);
    }
  };

  // ✅ MAIN SEARCH HANDLER (renamed to avoid conflict)
  const handleSearchSchemes = async ({ query }) => {
  if (!query?.trim()) return;

  setLoading(true);
  setShowAll(false);

  await saveUserQuery({
    query,
    age,
    gender,
    crops,       // ✅ can keep for saving user profile
    familySize,
    landSize,
    name: "",
  });

  const res = await fetchSchemesForQuery({ query });  // ✅ only query
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

  const { t } = useTranslation();

  return (
    <div>
  {/* ✅ YouTube Intro Video */}
  <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
    <iframe
      width="800"
      height="450"
      src="https://www.youtube.com/embed/xecxVzAha8o?autoplay=1&mute=1&controls=1&loop=0"
      title="Farm Assist Intro Video"
      style={{ border: "none", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  </div>
      {/* Browse All */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <button className="btn" onClick={loadAllSchemes}>{t("browse_all_schemes")}</button>
      </div>

      {/* Voice + Query Input */}
      <div className="card">
        <VoiceInput
          lang={lang}
          onSubmitQuery={({ query, age, gender, crops, familySize, landSize }) => {
            setQuery(query);
            setAge(age);
            setGender(gender);
            setCrops(crops);
            setFamilySize(familySize);
            setLandSize(landSize);

            handleSearchSchemes({ query});
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
              ? t("no_schemes_found")
              : query
              ? t("no_relevant_schemes") 
              : t("enter_a_query")}
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