import React, { useState, useEffect } from "react";

const LanguageToggle = () => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "sw" : "en");
  };

  return (
    <button className="lang-toggle-btn" onClick={toggleLanguage}>
      {language === "en" ? "🇬🇧 English" : "🇰🇪 Kiswahili"}
    </button>
  );
};

export default LanguageToggle;
