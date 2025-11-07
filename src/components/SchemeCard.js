import React, { useState } from 'react';
import { useAuth } from '../utils/auth';
import { markApplication } from '../utils/api';
import './SchemeCard.css';
import { useTranslation } from 'react-i18next';

export default function SchemeCard({ scheme }) {
  const auth = useAuth();
  const { token } = auth;
  const { t } = useTranslation();

  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ Safe field handling for both NLP and DB schemes
  const title = scheme.name || scheme["Scheme Name"] || "No Title";

  const description =
    scheme.description ||
    scheme["Description"] ||
    scheme.formatted_answer || // NLP descriptions
    "";

  const eligibility =
    scheme.eligibility ||
    scheme["Eligibility"] ||
    "";

  const benefits =
    scheme.benefits ||
    scheme["Benefits"] ||
    "";

  const link =
    scheme.link ||
    scheme.Link ||
    scheme["URL"] ||
    "";

  // ✅ Split description into readable chunks
  const formattedSentences = description
    .replace(/\s*\.\s*/g, ".|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // ✅ Helper: format long text into clean sentences
  const formatText = (text) =>
    text
      .replace(/\s*\.\s*/g, ".|")
      .split("|")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);


  const handleApply = () => {
    if (link) {
      window.open(link, "_blank");
    }
    setShowConfirm(true);
  };

  const confirmApplied = async () => {
    try {
      await markApplication({ token, schemeId: scheme._id });
      alert("✅ Application saved!");
      setShowConfirm(false);
      auth.setHasNewApplication(true);
    } catch (err) {
      console.error(err);
      alert("Failed to save application");
    }
  };

  return (
    <div className="scheme-card">
      <h2 className="scheme-title">🌾 {title}</h2>

      {/* ✅ Description */}
      <div className="scheme-description">
        {formattedSentences.map((sentence, i) => (
          <p key={i} style={{ marginBottom: "10px", lineHeight: "1.6" }}>
            {sentence}
          </p>
        ))}
      </div>

      {/* ✅ Eligibility */}
        {eligibility && (
          <div className="scheme-section">
            <h4 className="scheme-subtitle">{t("Eligibility")}</h4>
            {formatText(eligibility).map((line, i) => (
              <p key={i} className="scheme-text">
                • {line}
              </p>
            ))}
          </div>
        )}

        {/* ✅ Benefits */}
        {benefits && (
          <div className="scheme-section">
            <h4 className="scheme-subtitle">{t("Benefits")}</h4>
            {formatText(benefits).map((line, i) => (
              <p key={i} className="scheme-text">
                • {line}
              </p>
            ))}
          </div>
        )}


      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
        <button className="btn" onClick={handleApply}>{t("Apply")}</button>
        <div className="small">Click "Apply" to visit the official site</div>
      </div>

      {/* ✅ Centered Modal Overlay */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">{t("did_you_apply")}</h3>

            <div className="modal-actions">
              <button className="btn" onClick={confirmApplied}>Yes</button>
              <button className="btn-ghost" onClick={() => setShowConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
