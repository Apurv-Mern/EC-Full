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

interface Feature {
  id: number;
  name: string;
  description: string;
  estimatedDevTime: number; // in hours
  regionalCosts: {
    US: number;
    UK: number;
    AU: number;
    IN: number;
  };
  tags: string[];
  category: string;
  complexity: "Low" | "Medium" | "High";
  isActive: boolean;
  createdAt: string;
}

const mockFeatures: Feature[] = [
  {
    id: 1,
    name: "User Authentication",
    description: "Complete login/signup system with email verification",
    estimatedDevTime: 40,
    regionalCosts: { US: 4000, UK: 3800, AU: 3600, IN: 1600 },
    tags: ["common", "security", "backend"],
    category: "Authentication",
    complexity: "Medium",
    isActive: true,
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "Payment Integration",
    description: "Stripe/PayPal payment processing with webhooks",
    estimatedDevTime: 60,
    regionalCosts: { US: 6000, UK: 5700, AU: 5400, IN: 2400 },
    tags: ["payments", "integration", "security"],
    category: "Payments",
    complexity: "High",
    isActive: true,
    createdAt: "2024-01-15"
  },
  {
    id: 3,
    name: "AI Chatbot",
    description: "Intelligent customer support chatbot with NLP",
    estimatedDevTime: 80,
    regionalCosts: { US: 8000, UK: 7600, AU: 7200, IN: 3200 },
    tags: ["AI", "customer-support", "advanced"],
    category: "AI/ML",
    complexity: "High",
    isActive: true,
    createdAt: "2024-01-15"
  },
  {
    id: 4,
    name: "Admin Dashboard",
    description: "Basic admin panel with CRUD operations",
    estimatedDevTime: 120,
    regionalCosts: { US: 12000, UK: 11400, AU: 10800, IN: 4800 },
    tags: ["admin", "dashboard", "common"],
    category: "Admin",
    complexity: "Medium",
    isActive: true,
    createdAt: "2024-01-15"
  }
];

const categories = ["Authentication", "Payments", "AI/ML", "Admin", "Integration", "UI/UX", "Analytics"];
const availableTags = ["common", "security", "backend", "frontend", "AI", "payments", "integration", "customer-support", "advanced", "admin", "dashboard", "analytics"];

export default function Features() {
  const [features, setFeatures] = useState<Feature[]>(mockFeatures);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    estimatedDevTime: 40,
    regionalCosts: { US: 4000, UK: 3800, AU: 3600, IN: 1600 },
    tags: "",
    category: "Authentication",
    complexity: "Medium" as Feature["complexity"],
    isActive: true
  });

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || feature.category === selectedCategory;
    const matchesTag = selectedTag === "all" || feature.tags.includes(selectedTag);
    return matchesSearch && matchesCategory && matchesTag;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(t => t);
    
    if (editingFeature) {
      setFeatures(prev => prev.map(feature =>
        feature.id === editingFeature.id
          ? { ...feature, ...formData, tags: tagsArray }
          : feature
      ));
      toast({ title: "Feature updated successfully" });
    } else {
      const newFeature: Feature = {
        id: Math.max(...features.map(f => f.id)) + 1,
        ...formData,
        tags: tagsArray,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setFeatures(prev => [...prev, newFeature]);
      toast({ title: "Feature created successfully" });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (feature: Feature) => {
    setFormData({
      name: feature.name,
      description: feature.description,
      estimatedDevTime: feature.estimatedDevTime,
      regionalCosts: feature.regionalCosts,
      tags: feature.tags.join(", "),
      category: feature.category,
      complexity: feature.complexity,
      isActive: feature.isActive
    });
    setEditingFeature(feature);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setFeatures(prev => prev.filter(feature => feature.id !== id));
    toast({ title: "Feature deleted successfully" });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      estimatedDevTime: 40,
      regionalCosts: { US: 4000, UK: 3800, AU: 3600, IN: 1600 },
      tags: "",
      category: "Authentication",
      complexity: "Medium",
      isActive: true
    });
    setEditingFeature(null);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Low": return "bg-admin-success";
      case "Medium": return "bg-admin-warning";
      case "High": return "bg-admin-danger";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Feature Library</h1>
          <p className="text-muted-foreground">Manage features with development time and regional costs</p>
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
                      <option key={cat} value={cat}>{cat}</option>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimatedDevTime">Estimated Dev Time (hours)</Label>
                  <Input
                    id="estimatedDevTime"
                    type="number"
                    min="1"
                    value={formData.estimatedDevTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedDevTime: parseInt(e.target.value) || 1 }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="complexity">Complexity</Label>
                  <select
                    id="complexity"
                    value={formData.complexity}
                    onChange={(e) => setFormData(prev => ({ ...prev, complexity: e.target.value as Feature["complexity"] }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <Label>Regional Costs (USD)</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {Object.entries(formData.regionalCosts).map(([region, cost]) => (
                    <div key={region}>
                      <Label>{region}</Label>
                      <Input
                        type="number"
                        min="0"
                        value={cost}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          regionalCosts: {
                            ...prev.regionalCosts,
                            [region]: parseInt(e.target.value) || 0
                          }
                        }))}
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="common, security, backend, ..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Available: {availableTags.join(", ")}
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
                <Button type="submit" className="flex-1">
                  {editingFeature ? "Update" : "Create"}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Tags</option>
              {availableTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
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
                  <Badge variant="outline">{feature.category}</Badge>
                  <Badge variant="secondary" className={getComplexityColor(feature.complexity)}>
                    {feature.complexity}
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
                    className="text-admin-danger hover:text-admin-danger"
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
                  <p className="text-sm font-medium text-muted-foreground">Dev Time</p>
                  <p className="text-lg font-semibold">{feature.estimatedDevTime}h</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cost Range</p>
                  <p className="text-lg font-semibold">
                    ${Math.min(...Object.values(feature.regionalCosts)).toLocaleString()} - 
                    ${Math.max(...Object.values(feature.regionalCosts)).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-lg">{feature.createdAt}</p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Regional Costs:</p>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  {Object.entries(feature.regionalCosts).map(([region, cost]) => (
                    <div key={region} className="text-center">
                      <span className="font-medium">{region}:</span> ${cost.toLocaleString()}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Tags:</p>
                <div className="flex flex-wrap gap-1">
                  {feature.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
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