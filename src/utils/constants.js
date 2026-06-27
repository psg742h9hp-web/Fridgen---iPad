export const CATEGORIES = [
  { id: "fruits", name: "Fruits", emoji: "🍎" },
  { id: "vegetables", name: "Vegetables", emoji: "🥬" },
  { id: "dairy", name: "Dairy", emoji: "🥛" },
  { id: "meat", name: "Meat", emoji: "🥩" },
  { id: "bread", name: "Bread", emoji: "🍞" },
  { id: "pantry", name: "Pantry", emoji: "📦" },
  { id: "other", name: "Other", emoji: "🛍️" },
];

export const UNITS = [
  "pieces",
  "kg",
  "g",
  "L",
  "ml",
  "oz",
  "lb",
  "cup",
];

export const CLAUDE_VISION_PROMPT = `You are parsing a Czech grocery receipt. Extract ALL items listed.

For each item, return ONLY this JSON structure (no markdown, no explanation):
{
  "items": [
    {
      "name": "[item name in English, translated]",
      "qty": [number],
      "unit": "[unit in English: pieces, kg, g, L, ml, etc.]",
      "category": "[one of: Fruits, Vegetables, Dairy, Meat, Bread, Pantry, Other]",
      "price": [number in Czech crowns]
    }
  ]
}

Rules:
- Translate all Czech item names to English
- Convert Czech units: ks → pieces, kg → kg, L → L, g → g, ml → ml
- Map all Czech abbreviations correctly
- If unit not specified, use "pieces"
- If category unclear, use "Pantry"
- Return ONLY valid JSON, no markdown, no explanation`;

export const EXPIRATION_RULES = {
  "Fruits": 10,
  "Vegetables": 10,
  "Bread": 10,
  "Dairy": 30,
  "Meat": 5,
  "Pantry": 60,
  "Other": 60,
};

export const EXPIRATION_THRESHOLDS = {
  SAFE: 7,
  WARNING: 3,
};
