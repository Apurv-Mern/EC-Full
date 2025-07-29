import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useSoftwareTypes, useCreateSoftwareType, useUpdateSoftwareType, useDeleteSoftwareType } from "@/hooks/useApi";
import { SoftwareType, CreateSoftwareTypeRequest } from "@/types/admin";

const categories = ["web", "mobile", "desktop", "api", "other"] as const;
const complexityOptions = ["simple", "medium", "complex"] as const;

export default function SoftwareTypes() {
  // Move ALL hooks to the top, before any conditional logic
  const { data: softwareTypes, isLoading, error } = useSoftwareTypes();
  const createSoftwareType = useCreateSoftwareType();
  const updateSoftwareType = useUpdateSoftwareType();
  const deleteSoftwareType = useDeleteSoftwareType();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSoftwareType, setEditingSoftwareType] = useState<SoftwareType | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    category: 'web' | 'mobile' | 'desktop' | 'api' | 'other';
    basePrice?: number;
    complexity: 'simple' | 'medium' | 'complex';
    description?: string;
    isActive: boolean;
  }>({
    name: "",
    category: "web",
    basePrice: 5000,
    complexity: "medium",
    description: "",
    isActive: true
  });

  // Now handle loading and error states after all hooks
  if (isLoading) {
    return <div>Loading software types...</div>;
  }

  if (error) {
    return <div>Error loading software types: {error.message}</div>;
  }

  const filteredTypes = (softwareTypes || []).filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (type.description && type.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || type.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSoftwareType) {
      updateSoftwareType.mutate(
        { id: editingSoftwareType.id, data: formData },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Software type updated successfully",
            });
            resetForm();
            setIsDialogOpen(false);
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to update software type",
              variant: "destructive",
            });
          }
        }
      );
    } else {
      createSoftwareType.mutate(
        formData,
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Software type created successfully",
            });
            resetForm();
            setIsDialogOpen(false);
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to create software type",
              variant: "destructive",
            });
          }
        }
      );
    }
  };

  const handleEdit = (softwareType: SoftwareType) => {
    setFormData({
      name: softwareType.name,
      category: softwareType.category,
      basePrice: softwareType.basePrice || 0,
      complexity: softwareType.complexity,
      description: softwareType.description || "",
      isActive: softwareType.isActive
    });
    setEditingSoftwareType(softwareType);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this software type?')) {
      deleteSoftwareType.mutate(
        id,
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Software type deleted successfully",
            });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to delete software type",
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
      category: "web",
      basePrice: 5000,
      complexity: "medium",
      description: "",
      isActive: true
    });
    setEditingSoftwareType(null);
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
          <h1 className="text-3xl font-bold text-foreground">Software Types</h1>
          <p className="text-muted-foreground">Manage software categories and their complexity levels</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Software Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSoftwareType ? "Edit Software Type" : "Add New Software Type"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Type Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter software type name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'web' | 'mobile' | 'desktop' | 'api' | 'other' }))}
                    className="w-full p-2 border rounded-md"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
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
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="complexity">Complexity Level</Label>
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
                    placeholder="5000"
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
                  disabled={createSoftwareType.isPending || updateSoftwareType.isPending}
                >
                  {(createSoftwareType.isPending || updateSoftwareType.isPending) ? (
                    "Saving..."
                  ) : (
                    editingSoftwareType ? "Update" : "Create"
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
                placeholder="Search software types..."
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
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <div className="text-sm text-muted-foreground flex items-center">
              {filteredTypes.length} software types
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Software Types List */}
      <div className="grid gap-4">
        {filteredTypes.map((type) => (
          <Card key={type.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{type.name}</CardTitle>
                  <Badge variant="outline">
                    {type.category.charAt(0).toUpperCase() + type.category.slice(1)}
                  </Badge>
                  <Badge className={getComplexityColor(type.complexity)}>
                    {type.complexity.charAt(0).toUpperCase() + type.complexity.slice(1)}
                  </Badge>
                  <Badge variant={type.isActive ? "default" : "secondary"}>
                    {type.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(type)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(type.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">{type.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p className="text-lg font-semibold">{type.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Base Price</p>
                  <p className="text-lg font-semibold">${type.basePrice?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Complexity</p>
                  <p className="text-lg font-semibold">{type.complexity}</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">Created: {new Date(type.createdAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTypes.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No software types found matching your search.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}