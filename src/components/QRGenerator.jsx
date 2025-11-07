import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import imageCompression from "browser-image-compression";
import { Download, Settings, Image as ImageIcon, Palette, Link, FileImage, Share2, Wifi, Mail, Phone } from "lucide-react"; 

function QRGenerator({ lang, darkMode }) {
  const [qrType, setQrType] = useState("text");
  const [qrValue, setQrValue] = useState("");
  const [inputText, setInputText] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [qrLevel, setQrLevel] = useState("H");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logo, setLogo] = useState(null);
  const [qrSize, setQrSize] = useState(300);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("png");
  const [downloadQuality, setDownloadQuality] = useState(1);
  const [useApi, setUseApi] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiQrUrl, setApiQrUrl] = useState("");
  const qrRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      setFgColor("#ffffff");
      setBgColor("#1a1a1a");
    } else {
      setFgColor("#000000");
      setBgColor("#ffffff");
    }
  }, [darkMode]);

  const generateQrValue = () => {
    let value = "";
    switch (qrType) {
      case "wifi":
        value = `WIFI:S:${wifiSsid};T:WPA;P:${wifiPass};;`;
        break;
      case "email":
        value = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}`;
        break;
      case "phone":
        value = `tel:${phone}`;
        break;
      default:
        value = inputText;
    }
    setQrValue(value);
    if (useApi && value) fetchFromApi(value);
  };

  const fetchFromApi = async (value) => {
    try {
      const params = new URLSearchParams({
        text: value,
        size: qrSize,
        foreground: fgColor.replace("#", ""),
        background: bgColor.replace("#", ""),
        margin: 1,
        format: 'png',
      });
      if (apiKey) params.append('key', apiKey);
      const response = await fetch(`https://quickchart.io/qr?${params.toString()}`);
      if (response.ok) {
        const blob = await response.blob();
        setApiQrUrl(URL.createObjectURL(blob));
      } else {
        setError(lang === "fa" ? "خطا در API." : "API error.");
      }
    } catch (err) {
      setError(lang === "fa" ? "مشکل اتصال به API." : "API connection issue.");
    }
  };

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    generateQrValue();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setError("");
      const options = { maxSizeMB: 0.05, maxWidthOrHeight: 100, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        if (base64data.length > 3000) {
          setError(lang === "fa" ? "عکس خیلی بزرگ است." : "Image too large.");
          return;
        }
        setQrValue(base64data);
        if (useApi) fetchFromApi(base64data);
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      setError(lang === "fa" ? "خطا در پردازش تصویر." : "Image processing error.");
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const options = { maxSizeMB: 0.1, maxWidthOrHeight: 80 };
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      setError(lang === "fa" ? "خطا در آپلود لوگو." : "Logo upload error.");
    }
  };

  const downloadQR = () => {
    const qrElement = qrRef.current.querySelector(downloadFormat === 'svg' ? 'svg' : 'canvas');
    let url, filename;
    if (downloadFormat === 'svg') {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(qrElement);
      url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
      filename = 'qrcode.svg';
    } else {
      url = qrElement.toDataURL(`image/${downloadFormat}`, downloadQuality);
      filename = `qrcode.${downloadFormat}`;
    }
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    setShowDownloadModal(false);
  };

  const shareQr = async () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], "qrcode.png", { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: lang === "fa" ? "کد QR من" : "My QR Code",
              text: lang === "fa" ? "این کد QR رو چک کن!" : "Check this QR code!",
            });
          } catch (err) {
            console.error("Share failed:", err);
          }
        } else {
          navigator.clipboard.writeText(canvas.toDataURL());
          alert(lang === "fa" ? "لینک QR کپی شد!" : "QR link copied!");
        }
      });
    }
  };

  return (
    <section className={`py-12 rounded-3xl shadow-2xl transition-colors duration-300 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-8 ${darkMode ? "text-pink-300" : "text-pink-600"}`}>
          {lang === "fa" ? "تولیدکننده QR" : "QR Generator"}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* بخش ورودی‌ها */}
          <div className="space-y-6">
            {/* نوع QR */}
            <div className={`p-5 rounded-xl shadow-md transition ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"} border`}>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Settings size={18} className={darkMode ? "text-pink-300" : "text-pink-600"} />
                {lang === "fa" ? "نوع QR" : "QR Type"}
              </label>
              <select value={qrType} onChange={(e) => setQrType(e.target.value)} className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`}>
                <option value="text">{lang === "fa" ? "متن/لینک" : "Text/Link"}</option>
                <option value="wifi">WiFi</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>

            {/* فیلدهای شرطی */}
            {qrType === "text" && (
              <div className={`p-5 rounded-xl shadow-md ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"} border`}>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Link size={18} className={darkMode ? "text-pink-300" : "text-pink-600"} />
                  {lang === "fa" ? "متن یا لینک" : "Text or Link"}
                </label>
                <input type="text" placeholder={lang === "fa" ? "لینک یا متن وارد کن..." : "Enter text or link..."} value={inputText} onChange={handleTextChange} className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`} />
              </div>
            )}
            {qrType === "wifi" && (
              <div className={`p-5 rounded-xl shadow-md ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"} border`}>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Wifi size={18} className={darkMode ? "text-pink-300" : "text-pink-600"} />
                  WiFi
                </label>
                <input type="text" placeholder="SSID" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} className={`w-full p-3 mb-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`} />
                <input type="password" placeholder="Password" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} className={`w-full p-3 mb-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`} />
                <button onClick={generateQrValue} className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">{lang === "fa" ? "تولید" : "Generate"}</button>
              </div>
            )}
            {qrType === "email" && (
              <div className={`p-5 rounded-xl shadow-md ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"} border`}>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Mail size={18} className={darkMode ? "text-pink-300" : "text-pink-600"} />
                  Email
                </label>
                <input type="email" placeholder="To Email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className={`w-full p-3 mb-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`} />
                <input type="text" placeholder="Subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className={`w-full p-3 mb-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`} />
                <button onClick={generateQrValue} className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">{lang === "fa" ? "تولید" : "Generate"}</button>
              </div>
            )}
            {qrType === "phone" && (
              <div className={`p-5 rounded-xl shadow-md ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"} border`}>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Phone size={18} className={darkMode ? "text-pink-300" : "text-pink-600"} />
                  Phone
                </label>
                <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className={`w-full p-3 mb-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`} />
                <button onClick={generateQrValue} className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">{lang === "fa" ? "تولید" : "Generate"}</button>
              </div>
            )}

            {/* آپلودها */}
            <div className={`p-5 rounded-xl shadow-md ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"} border`}>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <FileImage size={18} className={darkMode ? "text-pink-300" : "text-pink-600"} />
                {lang === "fa" ? "آپلود تصویر (به جای متن)" : "Upload Image (instead of text)"}
              </label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full cursor-pointer text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700" />
            </div>
            <div className={`p-5 rounded-xl shadow-md ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"} border`}>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <ImageIcon size={18} className={darkMode ? "text-pink-300" : "text-pink-600"} />
                {lang === "fa" ? "آپلود لوگو (اختیاری)" : "Upload Logo (optional)"}
              </label>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full cursor-pointer text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-700" />
            </div>

            {/* رنگ‌ها */}
            <div className={`p-5 rounded-xl shadow-md ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"} border`}>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Palette size={18} className={darkMode ? "text-pink-300" : "text-pink-600"} />
                {lang === "fa" ? "رنگ‌ها" : "Colors"}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs">{lang === "fa" ? "رنگ اصلی" : "Foreground"}</label>
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600" />
                </div>
                <div>
                  <label className="text-xs">{lang === "fa" ? "پس‌زمینه" : "Background"}</label>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600" />
                </div>
              </div>
            </div>

            {/* تنظیمات پیشرفته */}
            <div className={`p-5 rounded-xl shadow-md ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"} border`}>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Settings size={18} className={darkMode ? "text-pink-300" : "text-pink-600"} />
                {lang === "fa" ? "تنظیمات پیشرفته" : "Advanced Settings"}
              </label>
              <div className="space-y-4">
                <div>
                  <label className="text-xs">{lang === "fa" ? "سطح تصحیح خطا" : "Error Correction Level"}</label>
                  <select value={qrLevel} onChange={(e) => setQrLevel(e.target.value)} className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`}>
                    <option value="L">Low</option>
                    <option value="M">Medium</option>
                    <option value="Q">Quartile</option>
                    <option value="H">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs">{lang === "fa" ? "اندازه QR (پیکسل)" : "QR Size (px)"}</label>
                  <input type="range" min="200" max="600" value={qrSize} onChange={(e) => setQrSize(e.target.value)} className="w-full accent-indigo-600" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{qrSize} px</span>
                </div>
              </div>
            </div>

            {/* گزینه API */}
            <div className={`p-5 rounded-xl shadow-md ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"} border`}>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={useApi} onChange={(e) => setUseApi(e.target.checked)} className="accent-indigo-600" />
                {lang === "fa" ? "استفاده از API خارجی (QuickChart)" : "Use External API (QuickChart)"}
              </label>
              {useApi && (
                <input type="text" placeholder={lang === "fa" ? "API Key (اختیاری)" : "API Key (optional)"} value={apiKey} onChange={(e) => setApiKey(e.target.value)} className={`mt-2 w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`} />
              )}
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          </div>

          {/* پیش‌نمایش QR */}
          <div className="flex flex-col items-center justify-center">
            {qrValue ? (
              <div ref={qrRef} className={`p-6 rounded-2xl shadow-xl transition ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                {useApi ? (
                  <img src={apiQrUrl} alt="QR Code" className="rounded-lg" style={{ width: `${qrSize}px`, height: `${qrSize}px` }} />
                ) : (
                  <QRCodeCanvas
                    value={qrValue}
                    size={qrSize}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    level={qrLevel}
                    includeMargin={true}
                    imageSettings={logo ? { src: logo, height: 60, width: 60, excavate: true } : null}
                  />
                )}
                {/* SVG مخفی */}
                <div style={{ display: 'none' }}>
                  <QRCodeSVG value={qrValue} size={qrSize} bgColor={bgColor} fgColor={fgColor} level={qrLevel} imageSettings={logo ? { src: logo, height: 60, width: 60, excavate: true } : null} />
                </div>
              </div>
            ) : (
              <div className={`w-64 h-64 flex items-center justify-center rounded-2xl shadow-md ${darkMode ? "bg-gray-900 text-gray-400" : "bg-gray-50 text-gray-500"}`}>
                {lang === "fa" ? "QR آماده نیست..." : "No QR yet..."}
              </div>
            )}

            {qrValue && (
              <div className="mt-6 flex space-x-4">
                <button onClick={() => setShowDownloadModal(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 flex items-center gap-2 transition">
                  <Download size={20} />
                  {lang === "fa" ? "دانلود" : "Download"}
                </button>
                <button onClick={shareQr} className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 flex items-center gap-2 transition">
                  <Share2 size={20} />
                  {lang === "fa" ? "اشتراک‌گذاری" : "Share"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* مودال دانلود */}
        {showDownloadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
              <h3 className="text-xl font-bold mb-4">{lang === "fa" ? "تنظیمات دانلود" : "Download Settings"}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{lang === "fa" ? "فرمت" : "Format"}</label>
                  <select value={downloadFormat} onChange={(e) => setDownloadFormat(e.target.value)} className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? "bg-gray-800 border-gray-600" : "bg-gray-100 border-gray-300"}`}>
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
                    <option value="svg">SVG</option>
                  </select>
                </div>
                {downloadFormat !== "svg" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">{lang === "fa" ? "کیفیت (%" : "Quality (%"} {Math.round(downloadQuality * 100)}%)</label>
                    <input type="range" min="0.1" max="1" step="0.1" value={downloadQuality} onChange={(e) => setDownloadQuality(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
                  </div>
                )}
                <div className="flex space-x-3 mt-6">
                  <button onClick={downloadQR} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">{lang === "fa" ? "دانلود" : "Download"}</button>
                  <button onClick={() => setShowDownloadModal(false)} className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">{lang === "fa" ? "لغو" : "Cancel"}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default QRGenerator;