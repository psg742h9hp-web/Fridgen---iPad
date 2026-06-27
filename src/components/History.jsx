import { useState, useEffect } from "react";
import { getHistory } from "../utils/localStorageManager";
import { formatDate } from "../utils/dateUtils";
import Layout from "./Layout";

export default function History({ onBack }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const historyItems = getHistory();
    const sorted = historyItems.sort(
      (a, b) =>
        new Date(b.removedDate || b.timestamp) -
        new Date(a.removedDate || a.timestamp)
    );
    setHistory(sorted);
  }, []);

  function getStatusEmoji(status) {
    switch (status) {
      case "consumed":
        return "✅";
      case "dismissed":
        return "🗑️";
      case "expired":
        return "⚠️";
      default:
        return "📋";
    }
  }

  function getStatusLabel(status) {
    switch (status) {
      case "consumed":
        return "Consumed";
      case "dismissed":
        return "Dismissed";
      case "expired":
        return "Expired";
      default:
        return "Removed";
    }
  }

  return (
    <Layout title="📋 History" onBack={onBack}>
      <div className="p-4 md:p-6 pb-8">
        {history.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📭</div>
            <div>No history yet</div>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map(item => (
              <div
                key={item.id}
                className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-bold text-base text-gray-800">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.qty} {item.unit} • {item.category}
                    </div>
                  </div>
                  <div className="text-2xl">
                    {getStatusEmoji(item.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    {getStatusLabel(item.status)}
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span>{" "}
                    {formatDate(item.removedDate || new Date(item.timestamp).toISOString().split("T")[0])}
                  </div>
                </div>

                {item.price && (
                  <div className="text-sm text-gray-700 font-semibold mt-2">
                    {item.price.toFixed(2)} Kč
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
