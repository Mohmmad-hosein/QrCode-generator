import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import imageCompression from "browser-image-compression";

function QrCodeGenerator({ lang, darkMode }) {
  const [qrValue, setQrValue] = useState("");
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");

  // هندل متن
  const handleTextChange = (e) => {
    setError("");
    setInputText(e.target.value);
    setQrValue(e.target.value);
  };

  // هندل آپلود عکس با فشرده‌سازی
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setError("");
      const options = {
        maxSizeMB: 0.05, // حداکثر 50KB
        maxWidthOrHeight: 100, // عکس رو کوچیک کن
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;

        // اگر بعد از فشرده‌سازی هم خیلی بزرگ بود
        if (base64data.length > 3000) {
          setError(
            lang === "fa"
              ? "عکس خیلی بزرگ است، لطفاً عکس کوچک‌تری انتخاب کنید."
              : "Image is too large, please choose a smaller one."
          );
          return;
        }

        setQrValue(base64data);
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      console.error("Image compression error:", err);
      setError(
        lang === "fa" ? "خطا در پردازش تصویر." : "Error processing the image."
      );
    }
  };

  return (
    <section
      className={`py-10 rounded-2xl shadow-xl transition ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="container mx-auto text-center">
        <h2
          className={`text-3xl font-bold mb-6 ${
            darkMode ? "text-pink-300" : "text-pink-600"
          }`}
        >
          {lang === "fa" ? "تولید کننده QR" : "QR Code Generator"}
        </h2>

        <div className="flex flex-col items-center space-y-4">
          {/* ورودی متن */}
        <input
          type="text"
          placeholder={lang === 'fa' ? 'لینک یا متن رو وارد کن...' : 'Enter text or link...'}
          value={inputText}
          onChange={handleTextChange}
          className={`w-full max-w-md p-3 mb-6 rounded-xl border-2 shadow-md focus:outline-none ${darkMode ? 'bg-gray-900 text-white border-gray-600 focus:border-indigo-400' : 'bg-gray-100 text-black border-gray-300 focus:border-indigo-600'}`}
        />

          {/* ورودی عکس */}
          <div className="mb-6">
            <label
              htmlFor="image-upload"
              className={`block mb-2 font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {lang === "fa" ? "یا یه تصویر آپلود کن:" : "Or upload an image:"}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full max-w-md cursor-pointer text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-500 file:text-white hover:file:bg-pink-500 transition"
            />
          </div>

          {/* نمایش خطا */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* QR Code */}
          {qrValue && (
            <div className="mt-6 p-4 bg-white rounded-xl shadow-lg">
              <QRCodeCanvas
                value={qrValue}
                size={500}
                bgColor={darkMode ? "#000000" : "#ffffff"}
                fgColor={darkMode ? "#ffffff" : "#000000"}
                level="H"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default QrCodeGenerator;
