import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: 'Krishi Sahayak',
      subtitle: 'How can we help you today?',
      Guest: 'Guest',
      Dashboard: 'Dashboard',
      Feedback: 'Feedback',
      Profile: 'Profile',
      Search: 'Search'
    }
  },
  hi: {
    translation: {
      title: 'कृषि सहायक',
      subtitle: 'आज हम आपकी कैसे मदद कर सकते हैं?',
      Guest: 'अतिथि',
      Dashboard: 'डैशबोर्ड',
      Feedback: 'प्रतिक्रिया',
      Profile: 'प्रोफ़ाइल',
      Search: 'खोजें'
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
