import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/auth";
import { getUserApplications } from "../utils/api";
import { Link } from "react-router-dom";

export default function Profile() {
  const auth = useAuth();
  const user = auth.user;
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const loadApps = async () => {
      if (!auth.token) return;
      const res = await getUserApplications(auth.token);
      setApplications(res.applications || []);
    };
    loadApps();
  }, [auth.token]);

  if (!user)
    return (
      <div className="card">
        Please <Link to="/auth">login</Link> to view your profile.
      </div>
    );

  return (
    <div>
      <div className="card profile-grid">
        <div>
          <div style={{ fontWeight: 900, fontSize: 20 }}>{user.name}</div>
          <div className="small">Age: {user.age}</div>
          <div className="small">Gender: {user.gender}</div>
          <div className="small">Crops: {user.crops}</div>
          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={auth.logout}>
              Logout
            </button>
          </div>
        </div>
        <div>
          <h4>Applied Schemes</h4>
          {applications.length === 0 ? (
            <div className="small">No applications yet.</div>
          ) : (
            <div className="results-list">
              {applications.map((app) => (
                <div key={app.schemeId} className="scheme-card">
                  <div style={{ fontWeight: 800 }}>{app.schemeTitle}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
