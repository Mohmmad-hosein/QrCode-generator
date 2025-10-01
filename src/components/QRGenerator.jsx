import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Upload } from 'lucide-react';

function QRGenerator({ lang, darkMode }) {
  const [inputText, setInputText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const qrRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
        setInputText('');
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qr-code.png';
    link.click();
  };

  return (
    <section className={`relative py-10 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} transition`}>
      <div className="relative container mx-auto text-center">
        <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
          {lang === 'fa' ? 'تولید QR کد' : 'Generate QR Code'}
        </h2>
        <input
          type="text"
          placeholder={lang === 'fa' ? 'لینک یا متن رو وارد کن...' : 'Enter text or link...'}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className={`w-full max-w-md p-3 mb-6 rounded-xl border-2 shadow-md focus:outline-none ${darkMode ? 'bg-gray-900 text-white border-gray-600 focus:border-indigo-400' : 'bg-gray-100 text-black border-gray-300 focus:border-indigo-600'}`}
        />
        <div className="mb-6">
          <label htmlFor="image-upload" className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {lang === 'fa' ? 'یا یه تصویر آپلود کن:' : 'Or upload an image:'}
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full max-w-md cursor-pointer text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-500 file:text-white hover:file:bg-pink-500 transition"
          />
        </div>
        {(inputText || imageUrl) && (
          <div className="flex flex-col items-center space-y-4" ref={qrRef}>
            <QRCodeCanvas
              value={inputText || imageUrl}
              size={256}
              bgColor={darkMode ? "#000000" : "#ffffff"}
              fgColor={darkMode ? "#ffffff" : "#000000"}
              level="H"
            />
            <button
              onClick={downloadQR}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-pink-600 transition shadow-lg"
            >
              <Download size={20} /> {lang === 'fa' ? 'دانلود QR کد' : 'Download QR Code'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default QRGenerator;
