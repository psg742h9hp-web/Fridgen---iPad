export default function Layout({ children, title, onSettings, onBack }) {
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 flex-1">
          {onBack && (
            <button
              onClick={onBack}
              className="text-2xl touch-btn"
              aria-label="Back"
            >
              ←
            </button>
          )}
          <h1 className="text-2xl font-bold flex-1">{title}</h1>
        </div>
        {onSettings && (
          <button
            onClick={onSettings}
            className="text-2xl touch-btn"
            aria-label="Settings"
          >
            ⚙️
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
