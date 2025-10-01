import React from 'react';
import { FaLinkedin, FaGithub, FaTelegram } from 'react-icons/fa';

function AboutMe({ lang, darkMode }) {
  return (
    <section
      className={`relative py-10 rounded-2xl shadow-xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } transition`}
    >
      <div className="relative container mx-auto text-center">
        <h2
          className={`text-3xl font-bold mb-6 ${
            darkMode ? 'text-pink-300' : 'text-pink-600'
          }`}
        >
          {lang === 'fa' ? 'درباره من' : 'About Me'}
        </h2>
        <p
          className={`${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          } leading-relaxed max-w-2xl mx-auto mb-8`}
        >
          {lang === 'fa'
            ? 'سلام! من MH هستم، توسعه‌دهنده وب با تمرکز روی React. این ابزار رو ساختم تا نشون بدم چقدر ساده میشه ابزارهای مفید ساخت.'
            : 'Hi! I am MH, a web developer focused on React. I built this tool to show how easy it is to create useful apps.'}
        </p>

        {/* کارت‌های شبکه‌های اجتماعی */}
        <div className="flex justify-center gap-6 flex-wrap">
          <a
            href="https://www.linkedin.com/in/seyed-mohammad-hossein-jalali-7745a8334"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-md transform transition hover:scale-105 ${
              darkMode
                ? 'bg-gray-700 text-pink-300 hover:bg-gray-600'
                : 'bg-gray-100 text-pink-600 hover:bg-gray-200'
            }`}
          >
            <FaLinkedin size={24} />
            <span>{lang === 'fa' ? 'لینکدین' : 'LinkedIn'}</span>
          </a>

          <a
            href="https://github.com/Mohmmad-hosein"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-md transform transition hover:scale-105 ${
              darkMode
                ? 'bg-gray-700 text-pink-300 hover:bg-gray-600'
                : 'bg-gray-100 text-pink-600 hover:bg-gray-200'
            }`}
          >
            <FaGithub size={24} />
            <span>{lang === 'fa' ? 'گیت‌هاب' : 'GitHub'}</span>
          </a>

          <a
            href="https://t.me/Mohammad_jalali78"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-md transform transition hover:scale-105 ${
              darkMode
                ? 'bg-gray-700 text-pink-300 hover:bg-gray-600'
                : 'bg-gray-100 text-pink-600 hover:bg-gray-200'
            }`}
          >
            <FaTelegram size={24} />
            <span>{lang === 'fa' ? 'تلگرام' : 'Telegram'}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default AboutMe;
