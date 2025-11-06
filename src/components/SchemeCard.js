import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SchemeCard({ scheme }) {
  const navigate = useNavigate();

  // Safe title + description from new schema
  const title = scheme["Scheme Name"] || "No Title";
  const desc = scheme["Description"] || "";

  return (
    <div className="scheme-card">
      <div>
        <div style={{ fontWeight: 800 }}>{title}</div>
        {desc && (
          <div className="small" style={{ marginTop: 6 }}>
            {desc}
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button className="btn" onClick={() => navigate(`/apply/${scheme._id}`)}>
          Apply
        </button>
        <div className="small">Eligibility: see details</div>
      </div>
    </div>
  );
}
