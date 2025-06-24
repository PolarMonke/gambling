import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/LanguageSlotMachine.css';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'be', name: 'Belarusian', flag: '🇧🇾' },
  { code: 'ch', name: 'Chinese', flag: '🇨🇳' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'jp', name: 'Japanese', flag: '🇯🇵' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'sp', name: 'Spanish', flag: '🇪🇸' },
  { code: 'ps', name: 'Prison', flag: '🔐' },
  { code: 'gay', name: 'Gay', flag: '🏳️‍🌈' }
];

const LanguageSlotMachine = () => {
  const { i18n } = useTranslation();
  const [spinning, setSpinning] = useState(false);
  const [displayLanguage, setDisplayLanguage] = useState(
    LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0]
  );

  const spin = () => {
    if (spinning) return;
    
    setSpinning(true);
    const spinDuration = 1000; // 1 second spin
    const startTime = Date.now();
    
    const spinInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // Show random languages during spin
      if (progress < 1) {
        const randomIndex = Math.floor(Math.random() * LANGUAGES.length);
        setDisplayLanguage(LANGUAGES[randomIndex]);
      } else {
        clearInterval(spinInterval);
        // Select a random language (but different from current)
        let newLang;
        do {
          newLang = LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)];
        } while (newLang.code === i18n.language && LANGUAGES.length > 1);
        
        i18n.changeLanguage(newLang.code);
        setDisplayLanguage(newLang);
        setSpinning(false);
      }
    }, 100);
  };

  return (
    <div className="language-slot-machine">
      <button 
        onClick={spin}
        disabled={spinning}
        className={`language-slot ${spinning ? 'spinning' : ''}`}
      >
        <span className="language-flag">{displayLanguage.flag}</span>
        <span className="language-code">{displayLanguage.code.toUpperCase()}</span>
      </button>
    </div>
  );
};

export default LanguageSlotMachine;