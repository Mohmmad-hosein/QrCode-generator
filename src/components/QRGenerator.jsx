import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import imageCompression from "browser-image-compression";

function QRGenerator({ lang, darkMode }) {  // نام کامپوننت رو درست کردم (QrCodeGenerator -> QRGenerator)
  const [qrValue, setQrValue] = useState("");
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");
  const [qrLevel, setQrLevel] = useState("H"); // سطح جدید برای QR
  const qrRef = useRef(null); // برای دانلود

  const handleTextChange = (e) => {
    setError("");
    setInputText(e.target.value);
    setQrValue(e.target.value);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setError("");
      const options = {
        maxSizeMB: 0.05,
        maxWidthOrHeight: 100,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        if (base64data.length > 3000) {
          setError(lang === "fa" ? "عکس خیلی بزرگ است." : "Image too large.");
          return;
        }
        setQrValue(base64data);
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      setError(lang === "fa" ? "خطا در پردازش." : "Processing error.");
    }
  };

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qrcode.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <section className={`py-10 rounded-2xl shadow-xl transition ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
      <div className="container mx-auto text-center">
        <h2 className={`text-3xl font-bold mb-6 ${darkMode ? "text-pink-300" : "text-pink-600"}`}>
          {lang === "fa" ? "تولید کننده QR" : "QR Code Generator"}
        </h2>

        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            placeholder={lang === 'fa' ? 'لینک یا متن...' : 'Enter text or link...'}
            value={inputText}
            onChange={handleTextChange}
            className={`w-full max-w-md p-3 mb-6 rounded-xl border-2 shadow-md focus:outline-none ${darkMode ? 'bg-gray-900 text-white border-gray-600 focus:border-indigo-400' : 'bg-gray-100 text-black border-gray-300 focus:border-indigo-600'}`}
          />

          <div className="mb-6">
            <label className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {lang === "fa" ? "یا تصویر آپلود کن:" : "Or upload image:"}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full max-w-md cursor-pointer text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-500 file:text-white hover:file:bg-pink-500 transition"
            />
          </div>

          {/* سطح QR */}
          <select
            value={qrLevel}
            onChange={(e) => setQrLevel(e.target.value)}
            className={`w-full max-w-md p-3 mb-6 rounded-xl border-2 shadow-md focus:outline-none ${darkMode ? 'bg-gray-900 text-white border-gray-600' : 'bg-gray-100 text-black border-gray-300'}`}
          >
            <option value="L">Low</option>
            <option value="M">Medium</option>
            <option value="Q">Quartile</option>
            <option value="H">High</option>
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {qrValue && (
            <div ref={qrRef} className="mt-6 p-4 bg-white rounded-xl shadow-lg">
              <QRCodeCanvas
                value={qrValue}
                size={500}
                bgColor={darkMode ? "#000000" : "#ffffff"}
                fgColor={darkMode ? "#ffffff" : "#000000"}
                level={qrLevel}
              />
            </div>
          )}

          {qrValue && (
            <button onClick={downloadQR} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-pink-600 transition">
              {lang === 'fa' ? 'دانلود QR' : 'Download QR'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default React.memo(QRGenerator); // بهینه‌سازی با memo