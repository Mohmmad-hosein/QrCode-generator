import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import jsQR from 'jsqr';

function QRScanner({ lang, darkMode }) {
  const [scanResult, setScanResult] = useState("");
  const [scanError, setScanError] = useState("");
  const [useCamera, setUseCamera] = useState(true); // برای سوییچ بین دوربین و آپلود

  const handleScan = (result, error) => {
    if (result) {
      setScanResult(result.text || result);
    }
    if (error) {
      setScanError(lang === "fa" ? "خطا در اسکن." : "Scan error.");
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setScanResult(code.data);
        } else {
          setScanError(lang === "fa" ? "QR کد پیدا نشد." : "No QR code found.");
        }
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className={`py-12 rounded-3xl shadow-2xl transition-colors duration-300 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-8 ${darkMode ? "text-cyan-300" : "text-cyan-600"}`}>
          {lang === "fa" ? "اسکنر QR" : "QR Scanner"}
        </h2>

        <div className="flex justify-center mb-6">
          <button onClick={() => setUseCamera(true)} className={`px-4 py-2 rounded-l-lg ${useCamera ? "bg-indigo-600 text-white" : "bg-gray-600 text-gray-300"} hover:bg-indigo-700 transition`}>
            {lang === "fa" ? "دوربین" : "Camera"}
          </button>
          <button onClick={() => setUseCamera(false)} className={`px-4 py-2 rounded-r-lg ${!useCamera ? "bg-indigo-600 text-white" : "bg-gray-600 text-gray-300"} hover:bg-indigo-700 transition`}>
            {lang === "fa" ? "آپلود عکس" : "Upload Image"}
          </button>
        </div>

        <div className="max-w-md mx-auto">
          {useCamera ? (
            <QrReader
              onResult={handleScan}
              style={{ width: '100%' }}
              constraints={{ facingMode: 'environment' }}
            />
          ) : (
            <div className={`p-5 rounded-xl shadow-md ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"} border text-center`}>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <div className="py-8 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  {lang === "fa" ? "عکس QR آپلود کن" : "Upload QR Image"}
                </div>
              </label>
            </div>
          )}
        </div>

        {scanResult && (
          <div className="mt-6 p-4 rounded-lg text-center bg-green-100 dark:bg-green-900">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              {lang === "fa" ? "نتیجه:" : "Result:"}
            </p>
            <p className="mt-1 break-all text-gray-800 dark:text-gray-200">{scanResult}</p>
          </div>
        )}

        {scanError && <p className="mt-4 text-red-500 text-center text-sm">{scanError}</p>}
      </div>
    </section>
  );
}

export default QRScanner;