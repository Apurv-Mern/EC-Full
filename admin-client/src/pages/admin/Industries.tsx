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

interface Industry {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

const mockIndustries: Industry[] = [
  { id: 1, name: "E-commerce & Retail", description: "Online stores, marketplaces, retail management", isActive: true, createdAt: "2024-01-15" },
  { id: 2, name: "Healthcare", description: "Medical platforms, patient management, telemedicine", isActive: true, createdAt: "2024-01-15" },
  { id: 3, name: "Fintech", description: "Banking, payments, investment platforms", isActive: true, createdAt: "2024-01-15" },
  { id: 4, name: "Education", description: "Learning management, online courses, school systems", isActive: true, createdAt: "2024-01-15" },
  { id: 5, name: "Real Estate", description: "Property management, listings, CRM", isActive: false, createdAt: "2024-01-15" },
];

export default function Industries() {
  const [industries, setIndustries] = useState<Industry[]>(mockIndustries);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true
  });

  const filteredIndustries = industries.filter(industry =>
    industry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    industry.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingIndustry) {
      setIndustries(prev => prev.map(industry =>
        industry.id === editingIndustry.id
          ? { ...industry, ...formData }
          : industry
      ));
      toast({ title: "Industry updated successfully" });
    } else {
      const newIndustry: Industry = {
        id: Math.max(...industries.map(i => i.id)) + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setIndustries(prev => [...prev, newIndustry]);
      toast({ title: "Industry created successfully" });
    }

    setFormData({ name: "", description: "", isActive: true });
    setEditingIndustry(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (industry: Industry) => {
    setFormData({
      name: industry.name,
      description: industry.description,
      isActive: industry.isActive
    });
    setEditingIndustry(industry);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setIndustries(prev => prev.filter(industry => industry.id !== id));
    toast({ title: "Industry deleted successfully" });
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", isActive: true });
    setEditingIndustry(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Industries</h1>
          <p className="text-muted-foreground">Manage industry categories for project estimation</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Industry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingIndustry ? "Edit Industry" : "Add New Industry"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Industry Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter industry name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter industry description"
                  rows={3}
                />
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
                  {editingIndustry ? "Update" : "Create"}
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
              placeholder="Search industries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Industries List */}
      <div className="grid gap-4">
        {filteredIndustries.map((industry) => (
          <Card key={industry.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{industry.name}</CardTitle>
                  <Badge variant={industry.isActive ? "default" : "secondary"}>
                    {industry.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(industry)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(industry.id)}
                    className="text-admin-danger hover:text-admin-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">{industry.description}</p>
              <p className="text-sm text-muted-foreground">Created: {industry.createdAt}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIndustries.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No industries found matching your search.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}