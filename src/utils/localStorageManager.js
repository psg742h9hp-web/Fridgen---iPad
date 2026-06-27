import { EXPIRATION_RULES } from "./constants";
import { addDaysToDate, getTodayDate, isExpired } from "./dateUtils";

const STORAGE_KEYS = {
  ITEMS: "fridgen_items",
  HISTORY: "fridgen_history",
  API_KEY: "fridgen_api_key",
};

export function getApiKey() {
  return localStorage.getItem(STORAGE_KEYS.API_KEY) || "";
}

export function saveApiKey(apiKey) {
  localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
}

export function getItems() {
  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || "[]");
  // Mark expired items
  return items.map(item => {
    if (item.status === "active" && isExpired(item.expirationDate)) {
      return { ...item, status: "expired" };
    }
    return item;
  });
}

export function saveItem(item) {
  const items = getItems();
  const newItem = {
    ...item,
    timestamp: Date.now(),
  };
  items.push(newItem);
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
}

export function saveMultipleItems(itemsArray) {
  const items = getItems();
  const newItems = itemsArray.map(item => ({
    ...item,
    timestamp: Date.now(),
  }));
  const combined = [...items, ...newItems];
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(combined));
}

export function updateItem(itemId, updates) {
  const items = getItems();
  const idx = items.findIndex(i => i.id === itemId);
  if (idx === -1) return;
  items[idx] = { ...items[idx], ...updates };
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
}

export function deleteItem(itemId) {
  const items = getItems();
  const filtered = items.filter(i => i.id !== itemId);
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(filtered));
}

export function getItemsByCategory(category) {
  return getItems().filter(
    item => item.category === category && item.status === "active"
  );
}

export function moveToHistory(itemId, removedReason) {
  const items = getItems();
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  const historyItem = {
    ...item,
    status: removedReason,
    removedDate: getTodayDate(),
  };

  const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || "[]");
  history.push(historyItem);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

  deleteItem(itemId);
  purgeOldHistory();
}

export function getHistory() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || "[]");
}

export function purgeOldHistory() {
  const history = getHistory();
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const filtered = history.filter(item =>
    (item.timestamp && item.timestamp > thirtyDaysAgo) || !item.timestamp
  );
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered));
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEYS.ITEMS);
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
}

export function getTotalSpend() {
  const items = getItems();
  const history = getHistory();
  const allItems = [...items, ...history];
  return allItems.reduce((sum, item) => sum + (item.price || 0), 0);
}

export function calculateExpirationDate(purchaseDate, category) {
  const days = EXPIRATION_RULES[category] || 60;
  return addDaysToDate(purchaseDate, days);
}
