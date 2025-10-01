import React from 'react';
import { Type, Upload, Download } from 'lucide-react';

function Process({ lang, darkMode }) {
  const steps = [
    {
      icon: <Type size={40} className="text-indigo-400" />,
      title: lang === 'fa' ? 'متن یا لینک' : 'Text or Link',
      desc: lang === 'fa' ? 'متن یا لینک رو وارد کن.' : 'Enter your text or link.',
    },
    {
      icon: <Upload size={40} className="text-pink-400" />,
      title: lang === 'fa' ? 'آپلود تصویر' : 'Upload Image',
      desc: lang === 'fa' ? 'در صورت نیاز تصویر آپلود کن.' : 'Upload an image if needed.',
    },
    {
      icon: <Download size={40} className="text-cyan-400" />,
      title: lang === 'fa' ? 'دانلود QR' : 'Download QR',
      desc: lang === 'fa' ? 'کد QR تولید شده رو دانلود کن.' : 'Download the generated QR code.',
    },
  ];

  return (
    <section className={`relative py-10 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} transition`}>
      <div className="relative container mx-auto">
        <h2 className={`text-3xl font-bold text-center mb-8 ${darkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>
          {lang === 'fa' ? 'فرایند کار' : 'How It Works'}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`p-6 rounded-xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
            >
              {step.icon}
              <h3 className="text-xl font-semibold mt-4">{step.title}</h3>
              <p className="mt-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Process;
