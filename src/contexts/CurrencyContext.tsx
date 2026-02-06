import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

const currencies = [
  { code: "ZAR", symbol: "R", name: "South African Rand", flag: "🇿🇦" },
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling", flag: "🇰🇪" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi", flag: "🇬🇭" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", flag: "🇧🇷" },
];

export type Currency = typeof currencies[0];

interface CurrencyContextType {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  convertPrice: (priceInZAR: number) => number;
  formatPrice: (priceInZAR: number) => string;
  currencies: Currency[];
  rates: Record<string, number>;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Fallback rates (approximate) in case API fails
const fallbackRates: Record<string, number> = {
  ZAR: 1,
  USD: 0.055,
  EUR: 0.050,
  GBP: 0.043,
  KES: 7.1,
  GHS: 0.83,
  AED: 0.20,
  JPY: 8.2,
  CNY: 0.40,
  BRL: 0.31,
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [rates, setRates] = useState<Record<string, number>>(fallbackRates);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Using a free exchange rate API
        const res = await fetch("https://api.exchangerate-api.com/v4/latest/ZAR");
        if (res.ok) {
          const data = await res.json();
          setRates(data.rates || fallbackRates);
        }
      } catch {
        console.warn("Failed to fetch exchange rates, using fallback rates");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRates();
  }, []);

  const convertPrice = useCallback(
    (priceInZAR: number) => {
      if (selectedCurrency.code === "ZAR") return priceInZAR;
      const rate = rates[selectedCurrency.code];
      if (!rate) return priceInZAR;
      return Math.round(priceInZAR * rate);
    },
    [selectedCurrency.code, rates]
  );

  const formatPrice = useCallback(
    (priceInZAR: number) => {
      const converted = convertPrice(priceInZAR);
      return `${selectedCurrency.symbol}${converted.toLocaleString()}`;
    },
    [convertPrice, selectedCurrency.symbol]
  );

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency,
        convertPrice,
        formatPrice,
        currencies,
        rates,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
