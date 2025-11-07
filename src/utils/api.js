const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
  try {
    const res = await fetch(`${API_BASE}/api/schemes`);
    if (!res.ok) throw new Error('Failed to fetch schemes');
    return res.json();
  } catch (err) {
    console.error('fetchAllSchemes error:', err);
    throw err;
  }
}

// Fetch schemes based on user query
export async function fetchSchemesForQuery({ query }) {
  try {
    const res = await fetch(`${API_BASE}/api/schemes/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) throw new Error("Failed to fetch schemes");

    const data = await res.json();
    return data.schemes || data;   // works with both response shapes
  } catch (err) {
    console.error("fetchSchemesForQuery error:", err);
    return [];
  }
}

// ---------- APPLICATIONS ----------
export async function applyToScheme({ token, schemeId }) {
  try {
    const res = await fetch(`${API_BASE}/api/applications/apply`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ schemeId }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to save application");
    }
    return res.json();
  } catch (err) {
    console.error('applyToScheme error:', err);
    throw err;
  }
}

export async function markApplication({ token, schemeId }) {
  try {
    const res = await fetch(`${API_BASE}/api/applications/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ schemeId })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to save application");
    }
    return res.json();
  } catch (err) {
    console.error('markApplication error:', err);
    throw err;
  }
}

export async function getUserApplications(token) {
  try {
    console.log('📡 Fetching user applications...');
    console.log('API_BASE:', API_BASE);
    console.log('Token:', token ? 'Present' : 'Missing');
    
    const res = await fetch(`${API_BASE}/api/applications/my`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    console.log('Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ getUserApplications failed:", res.status, errorText);
      throw new Error(`Failed to load applications: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    console.log('✅ Applications loaded:', data);
    return data;
  } catch (err) {
    console.error('getUserApplications error:', err);
    throw err;
  }
}

// ---------- FEEDBACK ----------
export async function submitFeedback({ token, schemeId, rating, comment }) {
  try {
    const res = await fetch(`${API_BASE}/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ schemeId, rating, comment }),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to submit feedback");
    }
    return res.json();
  } catch (err) {
    console.error('submitFeedback error:', err);
    throw err;
  }
}