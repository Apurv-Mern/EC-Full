import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Monitor, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { softwareTypesService } from '@/services/softwareTypes';
import { SoftwareType } from '@/types/admin';

interface SoftwareTypeSelectProps {
  data: {
    softwareTypes: string[];
  };
  onDataChange: (data: { softwareTypes: string[] }) => void;
  onNext: () => void;
}

const SoftwareTypeSelect = ({ data, onDataChange, onNext }: SoftwareTypeSelectProps) => {
  const [softwareTypes, setSoftwareTypes] = useState<SoftwareType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(data.softwareTypes || []);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSoftwareTypes = async () => {
      try {
        setLoading(true);
        const response = await softwareTypesService.getAll();
        setSoftwareTypes(response.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load software types',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSoftwareTypes();
  }, [toast]);

  const handleTypeToggle = (typeId: string) => {
    const updatedTypes = selectedTypes.includes(typeId)
      ? selectedTypes.filter(id => id !== typeId)
      : [...selectedTypes, typeId];
    
    setSelectedTypes(updatedTypes);
    onDataChange({ softwareTypes: updatedTypes });
  };

  const handleNext = () => {
    if (selectedTypes.length === 0) {
      toast({
        title: 'Selection Required',
        description: 'Please select at least one software type',
        variant: 'destructive',
      });
      return;
    }
    onNext();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading software types...</span>
      </div>
    );
  }

  const osTypes = softwareTypes.filter(type => type.type === 'OS' && type.isActive);
  const softwareTypesFiltered = softwareTypes.filter(type => type.type === 'software' && type.isActive);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Choose Software Type</h2>
        <p className="text-muted-foreground">
          Select the type of software you need (you can select multiple)
        </p>
      </div>

      {/* OS Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Select OS
          </CardTitle>
        </CardHeader>
        <CardContent>
          {osTypes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {osTypes.map((type) => (
                <div
                  key={type.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedTypes.includes(type.id.toString())
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                  onClick={() => handleTypeToggle(type.id.toString())}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={selectedTypes.includes(type.id.toString())}
                      onChange={() => handleTypeToggle(type.id.toString())}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{type.name}</h3>
                      {type.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {type.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {type.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {type.complexity}
                        </Badge>
                        {type.basePrice && (
                          <Badge variant="outline" className="text-xs">
                            ${type.basePrice}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No OS options available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Software Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Select Software
          </CardTitle>
        </CardHeader>
        <CardContent>
          {softwareTypesFiltered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {softwareTypesFiltered.map((type) => (
                <div
                  key={type.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedTypes.includes(type.id.toString())
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                  onClick={() => handleTypeToggle(type.id.toString())}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={selectedTypes.includes(type.id.toString())}
                      onChange={() => handleTypeToggle(type.id.toString())}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{type.name}</h3>
                      {type.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {type.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {type.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {type.complexity}
                        </Badge>
                        {type.basePrice && (
                          <Badge variant="outline" className="text-xs">
                            ${type.basePrice}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No software options available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Selected Summary */}
      {selectedTypes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Software Types ({selectedTypes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedTypes.map((typeId) => {
                const type = softwareTypes.find(t => t.id.toString() === typeId);
                return type ? (
                  <Badge key={typeId} variant="default" className="gap-1">
                    {type.type === 'OS' ? <Monitor className="h-3 w-3" /> : <Code className="h-3 w-3" />}
                    {type.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end pt-4">
        <Button onClick={handleNext} disabled={selectedTypes.length === 0}>
          Continue to Tech Stack
        </Button>
      </div>
    </div>
  );
};

export default SoftwareTypeSelect;
