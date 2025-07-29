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
import { useTechStacks, useCreateTechStack, useUpdateTechStack, useDeleteTechStack } from "@/hooks/useApi";
import { TechStack, CreateTechStackRequest } from "@/types/admin";

const categories = ["backend", "frontend", "mobile", "database", "cloud", "other"] as const;
const difficultyLevels = ["beginner", "intermediate", "advanced"] as const;

export default function TechStacks() {
  // Move ALL hooks to the top, before any conditional logic
  const { data: techStacks, isLoading, error } = useTechStacks();
  const createTechStack = useCreateTechStack();
  const updateTechStack = useUpdateTechStack();
  const deleteTechStack = useDeleteTechStack();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTechStack, setEditingTechStack] = useState<TechStack | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    category: 'backend' | 'frontend' | 'mobile' | 'database' | 'cloud' | 'other';
    version?: string;
    description?: string;
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
    hourlyRateMultiplier?: number;
    isActive: boolean;
  }>({
    name: "",
    category: "frontend",
    version: "",
    description: "",
    difficultyLevel: "intermediate",
    hourlyRateMultiplier: 1.0,
    isActive: true
  });

  // Now handle loading and error states after all hooks
  if (isLoading) {
    return <div>Loading tech stacks...</div>;
  }

  if (error) {
    return <div>Error loading tech stacks: {error.message}</div>;
  }

  const filteredStacks = (techStacks || []).filter(stack => {
    const matchesSearch = stack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (stack.description && stack.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || stack.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTechStack) {
      updateTechStack.mutate(
        { id: editingTechStack.id, data: formData },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Tech stack updated successfully",
            });
            resetForm();
            setIsDialogOpen(false);
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to update tech stack",
              variant: "destructive",
            });
          }
        }
      );
    } else {
      createTechStack.mutate(
        formData,
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Tech stack created successfully",
            });
            resetForm();
            setIsDialogOpen(false);
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to create tech stack",
              variant: "destructive",
            });
          }
        }
      );
    }
  };

  const handleEdit = (techStack: TechStack) => {
    setFormData({
      name: techStack.name,
      category: techStack.category,
      version: techStack.version || "",
      description: techStack.description || "",
      difficultyLevel: techStack.difficultyLevel,
      hourlyRateMultiplier: techStack.hourlyRateMultiplier,
      isActive: techStack.isActive
    });
    setEditingTechStack(techStack);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this tech stack?')) {
      deleteTechStack.mutate(
        id,
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Tech stack deleted successfully",
            });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to delete tech stack",
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
      category: "frontend",
      version: "",
      description: "",
      difficultyLevel: "intermediate",
      hourlyRateMultiplier: 1.0,
      isActive: true
    });
    setEditingTechStack(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "frontend": return "bg-blue-100 text-blue-800";
      case "backend": return "bg-green-100 text-green-800";
      case "mobile": return "bg-purple-100 text-purple-800";
      case "database": return "bg-orange-100 text-orange-800";
      case "cloud": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Technology Stacks</h1>
          <p className="text-muted-foreground">Manage tech stacks and regional cost multipliers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Tech Stack
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTechStack ? "Edit Tech Stack" : "Add New Tech Stack"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Stack Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter stack name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'backend' | 'frontend' | 'mobile' | 'database' | 'cloud' | 'other' }))}
                    className="w-full p-2 border rounded-md"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="e.g., 18.x, 3.9"
                  />
                </div>
                <div>
                  <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                  <select
                    id="difficultyLevel"
                    value={formData.difficultyLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficultyLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced' }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
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
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="hourlyRateMultiplier">Hourly Rate Multiplier</Label>
                <Input
                  id="hourlyRateMultiplier"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="5.0"
                  value={formData.hourlyRateMultiplier}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourlyRateMultiplier: parseFloat(e.target.value) || 1.0 }))}
                  placeholder="1.0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  1.0 = standard rate, 1.5 = +50%, 0.8 = -20%
                </p>
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
                  disabled={createTechStack.isPending || updateTechStack.isPending}
                >
                  {(createTechStack.isPending || updateTechStack.isPending) ? (
                    "Saving..."
                  ) : (
                    editingTechStack ? "Update" : "Create"
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
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tech stacks..."
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
              {filteredStacks.length} tech stacks
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tech Stacks List */}
      <div className="grid gap-4">
        {filteredStacks.map((stack) => (
          <Card key={stack.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{stack.name}</CardTitle>
                  {stack.version && (
                    <Badge variant="outline">v{stack.version}</Badge>
                  )}
                  <Badge className={getCategoryColor(stack.category)}>
                    {stack.category.charAt(0).toUpperCase() + stack.category.slice(1)}
                  </Badge>
                  <Badge className={getDifficultyColor(stack.difficultyLevel)}>
                    {stack.difficultyLevel.charAt(0).toUpperCase() + stack.difficultyLevel.slice(1)}
                  </Badge>
                  <Badge variant={stack.isActive ? "default" : "secondary"}>
                    {stack.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(stack)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(stack.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">{stack.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p className="text-lg font-semibold">{stack.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
                  <p className="text-lg font-semibold">{stack.difficultyLevel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rate Multiplier</p>
                  <p className="text-lg font-semibold">{stack.hourlyRateMultiplier}x</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">Created: {new Date(stack.createdAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStacks.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tech stacks found matching your criteria.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}