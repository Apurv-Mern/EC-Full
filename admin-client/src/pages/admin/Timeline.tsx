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
import { useTimelines, useCreateTimeline, useUpdateTimeline, useDeleteTimeline } from "@/hooks/useApi";
import { Timeline, CreateTimelineRequest } from "@/types/admin";

export default function Timeline() {
  // Move ALL hooks to the top, before any conditional logic
  const { data: timelines, isLoading, error } = useTimelines();
  const createTimeline = useCreateTimeline();
  const updateTimeline = useUpdateTimeline();
  const deleteTimeline = useDeleteTimeline();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<Timeline | null>(null);

  const [formData, setFormData] = useState<{
    label: string;
    description?: string;
    durationInMonths: number;
    multiplier: number;
    isActive: boolean;
  }>({
    label: "",
    description: "",
    durationInMonths: 3,
    multiplier: 1.0,
    isActive: true
  });

  // Now handle loading and error states after all hooks
  if (isLoading) {
    return <div>Loading timelines...</div>;
  }

  if (error) {
    return <div>Error loading timelines: {error.message}</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTimeline) {
      updateTimeline.mutate(
        { id: editingTimeline.id, data: formData },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Timeline updated successfully",
            });
            resetForm();
            setIsDialogOpen(false);
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to update timeline",
              variant: "destructive",
            });
          }
        }
      );
    } else {
      createTimeline.mutate(
        formData,
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Timeline created successfully",
            });
            resetForm();
            setIsDialogOpen(false);
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to create timeline",
              variant: "destructive",
            });
          }
        }
      );
    }
  };

  const handleEdit = (timeline: Timeline) => {
    setFormData({
      label: timeline.label,
      description: timeline.description || "",
      durationInMonths: timeline.durationInMonths,
      multiplier: timeline.multiplier,
      isActive: timeline.isActive
    });
    setEditingTimeline(timeline);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this timeline?')) {
      deleteTimeline.mutate(
        id,
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Timeline deleted successfully",
            });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to delete timeline",
              variant: "destructive",
            });
          }
        }
      );
    }
  };

  const resetForm = () => {
    setFormData({
      label: "",
      description: "",
      durationInMonths: 3,
      multiplier: 1.0,
      isActive: true
    });
    setEditingTimeline(null);
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
              <DialogTitle>{editingTimeline ? "Edit Timeline" : "Add New Timeline"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="label">Timeline Label</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g., Express, Standard, Extended"
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

              <div>
                <Label htmlFor="durationInMonths">Duration (Months)</Label>
                <Input
                  id="durationInMonths"
                  type="number"
                  min="1"
                  value={formData.durationInMonths}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationInMonths: parseInt(e.target.value) || 1 }))}
                  required
                />
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
                  disabled={createTimeline.isPending || updateTimeline.isPending}
                >
                  {(createTimeline.isPending || updateTimeline.isPending) ? (
                    "Saving..."
                  ) : (
                    editingTimeline ? "Update" : "Create"
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

      {/* Timelines List */}
      <div className="grid gap-4">
        {(timelines || [])
          .sort((a, b) => a.durationInMonths - b.durationInMonths)
          .map((timeline) => (
            <Card key={timeline.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{timeline.label}</CardTitle>
                    <Badge variant={timeline.isActive ? "default" : "secondary"}>
                      {timeline.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(timeline)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(timeline.id)}
                      className="text-red-600 hover:text-red-700"
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
                      {timeline.durationInMonths} months
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cost Multiplier</p>
                    <p className={`text-lg font-semibold ${getMultiplierColor(timeline.multiplier)}`}>
                      {timeline.multiplier}x
                      {timeline.multiplier > 1 && ` (+${Math.round((timeline.multiplier - 1) * 100)}%)`}
                      {timeline.multiplier < 1 && ` (${Math.round((timeline.multiplier - 1) * 100)}%)`}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-lg">{new Date(timeline.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {timeline.description && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{timeline.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>

      {(!timelines || timelines.length === 0) && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No timelines configured yet.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}