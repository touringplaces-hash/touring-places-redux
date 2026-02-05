import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DollarSign, ChevronDown } from "lucide-react";

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

interface CurrencyConverterProps {
  onCurrencyChange?: (currency: typeof currencies[0]) => void;
}

export function CurrencyConverter({ onCurrencyChange }: CurrencyConverterProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  const handleSelect = (currency: typeof currencies[0]) => {
    setSelectedCurrency(currency);
    onCurrencyChange?.(currency);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
          <span className="text-base">{selectedCurrency.flag}</span>
          <span className="hidden sm:inline font-medium">{selectedCurrency.code}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => handleSelect(currency)}
            className={`cursor-pointer ${
              selectedCurrency.code === currency.code ? "bg-primary/10 text-primary" : ""
            }`}
          >
            <span className="text-base mr-2">{currency.flag}</span>
            <span className="font-medium">{currency.code}</span>
            <span className="ml-2 text-muted-foreground text-sm">{currency.symbol}</span>
            <span className="ml-auto text-xs text-muted-foreground">{currency.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
