import { useState } from "react";
import { updateItem, deleteItem, moveToHistory } from "../utils/localStorageManager";
import { formatDate, calculateDaysLeft, getExpirationStatus } from "../utils/dateUtils";
import { CATEGORIES } from "../utils/constants";
import Layout from "./Layout";
import ExpirationBadge from "./ExpirationBadge";

export default function ItemDetail({ item: initialItem, onBack, onRefresh }) {
  const [item, setItem] = useState(initialItem);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(item);

  function handleEditChange(field, value) {
    setEditForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSaveEdit() {
    updateItem(item.id, editForm);
    setItem(editForm);
    setIsEditing(false);
    onRefresh?.();
  }

  function handleConsume() {
    moveToHistory(item.id, "consumed");
    onBack();
  }

  function handleDelete() {
    moveToHistory(item.id, "dismissed");
    onBack();
  }

  const daysLeft = calculateDaysLeft(item.expirationDate);
  const status = getExpirationStatus(item.expirationDate);

  let statusText = "";
  let statusEmoji = "";

  switch (status) {
    case "safe":
      statusText = `${daysLeft} days until expiration`;
      statusEmoji = "🟢";
      break;
    case "warning":
      statusText = `${daysLeft} days until expiration - use soon!`;
      statusEmoji = "🟡";
      break;
    case "danger":
      statusText = `${daysLeft} days until expiration - very soon!`;
      statusEmoji = "🔴";
      break;
    case "expired":
      statusText = "Expired";
      statusEmoji = "⚠️";
      break;
  }

  return (
    <Layout title="📦 Item Details" onBack={onBack}>
      <div className="p-4 md:p-6 pb-8">
        {isEditing ? (
          // Edit Mode
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={e => handleEditChange("name", e.target.value)}
                className="w-full border-2 border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Qty
                </label>
                <input
                  type="number"
                  value={editForm.qty}
                  onChange={e =>
                    handleEditChange("qty", parseFloat(e.target.value))
                  }
                  className="w-full border-2 border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  value={editForm.unit}
                  onChange={e => handleEditChange("unit", e.target.value)}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2"
                >
                  <option>pieces</option>
                  <option>kg</option>
                  <option>g</option>
                  <option>L</option>
                  <option>ml</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (Kč)
                </label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={e =>
                    handleEditChange("price", parseFloat(e.target.value))
                  }
                  className="w-full border-2 border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={editForm.category}
                onChange={e => handleEditChange("category", e.target.value)}
                className="w-full border-2 border-gray-300 rounded px-3 py-2"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg touch-btn"
              >
                ✅ Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditForm(item);
                }}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-lg touch-btn"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        ) : (
          // View Mode
          <>
            {/* Item Info Card */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-6">
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {item.name}
              </div>

              <div className="bg-gray-50 rounded p-3 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="text-sm text-gray-600">Quantity</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {item.qty} {item.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Price</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {item.price.toFixed(2)} Kč
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Category</div>
                  <div className="font-bold text-gray-800">{item.category}</div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Purchase Date</div>
                  <div className="font-bold text-gray-800">
                    {formatDate(item.purchaseDate)}
                  </div>
                </div>
              </div>
            </div>

            {/* Expiration Status */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{statusEmoji}</span>
                <div>
                  <div className="text-sm text-gray-600">Expiration</div>
                  <div className="font-bold text-gray-800">
                    {formatDate(item.expirationDate)}
                  </div>
                </div>
              </div>
              <div className="text-center bg-gray-50 p-3 rounded">
                <div className="text-lg font-semibold text-gray-700">
                  {statusText}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg touch-btn text-lg"
              >
                ✏️ Edit Item
              </button>

              <button
                onClick={handleConsume}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-lg touch-btn text-lg"
              >
                ✅ Mark as Consumed
              </button>

              <button
                onClick={handleDelete}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg touch-btn text-lg"
              >
                ❌ Delete Item
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
