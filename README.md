# 🍎 Fridgen - iPad Inventory Manager

Simple iPad-optimized React app for household inventory management. Upload Czech grocery receipts, auto-parse with Claude Vision API, track expiration dates.

## Features

✨ **Receipt Upload** — Take photos or upload images of Czech grocery receipts
🤖 **Claude Vision API** — Auto-extracts items, names (translated to English), quantities, prices
📦 **Smart Inventory** — Organize items by category with real-time expiration tracking
🟢🟡🔴 **Expiration Status** — Visual indicators for freshness (>7d, 3-7d, <3d)
📋 **Consumption History** — Track what you've used, consumed, or discarded
💾 **Browser Storage** — All data stored locally, no server needed
🔑 **User API Key** — Use your own Anthropic API key (zero backend cost)

## Tech Stack

- **Frontend:** React 18, Vite
- **Styling:** Tailwind CSS v4
- **Storage:** Browser localStorage
- **API:** Anthropic Claude Vision (Haiku model)
- **Deploy:** Vercel

## Quick Start

### Prerequisites

- Node.js 18+
- Anthropic API key (get it at https://console.anthropic.com/account/keys)

### Setup

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` in your iPad Safari or desktop browser.

## First Time

1. Open Settings (⚙️)
2. Enter your Anthropic API key
3. Test connection
4. Go back to Dashboard
5. Tap "📸 Add Receipt"

## Usage

1. **Add Receipt** — Take photo or upload receipt image
2. **Review Items** — Claude auto-parses, you can edit before confirming
3. **Confirm & Save** — Items added to inventory with auto-calculated expiration dates
4. **View Inventory** — Tap category cards on dashboard
5. **Consume Items** — Swipe or tap "✅ Consume" to move items to history
6. **Check History** — View 30-day consumption timeline

## Deployment

### Vercel (Recommended)

```bash
npm run build
git push
# Auto-deploys to Vercel
```

### Manual Build

```bash
npm run build
# Outputs to ./dist
```

## Data Structure

All data stored in browser localStorage:

```javascript
{
  items: [
    {
      id: "uuid",
      name: "Milk",
      qty: 1,
      unit: "L",
      category: "Dairy",
      price: 45.50,
      purchaseDate: "2026-06-27",
      expirationDate: "2026-07-27",
      status: "active" | "consumed" | "expired" | "dismissed"
    }
  ],
  history: [...],
  apiKey: "sk-..."  // Persisted, masked display
}
```

## Expiration Rules

| Category | Days |
|----------|------|
| Fruits | 10 |
| Vegetables | 10 |
| Bread | 10 |
| Dairy | 30 |
| Meat | 5 |
| Pantry | 60 |
| Other | 60 |

## Categories

- 🍎 Fruits
- 🥬 Vegetables
- 🥛 Dairy
- 🥩 Meat
- 🍞 Bread
- 📦 Pantry
- 🛍️ Other

## iPad Optimization

- **Large Touch Targets** — 60px minimum (easy to tap)
- **iPad-First Design** — Landscape & portrait responsive
- **Emoji Icons** — Big, colorful category indicators
- **Safe Area Support** — Notch/home indicator aware
- **Safari Compatible** — Camera input works on iPad

## Environment Variables

Create `.env.local` (git-ignored):

```
VITE_ANTHROPIC_API_KEY=sk-your-key-here
```

Or configure in Settings screen.

## API Key Safety

- Never committed to git
- Stored only in browser localStorage
- Always masked (shows last 4 chars only)
- "Test API" button verifies key works
- User configures once, app persists

## History & Auto-Purge

- All consumed/removed items logged to history
- History shows last 30 days
- Items >30 days old auto-purge on app load
- Export history as JSON for backup

## Known Limitations

- Requires internet for Claude API calls (Vision)
- API costs apply per receipt (currently ~$0.01-0.05 per image)
- Max 1,024 tokens per receipt parse
- Czech receipts only (prompt-based)

## Troubleshooting

**"API key not set"** → Go to Settings ⚙️, enter key, tap Save

**"Failed to parse receipt"** → Check: receipt is clear, no glare, all text visible, API key valid

**"Item not appearing"** → Refresh dashboard, check category, verify localStorage isn't full

## Development

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run lint     # Linting
npm run preview  # Local preview of build
```

## License

MIT
