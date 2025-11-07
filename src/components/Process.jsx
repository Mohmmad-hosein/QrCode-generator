import React from 'react';
import { Type, Upload, Download, Settings, Palette, Image as ImageIcon, Wifi, Mail, Phone, Share2, Database } from 'lucide-react';

function Process({ lang, darkMode }) {
  const steps = [
    {
      icon: <Type size={40} className="text-indigo-400" />,
      title: lang === 'fa' ? 'انتخاب نوع QR' : 'Choose QR Type',
      desc: lang === 'fa' ? 'نوع QR رو انتخاب کن (WiFi، ایمیل، تماس و غیره).' : 'Select QR type (WiFi, email, phone, etc.).',
    },
    {
      icon: <Upload size={40} className="text-pink-400" />,
      title: lang === 'fa' ? 'آپلود تصویر یا لوگو' : 'Upload Image or Logo',
      desc: lang === 'fa' ? 'تصویر یا لوگو اضافه کن.' : 'Add image or logo.',
    },
    {
      icon: <Palette size={40} className="text-yellow-400" />,
      title: lang === 'fa' ? 'تغییر رنگ و تنظیمات' : 'Customize Colors & Settings',
      desc: lang === 'fa' ? 'رنگ‌ها و سطح رو تنظیم کن.' : 'Adjust colors and level.',
    },
    {
      icon: <Database size={40} className="text-green-400" />,
      title: lang === 'fa' ? 'استفاده از API خارجی' : 'Use External API',
      desc: lang === 'fa' ? 'برای QR پیشرفته‌تر از API استفاده کن.' : 'Use API for advanced QR.',
    },
    {
      icon: <Download size={40} className="text-cyan-400" />,
      title: lang === 'fa' ? 'دانلود QR' : 'Download QR',
      desc: lang === 'fa' ? 'در فرمت دلخواه دانلود کن.' : 'Download in preferred format.',
    },
    {
      icon: <Share2 size={40} className="text-purple-400" />,
      title: lang === 'fa' ? 'اشتراک‌گذاری' : 'Share QR',
      desc: lang === 'fa' ? 'QR رو مستقیم شیر کن.' : 'Share QR directly.',
    },
  ];

  return (
    <section className={`py-10 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} transition`}>
      <div className="container mx-auto">
        <h2 className={`text-3xl font-bold text-center mb-8 ${darkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>
          {lang === 'fa' ? 'فرایند کار' : 'How It Works'}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className={`p-6 rounded-xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
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