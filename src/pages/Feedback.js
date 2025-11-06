// src/pages/Feedback.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/auth";
import { getUserApplications, submitFeedback } from "../utils/api";

export default function Feedback() {
  const { user, token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!token) return;
    async function loadApps() {
      const res = await getUserApplications(token);
      if (res.applications) setApplications(res.applications);
      setLoading(false);
    }
    loadApps();
  }, [token]);

  const handleSubmit = async (schemeId) => {
    const { rating, comment } = feedback[schemeId] || {};
    const res = await submitFeedback({ token, schemeId, rating, comment });
    if (res.success) {
      setSubmitted(true);
      alert("Feedback submitted!");
    } else {
      alert("Error submitting feedback");
    }
  };

  if (!user) return <div className="card">Please log in to submit feedback.</div>;
  if (loading) return <div className="card">Loading your applications...</div>;

  return (
    <div className="card">
      <h3>Your Applied Schemes</h3>
      {applications.length === 0 ? (
        <p className="small">No applied schemes yet.</p>
      ) : (
        applications.map((app) => (
          <div key={app.schemeId} className="border p-2 my-2 rounded">
            <strong>{app.schemeTitle}</strong>
            <div>
              <input
                type="number"
                min="1"
                max="5"
                placeholder="Rating (1-5)"
                value={feedback[app.schemeId]?.rating || ""}
                onChange={(e) =>
                  setFeedback((f) => ({
                    ...f,
                    [app.schemeId]: {
                      ...f[app.schemeId],
                      rating: e.target.value,
                    },
                  }))
                }
              />
              <textarea
                placeholder="Your comments"
                value={feedback[app.schemeId]?.comment || ""}
                onChange={(e) =>
                  setFeedback((f) => ({
                    ...f,
                    [app.schemeId]: {
                      ...f[app.schemeId],
                      comment: e.target.value,
                    },
                  }))
                }
              />
              <button
                className="btn"
                onClick={() => handleSubmit(app.schemeId)}
                disabled={submitted}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
