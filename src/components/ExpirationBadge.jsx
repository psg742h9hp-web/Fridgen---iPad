import { calculateDaysLeft, getExpirationStatus } from "../utils/dateUtils";

export default function ExpirationBadge({ expirationDate, size = "sm" }) {
  const daysLeft = calculateDaysLeft(expirationDate);
  const status = getExpirationStatus(expirationDate);

  let bgColor = "bg-gray-400";
  let label = "Expired";

  switch (status) {
    case "safe":
      bgColor = "bg-green-500";
      label = `${daysLeft}d`;
      break;
    case "warning":
      bgColor = "bg-yellow-400 text-gray-900";
      label = `${daysLeft}d`;
      break;
    case "danger":
      bgColor = "bg-red-500";
      label = `${daysLeft}d`;
      break;
    case "expired":
      bgColor = "bg-gray-400";
      label = "Exp";
      break;
  }

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`${bgColor} text-white font-bold rounded-full inline-block ${sizeClasses[size]}`}
    >
      {label}
    </span>
  );
}
