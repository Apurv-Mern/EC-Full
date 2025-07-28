import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, DollarSign, RefreshCw, Globe } from "lucide-react";

interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isBaseCurrency: boolean;
  autoSync: boolean;
  lastUpdated: string;
  isActive: boolean;
}

const mockCurrencies: Currency[] = [
  { id: 1, code: "USD", name: "US Dollar", symbol: "$", exchangeRate: 1.0, isBaseCurrency: true, autoSync: false, lastUpdated: "2024-01-15 10:00", isActive: true },
  { id: 2, code: "INR", name: "Indian Rupee", symbol: "₹", exchangeRate: 83.25, isBaseCurrency: false, autoSync: true, lastUpdated: "2024-01-15 09:30", isActive: true },
  { id: 3, code: "AUD", name: "Australian Dollar", symbol: "A$", exchangeRate: 1.52, isBaseCurrency: false, autoSync: true, lastUpdated: "2024-01-15 09:30", isActive: true },
  { id: 4, code: "GBP", name: "British Pound", symbol: "£", exchangeRate: 0.79, isBaseCurrency: false, autoSync: true, lastUpdated: "2024-01-15 09:30", isActive: true },
  { id: 5, code: "EUR", name: "Euro", symbol: "€", exchangeRate: 0.92, isBaseCurrency: false, autoSync: false, lastUpdated: "2024-01-10 14:20", isActive: false },
];

export default function Currency() {
  const [currencies, setCurrencies] = useState<Currency[]>(mockCurrencies);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    symbol: "",
    exchangeRate: 1.0,
    isBaseCurrency: false,
    autoSync: true,
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCurrency) {
      setCurrencies(prev => prev.map(currency =>
        currency.id === editingCurrency.id
          ? { 
              ...currency, 
              ...formData,
              lastUpdated: new Date().toLocaleString(),
              isBaseCurrency: formData.isBaseCurrency ? true : (currency.isBaseCurrency && currency.id === editingCurrency.id ? false : currency.isBaseCurrency)
            }
          : { 
              ...currency, 
              isBaseCurrency: formData.isBaseCurrency ? false : currency.isBaseCurrency 
            }
      ));
      toast({ title: "Currency updated successfully" });
    } else {
      const newCurrency: Currency = {
        id: Math.max(...currencies.map(c => c.id)) + 1,
        ...formData,
        lastUpdated: new Date().toLocaleString()
      };
      
      if (formData.isBaseCurrency) {
        setCurrencies(prev => prev.map(currency => ({ ...currency, isBaseCurrency: false })));
      }
      
      setCurrencies(prev => [...prev, newCurrency]);
      toast({ title: "Currency created successfully" });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (currency: Currency) => {
    setFormData({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      exchangeRate: currency.exchangeRate,
      isBaseCurrency: currency.isBaseCurrency,
      autoSync: currency.autoSync,
      isActive: currency.isActive
    });
    setEditingCurrency(currency);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    const currency = currencies.find(c => c.id === id);
    if (currency?.isBaseCurrency) {
      toast({ title: "Cannot delete base currency", variant: "destructive" });
      return;
    }
    setCurrencies(prev => prev.filter(currency => currency.id !== id));
    toast({ title: "Currency deleted successfully" });
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      symbol: "",
      exchangeRate: 1.0,
      isBaseCurrency: false,
      autoSync: true,
      isActive: true
    });
    setEditingCurrency(null);
  };

  const handleSyncRates = async () => {
    setSyncing(true);
    // Simulate API call
    setTimeout(() => {
      setCurrencies(prev => prev.map(currency => ({
        ...currency,
        lastUpdated: currency.autoSync ? new Date().toLocaleString() : currency.lastUpdated,
        exchangeRate: currency.autoSync && !currency.isBaseCurrency 
          ? currency.exchangeRate + (Math.random() - 0.5) * 0.1 
          : currency.exchangeRate
      })));
      setSyncing(false);
      toast({ title: "Exchange rates synced successfully" });
    }, 2000);
  };

  const baseCurrency = currencies.find(c => c.isBaseCurrency);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Currency Management</h1>
          <p className="text-muted-foreground">Manage currencies and exchange rates for regional pricing</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleSyncRates}
            disabled={syncing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? "Syncing..." : "Sync Rates"}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Currency
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCurrency ? "Edit Currency" : "Add New Currency"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Currency Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="USD, EUR, INR"
                      maxLength={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input
                      id="symbol"
                      value={formData.symbol}
                      onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                      placeholder="$, €, ₹"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="name">Currency Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="US Dollar, Euro, Indian Rupee"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="exchangeRate">Exchange Rate to {baseCurrency?.code || "Base"}</Label>
                  <Input
                    id="exchangeRate"
                    type="number"
                    step="0.0001"
                    min="0"
                    value={formData.exchangeRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, exchangeRate: parseFloat(e.target.value) || 0 }))}
                    placeholder="1.0"
                    required
                    disabled={formData.isBaseCurrency}
                  />
                  {formData.isBaseCurrency && (
                    <p className="text-xs text-muted-foreground mt-1">Base currency rate is always 1.0</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isBaseCurrency"
                      checked={formData.isBaseCurrency}
                      onChange={(e) => {
                        const isBase = e.target.checked;
                        setFormData(prev => ({ 
                          ...prev, 
                          isBaseCurrency: isBase,
                          exchangeRate: isBase ? 1.0 : prev.exchangeRate,
                          autoSync: isBase ? false : prev.autoSync
                        }));
                      }}
                      className="rounded"
                    />
                    <Label htmlFor="isBaseCurrency">Base Currency</Label>
                  </div>
                  
                  {!formData.isBaseCurrency && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="autoSync"
                        checked={formData.autoSync}
                        onChange={(e) => setFormData(prev => ({ ...prev, autoSync: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="autoSync">Auto-sync rates</Label>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingCurrency ? "Update" : "Create"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Base Currency Info */}
      {baseCurrency && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-admin-primary" />
              Base Currency Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Base Currency</p>
                <p className="text-xl font-semibold">{baseCurrency.code} - {baseCurrency.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Symbol</p>
                <p className="text-xl font-semibold">{baseCurrency.symbol}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-lg">{baseCurrency.lastUpdated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Currencies List */}
      <div className="grid gap-4">
        {currencies
          .sort((a, b) => {
            if (a.isBaseCurrency) return -1;
            if (b.isBaseCurrency) return 1;
            return a.code.localeCompare(b.code);
          })
          .map((currency) => (
            <Card key={currency.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-admin-primary" />
                    <CardTitle className="text-lg">
                      {currency.code} - {currency.name}
                    </CardTitle>
                    {currency.isBaseCurrency && (
                      <Badge variant="default">Base Currency</Badge>
                    )}
                    {currency.autoSync && !currency.isBaseCurrency && (
                      <Badge variant="outline">Auto-sync</Badge>
                    )}
                    <Badge variant={currency.isActive ? "outline" : "secondary"}>
                      {currency.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(currency)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(currency.id)}
                      className="text-admin-danger hover:text-admin-danger"
                      disabled={currency.isBaseCurrency}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Symbol</p>
                    <p className="text-2xl font-semibold">{currency.symbol}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Exchange Rate</p>
                    <p className="text-lg font-semibold">
                      {currency.isBaseCurrency ? "1.0000" : currency.exchangeRate.toFixed(4)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="text-sm">{currency.lastUpdated}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sample Conversion</p>
                    <p className="text-lg">
                      {baseCurrency?.symbol}1,000 = {currency.symbol}{(1000 * currency.exchangeRate).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {currencies.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No currencies configured yet.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}