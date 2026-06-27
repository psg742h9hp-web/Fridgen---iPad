import { useState } from "react";
import { CATEGORIES } from "../utils/constants";
import { generateId } from "../utils/uuidGenerator";
import { calculateExpirationDate } from "../utils/localStorageManager";
import Layout from "./Layout";

export default function ConfirmationScreen({ items: initialItems, onConfirm, onBack }) {
  const [items, setItems] = useState(
    initialItems.map(item => ({
      ...item,
      id: generateId(),
      status: "active",
      purchaseDate: new Date().toISOString().split("T")[0],
      category: item.category || "Pantry",
    }))
  );

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  function getTotalPrice() {
    return items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  function handleEditStart(item) {
    setEditingId(item.id);
    setEditForm(item);
  }

  function handleEditChange(field, value) {
    setEditForm(prev => ({ ...prev, [field]: value }));
  }

  function handleEditSave() {
    setItems(prev =>
      prev.map(item => (item.id === editingId ? editForm : item))
    );
    setEditingId(null);
  }

  function handleDeleteItem(id) {
    setItems(prev => prev.filter(item => item.id !== id));
  }

  function handleAddManualItem() {
    const newItem = {
      id: generateId(),
      name: "New Item",
      qty: 1,
      unit: "pieces",
      category: "Pantry",
      price: 0,
      status: "active",
      purchaseDate: new Date().toISOString().split("T")[0],
    };
    setItems(prev => [...prev, newItem]);
  }

  function handleConfirm() {
    const itemsWithExpiration = items.map(item => ({
      ...item,
      expirationDate: calculateExpirationDate(
        item.purchaseDate,
        item.category
      ),
    }));
    onConfirm(itemsWithExpiration);
  }

  return (
    <Layout title="✅ Review & Confirm" onBack={onBack}>
      <div className="p-4 md:p-6 pb-24">
        {/* Items Table */}
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-white border border-gray-300 rounded-lg p-4"
            >
              {editingId === item.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => handleEditChange("name", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="Item name"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      value={editForm.qty}
                      onChange={e =>
                        handleEditChange("qty", parseFloat(e.target.value))
                      }
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Qty"
                    />
                    <select
                      value={editForm.unit}
                      onChange={e => handleEditChange("unit", e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option>pieces</option>
                      <option>kg</option>
                      <option>g</option>
                      <option>L</option>
                      <option>ml</option>
                    </select>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={e =>
                        handleEditChange("price", parseFloat(e.target.value))
                      }
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Price"
                    />
                  </div>
                  <select
                    value={editForm.category}
                    onChange={e => handleEditChange("category", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditSave}
                      className="flex-1 bg-green-600 text-white py-2 rounded font-semibold text-sm"
                    >
                      ✅ Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 bg-gray-400 text-white py-2 rounded font-semibold text-sm"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex justify-between items-start mb-2">
                    <div
                      onClick={() => handleEditStart(item)}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-bold text-base text-gray-800">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.qty} {item.unit} • {item.category}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-800">
                        {item.price.toFixed(2)} Kč
                      </div>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 font-semibold text-sm mt-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add Manual Item */}
        <button
          onClick={handleAddManualItem}
          className="w-full mt-4 border-2 border-dashed border-gray-400 text-gray-700 py-3 rounded-lg font-semibold touch-btn"
        >
          + Add Manual Item
        </button>

        {/* Total */}
        <div className="mt-6 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
          <div className="text-center">
            <div className="text-sm text-gray-600">Total Price</div>
            <div className="text-3xl font-bold text-blue-900">
              {getTotalPrice().toFixed(2)} Kč
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-lg touch-btn text-lg shadow-lg sticky bottom-4"
        >
          ✅ Confirm & Save
        </button>
      </div>
    </Layout>
  );
}
