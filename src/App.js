import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Profile from './pages/Profile';
import LoginRegister from './pages/LoginRegister';
import Apply from './pages/Apply';
import Feedback from './pages/Feedback';
import { AuthProvider } from './utils/auth';

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('fs_lang') || 'en');
  useEffect(() => localStorage.setItem('fs_lang', lang), [lang]);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header lang={lang} setLang={setLang} />

          <main>
            <Routes>
              <Route path="/" element={<Home lang={lang} />} />
              <Route path="/profile" element={<Profile lang={lang} />} />
              <Route path="/auth" element={<LoginRegister lang={lang} />} />
              <Route path="/apply/:schemeId" element={<Apply lang={lang} />} />
              <Route path="/feedback" element={<Feedback />} />
            </Routes>
          </main>

          <BottomNav />
        </div>
      </Router>
    </AuthProvider>
  );
}