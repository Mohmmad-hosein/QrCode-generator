import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AboutMe from './components/AboutMe';
import Process from './components/Process';
import QRGenerator from './components/QRGenerator';
import QRScanner from './components/QRScanner'; // جدید
import BackToTop from './components/BackToTop';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState('fa');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedLang = localStorage.getItem('lang');
    if (savedTheme) setDarkMode(savedTheme === 'dark');
    if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleLang = () => {
    const newLang = lang === 'fa' ? 'en' : 'fa';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} lang={lang} toggleLang={toggleLang} />
      <main className="flex-grow container mx-auto px-4 py-24 space-y-12">
        <QRGenerator lang={lang} darkMode={darkMode} />
        <QRScanner lang={lang} darkMode={darkMode} /> 
        <Process lang={lang} darkMode={darkMode} />
        <AboutMe lang={lang} darkMode={darkMode} />
      </main>
      <Footer lang={lang} darkMode={darkMode} />
      <BackToTop />
    </div>
  );
}

export default App;