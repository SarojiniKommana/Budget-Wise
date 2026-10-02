const CURRENCIES = {
  INR: { symbol: "₹", locale: "en-IN" },
  USD: { symbol: "$", locale: "en-US" },
  EUR: { symbol: "€", locale: "de-DE" },
  GBP: { symbol: "£", locale: "en-GB" },
};

export const CURRENCY_OPTIONS = Object.keys(CURRENCIES);

export function getCurrency() {
  return localStorage.getItem("currency") || "INR";
}

export function setCurrency(code) {
  if (CURRENCIES[code]) {
    localStorage.setItem("currency", code);
  }
}

// Formats a number using the user's chosen currency, e.g. "₹12,34,567" or "$1,234.56"
export function formatCurrency(amount) {
  const { symbol, locale } = CURRENCIES[getCurrency()] || CURRENCIES.INR;
  const value = Number(amount) || 0;
  return `${symbol}${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)}`;
}