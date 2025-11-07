import React from 'react';
import { useAuth } from '../utils/auth';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './LanguageToggle';

export default function Header() {
  const auth = useAuth();
  const { t } = useTranslation();

  return (
    <header className="header">
      <div className="brand">
        <div className="logo">KS</div>
        <div>
          <h1>{t('title')}</h1>
          <p className="small">{t('subtitle')}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {auth.user ? (
          <div className="small">{auth.user.name}</div>
        ) : (
          <div className="small">{t('Guest')}</div>
        )}
      </div>
    </header>
  );
}
