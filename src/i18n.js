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
      Search: 'Search',
      dashboard: '🏠 Dashboard',
      feedback: '💬 Feedback',
      profile: '👤 Profile',
      browse_all_schemes: 'Browse All Schemes',
      no_schemes_found: "No schemes found.",
      no_relevant_schemes: "No relevant schemes found.",
      enter_a_query: "Enter a query or browse all schemes.",
      did_you_apply: "Did you apply to this scheme?",
      Description: "Description",
      Eligibility: "✅ Eligibility",
      Benefits: "🌟 Benefits",
      Apply: "Apply"
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
      Search: 'खोजें',
      dashboard: '🏠 डैशबोर्ड',
      feedback: '💬 अभिप्राय',
      profile: '👤 प्रोफ़ाइल',
      browse_all_schemes: 'सभी योजनाएं देखें',
      no_schemes_found: "कोई स्कीम नहीं मिली|",
      no_relevant_schemes: "कोई प्रासंगिक योजनाएँ नहीं मिलीं|",
      enter_a_query: "कोई प्रश्न दर्ज करें या सभी योजनाएं देखें|",
      did_you_apply: "क्या आपने इस योजना के लिए आवेदन किया है?",
      Description: "विवरण",
      Eligibility: "✅ पात्रता",
      Benefits: "🌟 फ़ायदे",
      Apply: "आवेदन करें"
    }
  },
  mr: {
    translation: {
      title: 'कृषि सहायक',
      subtitle: 'आज आम्ही तुम्हाला कशी मदत करू शकतो?',
      Guest: 'पाहुणे',
      dashboard: '🏠 डैशबोर्ड',
      feedback: '💬 अभिप्राय',
      profile: '👤 प्रोफ़ाइल',
      Search: 'शोध',
      browse_all_schemes: 'सर्व योजना पहा',
      no_schemes_found: 'कोई स्कीम नहीं मिली|',
      no_relevant_schemes_found: 'संबंधित योजना आढळल्या नाहीत',
      enter_a_query: 'कोणतेही प्रश्न प्रविष्ट करा या सर्व योजना पहा|',
      did_you_apply: "तुम्ही या योजनेसाठी अर्ज केला आहे का?",
      Description: "वर्णन",
      Eligibility: "✅ पात्रता",
      Benefits: "🌟 फ़ायदे",
      Apply: "लागू करा"
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
