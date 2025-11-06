import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import { fetchAllSchemes } from "../utils/api";

export default function Apply() {
  const { schemeId } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const all = await fetchAllSchemes();
        // match MongoDB _id from URL
        const found = all.find(s => s._id === schemeId);
        setScheme(found);
      } catch (err) {
        console.error("Failed to fetch schemes:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [schemeId]);

  const onApply = () => {
    // ✅ If user is not logged in → go to login page
    if (!user || !token) {
      nav("/auth", { state: { redirectTo: `/apply/${schemeId}` } });
      return;
    }

    // ✅ If logged in → redirect to scheme link (from DB)
    if (scheme?.Link) {
      window.open(scheme.Link, "_blank");
    } else {
      alert("This scheme does not have a valid link.");
    }
  };

  if (loading) return <div className="card">Loading scheme...</div>;
  if (!scheme) return <div className="card">Scheme not found.</div>;

  return (
    <div className="card">
      <h3>{scheme["Scheme Name"]}</h3>
      <p className="small">{scheme["Description"]}</p>

      <div style={{ marginTop: 12 }}>
        <button className="btn" onClick={onApply}>
          Apply to Scheme
        </button>
      </div>
    </div>
  );
}
