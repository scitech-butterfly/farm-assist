import React from "react";
import { Link } from "react-router-dom";
import "./BottomNav.css";
import { useTranslation } from 'react-i18next';



export default function BottomNav() {
  const { t } = useTranslation();
  return (
    <nav className="bottom-nav">
      <Link to="/">{t("dashboard")}</Link>
      <Link to="/feedback">{t("feedback")}</Link>
      <Link to="/profile">{t("profile")}</Link>
    </nav>
  );
}
