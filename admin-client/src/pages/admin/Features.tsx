import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Package } from "lucide-react";
import { useFeatures, useCreateFeature, useUpdateFeature, useDeleteFeature } from "@/hooks/useApi";
import { Feature, CreateFeatureRequest } from "@/types/admin";

const categories = ["authentication", "payment", "communication", "content", "analytics", "integration", "user-management"];
const complexityOptions = ["simple", "medium", "complex"] as const;

export default function Features() {
  // Move ALL hooks to the top, before any conditional logic
  const { data: features, isLoading, error } = useFeatures();
  const createFeature = useCreateFeature();
  const updateFeature = useUpdateFeature();
  const deleteFeature = useDeleteFeature();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    description?: string;
    estimatedHours: number;
    category: string;
    complexity: 'simple' | 'medium' | 'complex';
    basePrice?: number;
    isActive: boolean;
  }>({
    name: "",
    description: "",
    estimatedHours: 40,
    category: "authentication",
    complexity: "medium",
    basePrice: 4000,
    isActive: true
  });

  // Now handle loading and error states after all hooks
  if (isLoading) {
    return <div>Loading features...</div>;
  }

  if (error) {
    return <div>Error loading features: {error.message}</div>;
  }

  const filteredFeatures = (features || []).filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feature.description && feature.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || feature.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingFeature) {
      updateFeature.mutate(
        { id: editingFeature.id, data: formData },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Feature updated successfully",
            });
            resetForm();
            setIsDialogOpen(false);
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to update feature",
              variant: "destructive",
            });
          }
        }
      );
    } else {
      createFeature.mutate(
        formData,
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Feature created successfully",
            });
            resetForm();
            setIsDialogOpen(false);
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to create feature",
              variant: "destructive",
            });
          }
        }
      );
    }
  };

  const handleEdit = (feature: Feature) => {
    setFormData({
      name: feature.name,
      description: feature.description || "",
      estimatedHours: feature.estimatedHours,
      category: feature.category,
      complexity: feature.complexity,
      basePrice: feature.basePrice || 0,
      isActive: feature.isActive
    });
    setEditingFeature(feature);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      deleteFeature.mutate(
        id,
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Feature deleted successfully",
            });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to delete feature",
              variant: "destructive",
            });
          }
        }
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      estimatedHours: 40,
      category: "authentication",
      complexity: "medium",
      basePrice: 4000,
      isActive: true
    });
    setEditingFeature(null);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "complex": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Feature Library</h1>
          <p className="text-muted-foreground">Manage features with development time and costs</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFeature ? "Edit Feature" : "Add New Feature"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Feature Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter feature name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the feature"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="estimatedHours">Estimated Hours</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    min="1"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 1 }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="complexity">Complexity</Label>
                  <select
                    id="complexity"
                    value={formData.complexity}
                    onChange={(e) => setFormData(prev => ({ ...prev, complexity: e.target.value as 'simple' | 'medium' | 'complex' }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="simple">Simple</option>
                    <option value="medium">Medium</option>
                    <option value="complex">Complex</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="basePrice">Base Price (USD)</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, basePrice: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
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

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createFeature.isPending || updateFeature.isPending}
                >
                  {(createFeature.isPending || updateFeature.isPending) ? (
                    "Saving..."
                  ) : (
                    editingFeature ? "Update" : "Create"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
            <div className="text-sm text-muted-foreground flex items-center">
              <Package className="h-4 w-4 mr-2" />
              {filteredFeatures.length} features
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features List */}
      <div className="grid gap-4">
        {filteredFeatures.map((feature) => (
          <Card key={feature.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{feature.name}</CardTitle>
                  <Badge variant="outline">
                    {feature.category.charAt(0).toUpperCase() + feature.category.slice(1).replace('-', ' ')}
                  </Badge>
                  <Badge className={getComplexityColor(feature.complexity)}>
                    {feature.complexity.charAt(0).toUpperCase() + feature.complexity.slice(1)}
                  </Badge>
                  <Badge variant={feature.isActive ? "default" : "secondary"}>
                    {feature.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(feature)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(feature.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">{feature.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estimated Hours</p>
                  <p className="text-lg font-semibold">{feature.estimatedHours}h</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Base Price</p>
                  <p className="text-lg font-semibold">${feature.basePrice?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Complexity</p>
                  <p className="text-lg font-semibold">{feature.complexity}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFeatures.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No features found matching your criteria.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
