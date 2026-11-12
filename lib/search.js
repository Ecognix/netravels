export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const index = (name) => months.findIndex((m) => m.toLowerCase().startsWith(name.trim().slice(0, 3).toLowerCase()));

// "March – May / October – December" -> Set of month indexes
export function seasonMonths(season = "") {
  const set = new Set();
  season.split("/").forEach((part) => {
    const [from, to] = part.split(/[–-]/);
    if (!from || !to) return;
    const start = index(from);
    const end = index(to);
    if (start < 0 || end < 0) return;
    for (let m = start; ; m = (m + 1) % 12) {
      set.add(m);
      if (m === end) break;
    }
  });
  return set;
}

export const durations = [
  ["any", "Any length"],
  ["short", "Up to 5 days"],
  ["six", "6 days"],
  ["long", "7+ days"],
];

export const budgets = [
  ["any", "Any budget"],
  ["20000", "Under ₹20,000"],
  ["25000", "Under ₹25,000"],
  ["30000", "Under ₹30,000"],
  ["over", "₹30,000 and above"],
];

export function matchesDuration(trip, key) {
  if (!key || key === "any") return true;
  if (key === "short") return trip.days <= 5;
  if (key === "six") return trip.days === 6;
  return trip.days >= 7;
}

export function matchesBudget(price, key) {
  if (!key || key === "any" || typeof price !== "number") return true;
  if (key === "over") return price >= 30000;
  return price < Number(key);
}

export const rupee = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
