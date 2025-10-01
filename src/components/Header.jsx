import React from 'react';
import { Sun, Moon, Languages } from 'lucide-react';

function Header({ darkMode, setDarkMode, lang, toggleLang }) {
  return (
    <header className={`fixed top-0 left-0 w-full ${darkMode ? 'bg-gray-950/80' : 'bg-white/80'} backdrop-blur-md shadow-lg z-50`}>
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
          {lang === 'fa' ? 'تولیدکننده QR' : 'QR Code Generator'}
        </h1>

        <div className="flex items-center gap-4">
          {/* تغییر زبان */}
          <button 
            onClick={toggleLang} 
            className={`flex items-center gap-1 px-3 py-1 rounded-md ${darkMode ? 'bg-gray-800 text-white hover:bg-indigo-600' : 'bg-gray-200 text-gray-800 hover:bg-indigo-400 hover:text-white'} transition`}
          >
            <Languages size={18} />
            {lang === 'fa' ? 'EN' : 'FA'}
          </button>

          {/* تغییر تم */}
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-indigo-600' : 'bg-gray-300 hover:bg-indigo-400'} transition`}
          >
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
