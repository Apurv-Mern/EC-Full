import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { 
  useCurrencies, 
  useCreateCurrency, 
  useUpdateCurrency, 
  useDeleteCurrency 
} from '@/hooks/useApi';
import { Currency, CreateCurrencyRequest } from '@/types/admin';
import { toast } from 'sonner';

const Currencies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [formData, setFormData] = useState<CreateCurrencyRequest>({
    code: '',
    name: '',
    symbol: '',
    exchangeRate: 1,
    isActive: true,
  });

  const { data: currencies = [], isLoading } = useCurrencies();
  const createMutation = useCreateCurrency();
  const updateMutation = useUpdateCurrency();
  const deleteMutation = useDeleteCurrency();

  const filteredCurrencies = currencies.filter(currency =>
    currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.symbol.includes(searchTerm)
  );

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      symbol: '',
      exchangeRate: 1,
      isActive: true,
    });
    setEditingCurrency(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code.trim() || !formData.name.trim() || !formData.symbol.trim()) {
      toast.error('Currency code, name, and symbol are required');
      return;
    }

    try {
      if (editingCurrency) {
        await updateMutation.mutateAsync({
          id: editingCurrency.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const handleEdit = (currency: Currency) => {
    setEditingCurrency(currency);
    setFormData({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      exchangeRate: currency.exchangeRate,
      isActive: currency.isActive,
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Currencies</h1>
          <p className="text-muted-foreground">
            Manage supported currencies and their exchange rates
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Currency
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCurrency ? 'Edit Currency' : 'Create New Currency'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">Currency Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="USD, EUR, GBP..."
                  maxLength={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Currency Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="US Dollar, Euro, British Pound..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="symbol">Symbol *</Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  placeholder="$, €, £..."
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="exchangeRate">Exchange Rate (to USD)</Label>
                <Input
                  id="exchangeRate"
                  type="number"
                  step="0.000001"
                  min="0.000001"
                  value={formData.exchangeRate}
                  onChange={(e) => setFormData({ ...formData, exchangeRate: parseFloat(e.target.value) || 1 })}
                  placeholder="1.0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingCurrency ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search currencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading currencies...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCurrencies.map((currency) => (
            <Card key={currency.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <span className="text-2xl">{currency.symbol}</span>
                  {currency.code}
                </CardTitle>
                <div className="flex items-center space-x-1">
                  <Badge variant={currency.isActive ? 'default' : 'secondary'}>
                    {currency.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(currency)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Currency</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{currency.name}" ({currency.code})? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(currency.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium mb-2">{currency.name}</p>
                <div className="flex justify-between text-sm">
                  <span>Exchange Rate:</span>
                  <span className="font-medium">{currency.exchangeRate} USD</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredCurrencies.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No currencies found</p>
        </div>
      )}
    </div>
  );
};

export default Currencies;
