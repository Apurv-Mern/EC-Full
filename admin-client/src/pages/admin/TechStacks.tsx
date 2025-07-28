import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search } from "lucide-react";

interface TechStack {
  id: number;
  name: string;
  description: string;
  type: "Backend" | "Frontend" | "Mobile" | "Database" | "DevOps";
  technologies: string[];
  costMultipliers: {
    US: number;
    UK: number;
    AU: number;
    IN: number;
  };
  isActive: boolean;
  createdAt: string;
}

const mockTechStacks: TechStack[] = [
  {
    id: 1,
    name: "React + Node.js",
    description: "Modern full-stack JavaScript development",
    type: "Frontend",
    technologies: ["React", "Node.js", "Express", "MongoDB"],
    costMultipliers: { US: 1.0, UK: 0.95, AU: 0.9, IN: 0.4 },
    isActive: true,
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "Python Django",
    description: "Robust backend framework with rapid development",
    type: "Backend",
    technologies: ["Python", "Django", "PostgreSQL", "Redis"],
    costMultipliers: { US: 1.1, UK: 1.0, AU: 0.95, IN: 0.45 },
    isActive: true,
    createdAt: "2024-01-15"
  },
  {
    id: 3,
    name: "React Native",
    description: "Cross-platform mobile development",
    type: "Mobile",
    technologies: ["React Native", "Expo", "TypeScript"],
    costMultipliers: { US: 1.2, UK: 1.1, AU: 1.0, IN: 0.5 },
    isActive: true,
    createdAt: "2024-01-15"
  }
];

export default function TechStacks() {
  const [techStacks, setTechStacks] = useState<TechStack[]>(mockTechStacks);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStack, setEditingStack] = useState<TechStack | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Frontend" as TechStack["type"],
    technologies: "",
    costMultipliers: { US: 1.0, UK: 0.95, AU: 0.9, IN: 0.4 },
    isActive: true
  });

  const filteredStacks = techStacks.filter(stack => {
    const matchesSearch = stack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stack.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || stack.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const technologiesArray = formData.technologies.split(",").map(t => t.trim()).filter(t => t);
    
    if (editingStack) {
      setTechStacks(prev => prev.map(stack =>
        stack.id === editingStack.id
          ? { ...stack, ...formData, technologies: technologiesArray }
          : stack
      ));
      toast({ title: "Tech stack updated successfully" });
    } else {
      const newStack: TechStack = {
        id: Math.max(...techStacks.map(s => s.id)) + 1,
        ...formData,
        technologies: technologiesArray,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTechStacks(prev => [...prev, newStack]);
      toast({ title: "Tech stack created successfully" });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (stack: TechStack) => {
    setFormData({
      name: stack.name,
      description: stack.description,
      type: stack.type,
      technologies: stack.technologies.join(", "),
      costMultipliers: stack.costMultipliers,
      isActive: stack.isActive
    });
    setEditingStack(stack);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setTechStacks(prev => prev.filter(stack => stack.id !== id));
    toast({ title: "Tech stack deleted successfully" });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "Frontend",
      technologies: "",
      costMultipliers: { US: 1.0, UK: 0.95, AU: 0.9, IN: 0.4 },
      isActive: true
    });
    setEditingStack(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Frontend": return "bg-blue-500";
      case "Backend": return "bg-green-500";
      case "Mobile": return "bg-purple-500";
      case "Database": return "bg-orange-500";
      case "DevOps": return "bg-red-500";
      default: return "bg-gray-500";
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
              <DialogTitle>{editingStack ? "Edit Tech Stack" : "Add New Tech Stack"}</DialogTitle>
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
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as TechStack["type"] }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps</option>
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
                <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
                  placeholder="React, Node.js, MongoDB, ..."
                />
              </div>

              <div>
                <Label>Cost Multipliers by Region</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {Object.entries(formData.costMultipliers).map(([region, multiplier]) => (
                    <div key={region}>
                      <Label>{region}</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={multiplier}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          costMultipliers: {
                            ...prev.costMultipliers,
                            [region]: parseFloat(e.target.value) || 0
                          }
                        }))}
                        placeholder="1.0"
                      />
                    </div>
                  ))}
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
                <Button type="submit" className="flex-1">
                  {editingStack ? "Update" : "Create"}
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
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Types</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Mobile">Mobile</option>
              <option value="Database">Database</option>
              <option value="DevOps">DevOps</option>
            </select>
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
                  <Badge variant="secondary" className={getTypeColor(stack.type)}>
                    {stack.type}
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
                    className="text-admin-danger hover:text-admin-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">{stack.description}</p>
              
              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Technologies:</p>
                <div className="flex flex-wrap gap-1">
                  {stack.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Cost Multipliers:</p>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  {Object.entries(stack.costMultipliers).map(([region, multiplier]) => (
                    <div key={region} className="text-center">
                      <span className="font-medium">{region}:</span> {multiplier}x
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-sm text-muted-foreground">Created: {stack.createdAt}</p>
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