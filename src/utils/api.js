const API_BASE = process.env.REACT_APP_API_URL || 'https://farm-assist-backend-3fi2.onrender.com';

// ---------- AUTH ----------
export async function registerUser(data) {
  try {
    console.log('Registering user with:', { ...data, password: '***' });
    console.log('API_BASE:', API_BASE);
    
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error('Non-JSON response:', text);
      throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
    }
    
    const json = await res.json();
    console.log('Register response:', json);
    
    if (!res.ok) {
      throw new Error(json.message || json.error || 'Registration failed');
    }
    
    return json;
  } catch (err) {
    console.error('registerUser error:', err);
    throw err;
  }
}

export async function loginUser(data) {
  try {
    console.log('Logging in user:', data.name);
    console.log('API_BASE:', API_BASE);
    
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error('Non-JSON response:', text);
      throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
    }
    
    const json = await res.json();
    console.log('Login response:', json);
    
    if (!res.ok) {
      throw new Error(json.message || json.error || 'Login failed');
    }
    
    return json;
  } catch (err) {
    console.error('loginUser error:', err);
    throw err;
  }
}

// ---------- SCHEMES ----------
export async function fetchAllSchemes() {
  const res = await fetch(`${API_BASE}/api/schemes`);
  return res.json();
}

// Fetch schemes based on user query
export async function fetchSchemesForQuery({ query, crops }) {
  try {
    const res = await fetch(`${API_BASE}/api/schemes/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, crops }),
    });
    if (!res.ok) throw new Error("Failed to fetch schemes");
    const data = await res.json();
    return data.schemes || [];
  } catch (err) {
    console.error("fetchSchemesForQuery error:", err);
    return [];
  }
}

// ---------- APPLICATIONS ----------
export async function applyToScheme({ token, schemeId }) {
  const res = await fetch(`${API_BASE}/api/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ schemeId }),
  });
  return res.json();
}

export async function getUserApplications(token) {
  const res = await fetch(`${API_BASE}/api/applications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// ---------- FEEDBACK ----------
export async function submitFeedback({ token, schemeId, rating, comment }) {
  const res = await fetch(`${API_BASE}/api/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ schemeId, rating, comment }),
  });
  return res.json();
}