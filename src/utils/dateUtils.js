export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function calculateDaysLeft(expirationDate) {
  const expDate = new Date(expirationDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expDate.setHours(0, 0, 0, 0);

  const diff = expDate - today;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getExpirationStatus(expirationDate) {
  const daysLeft = calculateDaysLeft(expirationDate);

  if (daysLeft > 7) return "safe";
  if (daysLeft > 3) return "warning";
  if (daysLeft >= 0) return "danger";
  return "expired";
}

export function addDaysToDate(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export function isExpired(expirationDate) {
  return calculateDaysLeft(expirationDate) < 0;
}
