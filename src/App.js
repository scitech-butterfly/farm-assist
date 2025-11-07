import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Header from './components/Header';
import BottomNav from './components/BottomNav';
import LanguageToggle from './components/LanguageToggle';

import Home from './pages/Home';
import Profile from './pages/Profile';
import LoginRegister from './pages/LoginRegister';
import Apply from './pages/Apply';
import Feedback from './pages/Feedback';

import { AuthProvider } from './utils/auth';

export default function App() {
  const { i18n } = useTranslation();

  // ✅ Load language from storage
  const [lang, setLang] = useState(() => localStorage.getItem('fs_lang') || 'en');

  // ✅ Update language everywhere when user switches
  const changeLanguage = (newLang) => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('fs_lang', newLang);
  };

  // ✅ Apply at first load
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div
          className="app"
          style={{
            backgroundImage: 'url("/images/farmer-bg.jpg")',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            minHeight: "100vh",
          }}
        >

          {/* ✅ Header now gets language + setter */}
          <Header lang={lang} setLang={changeLanguage} />

          {/* ✅ Universal language toggle visible across pages */}
          <LanguageToggle lang={lang} setLang={changeLanguage} />

          <main>
            <Routes>
              <Route path="/" element={<Home lang={lang} />} />
              <Route path="/profile" element={<Profile lang={lang} />} />
              <Route path="/auth" element={<LoginRegister lang={lang} />} />
              <Route path="/apply/:schemeId" element={<Apply lang={lang} />} />
              <Route path="/feedback" element={<Feedback lang={lang} />} />
            </Routes>
          </main>

          <BottomNav lang={lang} />
        </div>
      </Router>
    </AuthProvider>
  );
}
