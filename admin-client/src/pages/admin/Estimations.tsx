import React, { useState } from 'react';
import { Eye, Trash2, Search, Filter, Mail, Phone, Calendar, DollarSign } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  useEstimations, 
  useUpdateEstimationStatus, 
  useDeleteEstimation 
} from '@/hooks/useApi';
import { Estimation } from '@/types/admin';
import { toast } from 'sonner';

const statusOptions = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-500' },
  { value: 'sent', label: 'Sent', color: 'bg-blue-500' },
  { value: 'accepted', label: 'Accepted', color: 'bg-green-500' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500' },
];

const Estimations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEstimation, setSelectedEstimation] = useState<Estimation | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const { data: estimations = [], isLoading } = useEstimations();
  const updateStatusMutation = useUpdateEstimationStatus();
  const deleteMutation = useDeleteEstimation();

  const filteredEstimations = estimations.filter(estimation => {
    const matchesSearch = 
      estimation.contactInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimation.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimation.softwareType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || estimation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const handleViewDetails = (estimation: Estimation) => {
    setSelectedEstimation(estimation);
    setIsDetailDialogOpen(true);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption || { value: status, label: status, color: 'bg-gray-500' };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Estimations</h1>
          <p className="text-muted-foreground">
            Manage submitted project estimations and their status
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search estimations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading estimations...</div>
      ) : (
        <div className="space-y-4">
          {filteredEstimations.map((estimation) => {
            const statusBadge = getStatusBadge(estimation.status);
            return (
              <Card key={estimation.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">
                        {estimation.contactInfo.name}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{estimation.contactInfo.email}</span>
                        </div>
                        {estimation.contactInfo.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{estimation.contactInfo.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(estimation.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary" 
                        className={`${statusBadge.color} text-white`}
                      >
                        {statusBadge.label}
                      </Badge>
                      <Select
                        value={estimation.status}
                        onValueChange={(value) => handleStatusUpdate(estimation.id, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(estimation)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Estimation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this estimation from {estimation.contactInfo.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(estimation.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Software Type</p>
                      <p className="text-sm text-muted-foreground">{estimation.softwareType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Timeline</p>
                      <p className="text-sm text-muted-foreground">{estimation.timeline}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        Pricing
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(estimation.pricing.totalPrice, estimation.currency)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredEstimations.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No estimations found</p>
        </div>
      )}

      {/* Estimation Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Estimation Details</DialogTitle>
          </DialogHeader>
          {selectedEstimation && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="mt-1">{selectedEstimation.contactInfo.name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="mt-1">{selectedEstimation.contactInfo.email}</p>
                  </div>
                  {selectedEstimation.contactInfo.phone && (
                    <div>
                      <Label>Phone</Label>
                      <p className="mt-1">{selectedEstimation.contactInfo.phone}</p>
                    </div>
                  )}
                  {selectedEstimation.contactInfo.company && (
                    <div>
                      <Label>Company</Label>
                      <p className="mt-1">{selectedEstimation.contactInfo.company}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Project Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Project Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Software Type</Label>
                    <p className="mt-1">{selectedEstimation.softwareType}</p>
                  </div>
                  <div>
                    <Label>Timeline</Label>
                    <p className="mt-1">{selectedEstimation.timeline}</p>
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <p className="mt-1">{selectedEstimation.currency}</p>
                  </div>
                  <div>
                    <Label>Timeline Multiplier</Label>
                    <p className="mt-1">{selectedEstimation.timelineMultiplier}x</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Industries */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Industries</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEstimation.industries.map((industry, index) => (
                    <Badge key={index} variant="outline">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Tech Stack */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Technology Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEstimation.techStack.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedEstimation.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span>{feature.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatPrice(feature.price, selectedEstimation.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Pricing Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Pricing Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>{formatPrice(selectedEstimation.pricing.basePrice, selectedEstimation.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Features Total:</span>
                    <span>{formatPrice(selectedEstimation.pricing.featuresPrice, selectedEstimation.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timeline Adjustment:</span>
                    <span>{selectedEstimation.timelineMultiplier}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Industry Multiplier:</span>
                    <span>{selectedEstimation.pricing.industryMultiplier}x</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Price:</span>
                    <span>{formatPrice(selectedEstimation.pricing.totalPrice, selectedEstimation.currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Estimations;
