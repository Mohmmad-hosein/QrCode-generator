import React from 'react';

function Footer({ lang, darkMode }) {
  return (
    <footer className={`relative py-6 mt-auto ${darkMode ? 'bg-gray-950' : 'bg-gray-200'} transition`}>
      <div className="relative container flex flex-col md:flex-row justify-between items-center mx-auto text-center text-sm">
        <a
          href="mailto:mohmmadjalali44@email.com"
          className={`transition ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'}`}
        >
          {lang === 'fa' ? 'تماس با من' : 'Contact Me'}
        </a>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2 md:mt-0`}>
          &copy; 2025 MH {lang === 'fa' ? '. همه حقوق محفوظ است' : '. All rights reserved'}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
