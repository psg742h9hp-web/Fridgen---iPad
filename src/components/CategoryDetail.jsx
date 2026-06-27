import { useState, useEffect } from "react";
import { getItemsByCategory, moveToHistory } from "../utils/localStorageManager";
import { formatDate, calculateDaysLeft } from "../utils/dateUtils";
import Layout from "./Layout";
import ExpirationBadge from "./ExpirationBadge";

export default function CategoryDetail({ category, onBack, onSelectItem }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    refreshItems();
  }, [category]);

  function refreshItems() {
    const categoryItems = getItemsByCategory(category);
    const sorted = categoryItems.sort((a, b) => {
      const daysA = calculateDaysLeft(a.expirationDate);
      const daysB = calculateDaysLeft(b.expirationDate);
      return daysA - daysB;
    });
    setItems(sorted);
  }

  function handleConsume(itemId) {
    moveToHistory(itemId, "consumed");
    refreshItems();
  }

  function handleDelete(itemId) {
    moveToHistory(itemId, "dismissed");
    refreshItems();
  }

  function getRowColor(expirationDate) {
    const daysLeft = calculateDaysLeft(expirationDate);
    if (daysLeft > 7) return "bg-green-50";
    if (daysLeft > 3) return "bg-yellow-50";
    if (daysLeft >= 0) return "bg-red-50";
    return "bg-gray-100";
  }

  return (
    <Layout title={`${category} Items`} onBack={onBack}>
      <div className="p-4 md:p-6 pb-8">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📭</div>
            <div>No items in {category}</div>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div
                key={item.id}
                className={`${getRowColor(item.expirationDate)} border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-md transition`}
                onClick={() => onSelectItem(item)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-bold text-base text-gray-800">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.qty} {item.unit}
                    </div>
                  </div>
                  <ExpirationBadge expirationDate={item.expirationDate} />
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  Exp: {formatDate(item.expirationDate)}
                </div>

                {item.price && (
                  <div className="text-sm font-semibold text-gray-700 mb-3">
                    {item.price.toFixed(2)} Kč
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-300">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleConsume(item.id);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold text-sm touch-btn"
                  >
                    ✅ Consume
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold text-sm touch-btn"
                  >
                    ❌ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
