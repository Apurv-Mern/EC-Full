import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Check, Calculator, Zap, Crown } from "lucide-react";

const gameTypes = [
  { name: "Ludo", basePrice: { GBP: 2000, AUD: 3500, INR: 180000 } },
  { name: "Poker", basePrice: { GBP: 5000, AUD: 8500, INR: 450000 } },
  { name: "Mines", basePrice: { GBP: 3000, AUD: 5000, INR: 270000 } },
  { name: "Aviator", basePrice: { GBP: 4000, AUD: 6500, INR: 360000 } },
  { name: "Teen Patti", basePrice: { GBP: 4500, AUD: 7500, INR: 405000 } },
  { name: "Rummy", basePrice: { GBP: 4200, AUD: 7000, INR: 378000 } }
];

const features = [
  { name: "Multiplayer Support", price: { GBP: 1500, AUD: 2500, INR: 135000 } },
  { name: "Real Money Betting", price: { GBP: 2500, AUD: 4000, INR: 225000 } },
  { name: "Cryptocurrency Integration", price: { GBP: 3000, AUD: 5000, INR: 270000 } },
  { name: "Live Chat System", price: { GBP: 800, AUD: 1300, INR: 72000 } },
  { name: "Tournament System", price: { GBP: 2000, AUD: 3300, INR: 180000 } },
  { name: "Admin Dashboard", price: { GBP: 1200, AUD: 2000, INR: 108000 } },
  { name: "Mobile App (iOS/Android)", price: { GBP: 3500, AUD: 5800, INR: 315000 } },
  { name: "AI Opponent System", price: { GBP: 4000, AUD: 6500, INR: 360000 } }
];

const currencies = [
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" }
];

const PricingSection = () => {
  const [selectedGame, setSelectedGame] = useState(gameTypes[0]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [currency, setCurrency] = useState<"GBP" | "AUD" | "INR">("GBP");

  const calculateTotal = () => {
    const basePrice = selectedGame.basePrice[currency];
    const featuresPrice = selectedFeatures.reduce((total, featureName) => {
      const feature = features.find(f => f.name === featureName);
      return total + (feature?.price[currency] || 0);
    }, 0);
    return basePrice + featuresPrice;
  };

  const toggleFeature = (featureName: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureName) 
        ? prev.filter(f => f !== featureName)
        : [...prev, featureName]
    );
  };

  const getCurrencySymbol = () => currencies.find(c => c.code === currency)?.symbol || "";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 gradient-text">
            Interactive Pricing Calculator
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Build your custom game with our transparent pricing. Select features and get instant quotes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Selection */}
          <Card className="card-gaming">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Select Game Type
              </CardTitle>
              <CardDescription>Choose your base game to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {gameTypes.map((game) => (
                <div
                  key={game.name}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border-2 ${
                    selectedGame.name === game.name
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedGame(game)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{game.name}</span>
                    <span className="text-primary font-bold">
                      {getCurrencySymbol()}{formatPrice(game.basePrice[currency])}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Features Selection */}
          <Card className="card-gaming">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary" />
                Add Features
              </CardTitle>
              <CardDescription>Enhance your game with premium features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={selectedFeatures.includes(feature.name)}
                      onCheckedChange={() => toggleFeature(feature.name)}
                    />
                    <span className="text-sm font-medium">{feature.name}</span>
                  </div>
                  <span className="text-sm text-primary font-bold">
                    +{getCurrencySymbol()}{formatPrice(feature.price[currency])}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Price Summary */}
          <Card className="card-gaming-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-secondary" />
                Your Quote
              </CardTitle>
              <CardDescription>
                Currency: 
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value as "GBP" | "AUD" | "INR")}
                  className="ml-2 bg-background border border-border rounded px-2 py-1"
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>{curr.name}</option>
                  ))}
                </select>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Base Game */}
              <div className="flex justify-between">
                <span>{selectedGame.name} (Base)</span>
                <span className="font-bold">
                  {getCurrencySymbol()}{formatPrice(selectedGame.basePrice[currency])}
                </span>
              </div>

              {/* Selected Features */}
              {selectedFeatures.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Selected Features:</p>
                    {selectedFeatures.map(featureName => {
                      const feature = features.find(f => f.name === featureName);
                      return (
                        <div key={featureName} className="flex justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <Check className="w-3 h-3 text-casino-green" />
                            {featureName}
                          </span>
                          <span>+{getCurrencySymbol()}{formatPrice(feature?.price[currency] || 0)}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              <Separator />
              
              {/* Total */}
              <div className="flex justify-between text-2xl font-bold">
                <span>Total:</span>
                <span className="gradient-text">
                  {getCurrencySymbol()}{formatPrice(calculateTotal())}
                </span>
              </div>

              <div className="space-y-3 pt-4">
                <Button variant="gaming" className="w-full" size="lg">
                  Get Detailed Quote
                </Button>
                <Button variant="gaming-outline" className="w-full">
                  Schedule Consultation
                </Button>
              </div>

              <div className="text-center">
                <Badge variant="secondary" className="bg-casino-green/20 text-casino-green border-casino-green">
                  30-day money-back guarantee
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;