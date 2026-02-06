import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

export function CurrencyConverter() {
  const { selectedCurrency, setSelectedCurrency, currencies } = useCurrency();

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
            onClick={() => setSelectedCurrency(currency)}
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
