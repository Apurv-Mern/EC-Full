import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Clock } from "lucide-react";

interface TimelineBand {
  id: number;
  name: string;
  description: string;
  minMonths: number;
  maxMonths: number;
  multiplier: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
}

const mockTimelineBands: TimelineBand[] = [
  { id: 1, name: "Express", description: "Rush delivery with dedicated team", minMonths: 1, maxMonths: 2, multiplier: 1.5, isDefault: false, isActive: true, createdAt: "2024-01-15" },
  { id: 2, name: "Standard", description: "Normal development timeline", minMonths: 3, maxMonths: 6, multiplier: 1.0, isDefault: true, isActive: true, createdAt: "2024-01-15" },
  { id: 3, name: "Extended", description: "Relaxed timeline with lower cost", minMonths: 7, maxMonths: 12, multiplier: 0.85, isDefault: false, isActive: true, createdAt: "2024-01-15" },
  { id: 4, name: "Long-term", description: "Very flexible timeline", minMonths: 13, maxMonths: 24, multiplier: 0.7, isDefault: false, isActive: true, createdAt: "2024-01-15" },
];

export default function Timeline() {
  const [timelineBands, setTimelineBands] = useState<TimelineBand[]>(mockTimelineBands);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBand, setEditingBand] = useState<TimelineBand | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minMonths: 1,
    maxMonths: 3,
    multiplier: 1.0,
    isDefault: false,
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBand) {
      setTimelineBands(prev => prev.map(band =>
        band.id === editingBand.id
          ? { ...band, ...formData }
          : { ...band, isDefault: formData.isDefault ? false : band.isDefault }
      ));
      toast({ title: "Timeline band updated successfully" });
    } else {
      const newBand: TimelineBand = {
        id: Math.max(...timelineBands.map(b => b.id)) + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      if (formData.isDefault) {
        setTimelineBands(prev => prev.map(band => ({ ...band, isDefault: false })));
      }
      
      setTimelineBands(prev => [...prev, newBand]);
      toast({ title: "Timeline band created successfully" });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (band: TimelineBand) => {
    setFormData({
      name: band.name,
      description: band.description,
      minMonths: band.minMonths,
      maxMonths: band.maxMonths,
      multiplier: band.multiplier,
      isDefault: band.isDefault,
      isActive: band.isActive
    });
    setEditingBand(band);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setTimelineBands(prev => prev.filter(band => band.id !== id));
    toast({ title: "Timeline band deleted successfully" });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      minMonths: 1,
      maxMonths: 3,
      multiplier: 1.0,
      isDefault: false,
      isActive: true
    });
    setEditingBand(null);
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier > 1.2) return "text-admin-danger";
    if (multiplier > 1.0) return "text-admin-warning";
    if (multiplier < 0.8) return "text-admin-success";
    return "text-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Delivery Timeline</h1>
          <p className="text-muted-foreground">Configure timeline bands and their cost multipliers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Timeline Band
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBand ? "Edit Timeline Band" : "Add New Timeline Band"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Band Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Express, Standard"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this timeline option"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minMonths">Min Months</Label>
                  <Input
                    id="minMonths"
                    type="number"
                    min="1"
                    value={formData.minMonths}
                    onChange={(e) => setFormData(prev => ({ ...prev, minMonths: parseInt(e.target.value) || 1 }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maxMonths">Max Months</Label>
                  <Input
                    id="maxMonths"
                    type="number"
                    min="1"
                    value={formData.maxMonths}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxMonths: parseInt(e.target.value) || 1 }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="multiplier">Cost Multiplier</Label>
                <Input
                  id="multiplier"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="3.0"
                  value={formData.multiplier}
                  onChange={(e) => setFormData(prev => ({ ...prev, multiplier: parseFloat(e.target.value) || 1.0 }))}
                  placeholder="1.0"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  1.0 = standard cost, 1.25 = +25%, 0.8 = -20%
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="isDefault">Default Timeline</Label>
                </div>
                
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
                  {editingBand ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timeline Bands List */}
      <div className="grid gap-4">
        {timelineBands
          .sort((a, b) => a.minMonths - b.minMonths)
          .map((band) => (
            <Card key={band.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-admin-primary" />
                    <CardTitle className="text-lg">{band.name}</CardTitle>
                    <Badge variant={band.isDefault ? "default" : "secondary"}>
                      {band.isDefault ? "Default" : "Optional"}
                    </Badge>
                    <Badge variant={band.isActive ? "outline" : "secondary"}>
                      {band.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(band)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(band.id)}
                      className="text-admin-danger hover:text-admin-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                    <p className="text-lg font-semibold">
                      {band.minMonths}-{band.maxMonths} months
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cost Multiplier</p>
                    <p className={`text-lg font-semibold ${getMultiplierColor(band.multiplier)}`}>
                      {band.multiplier}x
                      {band.multiplier > 1 && ` (+${Math.round((band.multiplier - 1) * 100)}%)`}
                      {band.multiplier < 1 && ` (${Math.round((band.multiplier - 1) * 100)}%)`}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-lg">{band.createdAt}</p>
                  </div>
                </div>
                
                {band.description && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{band.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>

      {timelineBands.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No timeline bands configured yet.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}