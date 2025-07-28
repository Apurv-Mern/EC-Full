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

interface SoftwareType {
  id: number;
  name: string;
  description: string;
  complexity: "Low" | "Medium" | "High";
  isActive: boolean;
  createdAt: string;
}

const mockSoftwareTypes: SoftwareType[] = [
  { id: 1, name: "Web Application", description: "Modern web-based applications", complexity: "Medium", isActive: true, createdAt: "2024-01-15" },
  { id: 2, name: "Mobile Application", description: "iOS and Android mobile apps", complexity: "High", isActive: true, createdAt: "2024-01-15" },
  { id: 3, name: "E-commerce Platform", description: "Online shopping and marketplace solutions", complexity: "High", isActive: true, createdAt: "2024-01-15" },
  { id: 4, name: "CRM System", description: "Customer relationship management", complexity: "Medium", isActive: true, createdAt: "2024-01-15" },
  { id: 5, name: "Landing Page", description: "Simple marketing websites", complexity: "Low", isActive: true, createdAt: "2024-01-15" },
];

export default function SoftwareTypes() {
  const [softwareTypes, setSoftwareTypes] = useState<SoftwareType[]>(mockSoftwareTypes);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<SoftwareType | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    complexity: "Medium" as SoftwareType["complexity"],
    isActive: true
  });

  const filteredTypes = softwareTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingType) {
      setSoftwareTypes(prev => prev.map(type =>
        type.id === editingType.id
          ? { ...type, ...formData }
          : type
      ));
      toast({ title: "Software type updated successfully" });
    } else {
      const newType: SoftwareType = {
        id: Math.max(...softwareTypes.map(t => t.id)) + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setSoftwareTypes(prev => [...prev, newType]);
      toast({ title: "Software type created successfully" });
    }

    setFormData({ name: "", description: "", complexity: "Medium", isActive: true });
    setEditingType(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (type: SoftwareType) => {
    setFormData({
      name: type.name,
      description: type.description,
      complexity: type.complexity,
      isActive: type.isActive
    });
    setEditingType(type);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setSoftwareTypes(prev => prev.filter(type => type.id !== id));
    toast({ title: "Software type deleted successfully" });
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", complexity: "Medium", isActive: true });
    setEditingType(null);
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
              <DialogTitle>{editingType ? "Edit Software Type" : "Add New Software Type"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="complexity">Complexity Level</Label>
                <select
                  id="complexity"
                  value={formData.complexity}
                  onChange={(e) => setFormData(prev => ({ ...prev, complexity: e.target.value as SoftwareType["complexity"] }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
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
                  {editingType ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search software types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
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
                  <Badge variant="secondary" className={getComplexityColor(type.complexity)}>
                    {type.complexity}
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
                    className="text-admin-danger hover:text-admin-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">{type.description}</p>
              <p className="text-sm text-muted-foreground">Created: {type.createdAt}</p>
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