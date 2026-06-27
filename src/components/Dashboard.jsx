import { useState, useEffect } from "react";
import { CATEGORIES } from "../utils/constants";
import { getItems, getTotalSpend } from "../utils/localStorageManager";
import { formatDate } from "../utils/dateUtils";
import Layout from "./Layout";
import ExpirationBadge from "./ExpirationBadge";

export default function Dashboard({
  onAddReceipt,
  onSelectCategory,
  onSettings,
  onViewHistory,
}) {
  const [items, setItems] = useState([]);
  const [totalSpend, setTotalSpend] = useState(0);

  useEffect(() => {
    refreshInventory();
  }, []);

  function refreshInventory() {
    setItems(getItems());
    setTotalSpend(getTotalSpend());
  }

  function getCategoryStats(categoryName) {
    const categoryItems = items.filter(
      item => item.category === categoryName && item.status === "active"
    );
    return categoryItems;
  }

  function getStatusBadge(categoryName) {
    const categoryItems = getCategoryStats(categoryName);
    if (categoryItems.length === 0) return null;

    const hasExpired = categoryItems.some(i => i.status === "expired");
    const hasDanger = categoryItems.some(
      i => i.expirationDate && new Date(i.expirationDate) - new Date() < 3 * 24 * 60 * 60 * 1000
    );
    const hasWarning = categoryItems.some(
      i =>
        i.expirationDate &&
        new Date(i.expirationDate) - new Date() < 7 * 24 * 60 * 60 * 1000 &&
        new Date(i.expirationDate) - new Date() >= 3 * 24 * 60 * 60 * 1000
    );

    if (hasExpired) return "🔴";
    if (hasDanger) return "🔴";
    if (hasWarning) return "🟡";
    return "🟢";
  }

  return (
    <Layout title="🍎 Fridgen" onSettings={onSettings}>
      <div className="p-4 pb-8 md:p-6">
        {/* Top Stats */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-gray-600">Total Spent</div>
            <div className="text-3xl font-bold text-blue-900">
              {totalSpend.toFixed(0)} Kč
            </div>
          </div>
        </div>

        {/* Primary Action */}
        <button
          onClick={onAddReceipt}
          className="w-full mb-6 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-lg touch-btn text-lg shadow-lg"
        >
          📸 Add Receipt
        </button>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {CATEGORIES.map(category => {
            const categoryItems = getCategoryStats(category.name);
            const statusEmoji = getStatusBadge(category.name);

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.name)}
                className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center hover:border-green-400 hover:shadow-md transition touch-btn min-h-fit"
              >
                <div className="text-emoji-xl mb-2">{category.emoji}</div>
                <div className="font-bold text-sm md:text-base text-gray-800">
                  {category.name}
                </div>
                <div className="text-xs md:text-sm text-gray-600 my-2">
                  {categoryItems.length} item{categoryItems.length !== 1 ? "s" : ""}
                </div>
                {statusEmoji && (
                  <div className="text-lg mt-2">{statusEmoji}</div>
                )}
              </button>
            );
          })}
        </div>

        {/* History Link */}
        <button
          onClick={onViewHistory}
          className="w-full mt-6 border-2 border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg touch-btn hover:bg-gray-50"
        >
          📋 View History
        </button>
      </div>
    </Layout>
  );
}
