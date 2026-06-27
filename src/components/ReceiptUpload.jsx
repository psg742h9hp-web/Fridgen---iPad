import { useState, useRef } from "react";
import { parseReceipt } from "../utils/parseReceipt";
import Layout from "./Layout";

export default function ReceiptUpload({ apiKey, onParsed, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  async function handleImageSelect(file) {
    if (!file) return;

    if (!apiKey) {
      setError("❌ API key not configured. Go to Settings ⚙️");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const reader = new FileReader();

      reader.onload = async e => {
        try {
          const result = e.target.result;
          if (!result || typeof result !== "string") {
            throw new Error("Failed to read file");
          }
          const base64 = result.includes(",") ? result.split(",")[1] : result;
          if (!base64) {
            throw new Error("Invalid image format");
          }
          const items = await parseReceipt(base64, apiKey);
          setLoading(false);
          onParsed(items);
        } catch (err) {
          setError(err.message || "Failed to parse receipt");
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError("Failed to read image file");
        setLoading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message || "Failed to process image");
      setLoading(false);
    }
  }

  return (
    <Layout title="📸 Add Receipt" onBack={onBack}>
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-full gap-4">
        {error && (
          <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <div className="text-lg font-semibold text-gray-700">
              Parsing receipt...
            </div>
            <div className="text-sm text-gray-600 mt-2">
              This may take 30-60 seconds
            </div>
          </div>
        )}

        {!loading && (
          <>
            {/* Camera Button */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg touch-btn text-lg"
            >
              📷 Take Photo
            </button>

            {/* File Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-4 rounded-lg touch-btn text-lg"
            >
              📁 Upload File
            </button>

            {/* Hidden Inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={e => handleImageSelect(e.target.files?.[0])}
              className="hidden"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={e => handleImageSelect(e.target.files?.[0])}
              className="hidden"
            />

            {/* Info */}
            <div className="mt-8 text-center text-gray-600 text-sm bg-gray-50 p-4 rounded-lg">
              <p className="mb-2">📝 Tips:</p>
              <ul className="text-left space-y-1">
                <li>• Place receipt on flat surface</li>
                <li>• Ensure good lighting</li>
                <li>• Include all item names & prices</li>
                <li>• Supports Czech receipts</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
