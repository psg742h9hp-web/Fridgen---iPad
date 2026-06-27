import { useState, useEffect } from "react";
import { getApiKey, saveApiKey, clearAllData, getItems, getHistory } from "../utils/localStorageManager";
import { parseReceipt } from "../utils/parseReceipt";
import Layout from "./Layout";

export default function Settings({ onBack, onApiKeyUpdate }) {
  const [apiKey, setApiKey] = useState("");
  const [displayKey, setDisplayKey] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    const saved = getApiKey();
    setApiKey(saved);
    if (saved) {
      setDisplayKey(`sk-...${saved.slice(-4)}`);
    }
  }, []);

  function handleSaveKey() {
    if (apiKey.trim()) {
      saveApiKey(apiKey);
      setDisplayKey(`sk-...${apiKey.slice(-4)}`);
      setTestResult("✅ API key saved");
      onApiKeyUpdate?.(apiKey);
      setTimeout(() => setTestResult(""), 3000);
    }
  }

  async function handleTestApi() {
    if (!apiKey) {
      setTestResult("❌ No API key configured");
      return;
    }

    setTestLoading(true);
    try {
      console.log("Testing API with key:", apiKey.slice(0, 20) + "...");

      const payload = {
        model: "claude-3-5-haiku-20241022",
        max_tokens: 100,
        messages: [
          {
            role: "user",
            content: "Say 'OK' in one word only.",
          },
        ],
      };

      console.log("Request payload:", payload);

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "content-type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(payload),
        mode: "cors",
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);

      let data;
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log("Response text:", text);
        data = text;
      }

      if (!response.ok) {
        const errorMsg =
          data.error?.message ||
          data.message ||
          `HTTP ${response.status}: ${JSON.stringify(data)}`;
        throw new Error(errorMsg);
      }

      console.log("Success:", data);

      if (
        data.content &&
        Array.isArray(data.content) &&
        data.content.length > 0
      ) {
        setTestResult("✅ API key works!");
      } else {
        throw new Error("No response content from API");
      }
    } catch (err) {
      console.error("Test API error:", err);
      console.error("Error name:", err?.name);
      console.error("Error message:", err?.message);

      let msg = err?.message || String(err) || "Unknown error";
      if (msg.includes("Failed to fetch")) {
        msg = "CORS error - check API key validity. Try from desktop.";
      }
      setTestResult(`❌ ${msg}`);
    } finally {
      setTestLoading(false);
    }
  }

  function handleExportData() {
    const items = getItems();
    const history = getHistory();
    const data = { items, history, exportedAt: new Date().toISOString() };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fridgen-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClearData() {
    clearAllData();
    setShowConfirmClear(false);
    onBack();
  }

  return (
    <Layout title="⚙️ Settings" onBack={onBack}>
      <div className="p-4 md:p-6 pb-8 space-y-6">
        {/* API Key Section */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔑 API Key</h2>

          {displayKey && (
            <div className="bg-green-50 border border-green-300 rounded p-3 mb-4 text-sm text-green-700 font-semibold">
              ✅ Key configured: {displayKey}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Anthropic API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full border-2 border-gray-300 rounded px-3 py-2 font-mono text-sm"
            />
            <div className="text-xs text-gray-500 mt-2">
              Get your key at: <br />
              anthropic.com/api/keys
            </div>
          </div>

          <button
            onClick={handleSaveKey}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg touch-btn mb-3"
          >
            💾 Save Key
          </button>

          <button
            onClick={handleTestApi}
            disabled={testLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg touch-btn disabled:bg-gray-400"
          >
            {testLoading ? "🔄 Testing..." : "🧪 Test API"}
          </button>

          {testResult && (
            <div className={`mt-3 p-3 rounded text-sm font-semibold ${
              testResult.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {testResult}
            </div>
          )}
        </div>

        {/* Data Section */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Data</h2>

          <button
            onClick={handleExportData}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg touch-btn mb-3"
          >
            📥 Export Data (JSON)
          </button>

          <button
            onClick={() => setShowConfirmClear(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg touch-btn"
          >
            🗑️ Clear All Data
          </button>
        </div>

        {/* Confirm Clear Dialog */}
        {showConfirmClear && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                ⚠️ Clear All Data?
              </h3>
              <p className="text-gray-600 mb-6">
                This will permanently delete all items and history. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleClearData}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg"
                >
                  ❌ Delete All
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* About */}
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-center text-sm text-gray-600">
          <div className="font-semibold mb-2">🍎 Fridgen</div>
          <div>iPad Inventory Manager</div>
          <div className="mt-2 text-xs">v1.0.0</div>
        </div>
      </div>
    </Layout>
  );
}
