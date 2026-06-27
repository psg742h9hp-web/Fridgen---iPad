import { useState, useEffect } from "react";
import { getApiKey } from "./utils/localStorageManager";
import Dashboard from "./components/Dashboard";
import ReceiptUpload from "./components/ReceiptUpload";
import ConfirmationScreen from "./components/ConfirmationScreen";
import CategoryDetail from "./components/CategoryDetail";
import ItemDetail from "./components/ItemDetail";
import History from "./components/History";
import Settings from "./components/Settings";
import "./styles/globals.css";

export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [apiKey, setApiKey] = useState(getApiKey());
  const [parsedItems, setParsedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!apiKey) {
      setScreen("settings");
    }
  }, []);

  function handleAddReceipt() {
    setScreen("receipt-upload");
  }

  function handleParsed(items) {
    setParsedItems(items);
    setScreen("confirmation");
  }

  function handleConfirm(items) {
    const { saveMultipleItems } = require("./utils/localStorageManager");
    saveMultipleItems(items);
    setScreen("dashboard");
  }

  function handleSelectCategory(category) {
    setSelectedCategory(category);
    setScreen("category-detail");
  }

  function handleSelectItem(item) {
    setSelectedItem(item);
    setScreen("item-detail");
  }

  function handleApiKeyUpdate(newKey) {
    setApiKey(newKey);
    setScreen("dashboard");
  }

  function handleViewHistory() {
    setScreen("history");
  }

  function navigateBack() {
    setScreen("dashboard");
  }

  return (
    <>
      {screen === "dashboard" && (
        <Dashboard
          onAddReceipt={handleAddReceipt}
          onSelectCategory={handleSelectCategory}
          onSettings={() => setScreen("settings")}
          onViewHistory={handleViewHistory}
        />
      )}

      {screen === "receipt-upload" && (
        <ReceiptUpload
          apiKey={apiKey}
          onParsed={handleParsed}
          onBack={navigateBack}
        />
      )}

      {screen === "confirmation" && (
        <ConfirmationScreen
          items={parsedItems}
          onConfirm={handleConfirm}
          onBack={navigateBack}
        />
      )}

      {screen === "category-detail" && (
        <CategoryDetail
          category={selectedCategory}
          onBack={navigateBack}
          onSelectItem={handleSelectItem}
        />
      )}

      {screen === "item-detail" && (
        <ItemDetail
          item={selectedItem}
          onBack={navigateBack}
          onRefresh={() => setScreen("category-detail")}
        />
      )}

      {screen === "history" && (
        <History onBack={navigateBack} />
      )}

      {screen === "settings" && (
        <Settings
          onBack={navigateBack}
          onApiKeyUpdate={handleApiKeyUpdate}
        />
      )}
    </>
  );
}
