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
import { Plus, Edit, Trash2, Calculator, Save, Eye } from "lucide-react";

interface FormulaRule {
  id: number;
  name: string;
  description: string;
  formula: string;
  conditions: string[];
  isActive: boolean;
  priority: number;
  createdAt: string;
}

interface PricingTemplate {
  id: number;
  name: string;
  industry: string;
  softwareType: string;
  baseMultiplier: number;
  rules: number[]; // Formula rule IDs
  isActive: boolean;
  createdAt: string;
}

const mockFormulaRules: FormulaRule[] = [
  {
    id: 1,
    name: "Base Cost Calculation",
    description: "Standard base cost calculation with regional multipliers",
    formula: "SUM(feature_costs) * region_multiplier * timeline_multiplier",
    conditions: ["region != null", "timeline != null"],
    isActive: true,
    priority: 1,
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "AI Feature Premium",
    description: "Additional cost for AI/ML features",
    formula: "base_cost * 1.3 WHERE features.tags CONTAINS 'AI'",
    conditions: ["has_ai_features = true"],
    isActive: true,
    priority: 2,
    createdAt: "2024-01-15"
  },
  {
    id: 3,
    name: "Enterprise Discount",
    description: "Volume discount for large projects",
    formula: "base_cost * 0.9 WHERE total_cost > 100000",
    conditions: ["total_cost > 100000"],
    isActive: true,
    priority: 3,
    createdAt: "2024-01-15"
  }
];

const mockPricingTemplates: PricingTemplate[] = [
  {
    id: 1,
    name: "E-commerce Standard",
    industry: "E-commerce & Retail",
    softwareType: "E-commerce Platform",
    baseMultiplier: 1.0,
    rules: [1, 2],
    isActive: true,
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "Healthcare Premium",
    industry: "Healthcare",
    softwareType: "Web Application",
    baseMultiplier: 1.2,
    rules: [1, 3],
    isActive: true,
    createdAt: "2024-01-15"
  }
];

export default function CostFormula() {
  const [formulaRules, setFormulaRules] = useState<FormulaRule[]>(mockFormulaRules);
  const [pricingTemplates, setPricingTemplates] = useState<PricingTemplate[]>(mockPricingTemplates);
  const [activeTab, setActiveTab] = useState("rules");
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<FormulaRule | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<PricingTemplate | null>(null);
  const { toast } = useToast();

  const [ruleFormData, setRuleFormData] = useState({
    name: "",
    description: "",
    formula: "",
    conditions: "",
    priority: 1,
    isActive: true
  });

  const [templateFormData, setTemplateFormData] = useState({
    name: "",
    industry: "",
    softwareType: "",
    baseMultiplier: 1.0,
    rules: "",
    isActive: true
  });

  // Sample calculation for preview
  const [previewData, setPreviewData] = useState({
    features: "User Auth, Payment, Dashboard",
    region: "US",
    timeline: "Standard",
    baseCost: 50000
  });

  const handleRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const conditionsArray = ruleFormData.conditions.split(",").map(c => c.trim()).filter(c => c);
    
    if (editingRule) {
      setFormulaRules(prev => prev.map(rule =>
        rule.id === editingRule.id
          ? { ...rule, ...ruleFormData, conditions: conditionsArray }
          : rule
      ));
      toast({ title: "Formula rule updated successfully" });
    } else {
      const newRule: FormulaRule = {
        id: Math.max(...formulaRules.map(r => r.id)) + 1,
        ...ruleFormData,
        conditions: conditionsArray,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setFormulaRules(prev => [...prev, newRule]);
      toast({ title: "Formula rule created successfully" });
    }

    resetRuleForm();
    setIsRuleDialogOpen(false);
  };

  const handleTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const rulesArray = templateFormData.rules.split(",").map(r => parseInt(r.trim())).filter(r => !isNaN(r));
    
    if (editingTemplate) {
      setPricingTemplates(prev => prev.map(template =>
        template.id === editingTemplate.id
          ? { ...template, ...templateFormData, rules: rulesArray }
          : template
      ));
      toast({ title: "Pricing template updated successfully" });
    } else {
      const newTemplate: PricingTemplate = {
        id: Math.max(...pricingTemplates.map(t => t.id)) + 1,
        ...templateFormData,
        rules: rulesArray,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPricingTemplates(prev => [...prev, newTemplate]);
      toast({ title: "Pricing template created successfully" });
    }

    resetTemplateForm();
    setIsTemplateDialogOpen(false);
  };

  const handleEditRule = (rule: FormulaRule) => {
    setRuleFormData({
      name: rule.name,
      description: rule.description,
      formula: rule.formula,
      conditions: rule.conditions.join(", "),
      priority: rule.priority,
      isActive: rule.isActive
    });
    setEditingRule(rule);
    setIsRuleDialogOpen(true);
  };

  const handleEditTemplate = (template: PricingTemplate) => {
    setTemplateFormData({
      name: template.name,
      industry: template.industry,
      softwareType: template.softwareType,
      baseMultiplier: template.baseMultiplier,
      rules: template.rules.join(", "),
      isActive: template.isActive
    });
    setEditingTemplate(template);
    setIsTemplateDialogOpen(true);
  };

  const handleDeleteRule = (id: number) => {
    setFormulaRules(prev => prev.filter(rule => rule.id !== id));
    toast({ title: "Formula rule deleted successfully" });
  };

  const handleDeleteTemplate = (id: number) => {
    setPricingTemplates(prev => prev.filter(template => template.id !== id));
    toast({ title: "Pricing template deleted successfully" });
  };

  const resetRuleForm = () => {
    setRuleFormData({
      name: "",
      description: "",
      formula: "",
      conditions: "",
      priority: 1,
      isActive: true
    });
    setEditingRule(null);
  };

  const resetTemplateForm = () => {
    setTemplateFormData({
      name: "",
      industry: "",
      softwareType: "",
      baseMultiplier: 1.0,
      rules: "",
      isActive: true
    });
    setEditingTemplate(null);
  };

  const calculatePreview = () => {
    // Simple calculation preview
    const { baseCost } = previewData;
    const steps = [
      { step: "Base Cost", value: baseCost },
      { step: "Region Multiplier (US: 1.0x)", value: baseCost * 1.0 },
      { step: "Timeline Multiplier (Standard: 1.0x)", value: baseCost * 1.0 },
      { step: "Final Estimate", value: baseCost * 1.0 }
    ];
    return steps;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cost Formula Rules Engine</h1>
          <p className="text-muted-foreground">Configure pricing logic and create industry-specific templates</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rules">Formula Rules</TabsTrigger>
          <TabsTrigger value="templates">Pricing Templates</TabsTrigger>
          <TabsTrigger value="preview">Cost Calculator Preview</TabsTrigger>
        </TabsList>

        {/* Formula Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Formula Rules</h2>
            <Dialog open={isRuleDialogOpen} onOpenChange={(open) => {
              setIsRuleDialogOpen(open);
              if (!open) resetRuleForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingRule ? "Edit Formula Rule" : "Add New Formula Rule"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRuleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Rule Name</Label>
                      <Input
                        id="name"
                        value={ruleFormData.name}
                        onChange={(e) => setRuleFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter rule name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        value={ruleFormData.priority}
                        onChange={(e) => setRuleFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={ruleFormData.description}
                      onChange={(e) => setRuleFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this rule does"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="formula">Formula</Label>
                    <Textarea
                      id="formula"
                      value={ruleFormData.formula}
                      onChange={(e) => setRuleFormData(prev => ({ ...prev, formula: e.target.value }))}
                      placeholder="e.g., base_cost * region_multiplier * timeline_multiplier"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="conditions">Conditions (comma-separated)</Label>
                    <Input
                      id="conditions"
                      value={ruleFormData.conditions}
                      onChange={(e) => setRuleFormData(prev => ({ ...prev, conditions: e.target.value }))}
                      placeholder="region != null, timeline != null"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={ruleFormData.isActive}
                      onChange={(e) => setRuleFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingRule ? "Update" : "Create"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetRuleForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {formulaRules
              .sort((a, b) => a.priority - b.priority)
              .map((rule) => (
                <Card key={rule.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calculator className="h-5 w-5 text-admin-primary" />
                        <CardTitle className="text-lg">{rule.name}</CardTitle>
                        <Badge variant="outline">Priority: {rule.priority}</Badge>
                        <Badge variant={rule.isActive ? "default" : "secondary"}>
                          {rule.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRule(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRule(rule.id)}
                          className="text-admin-danger hover:text-admin-danger"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">{rule.description}</p>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Formula:</p>
                      <code className="bg-muted p-2 rounded text-sm block">{rule.formula}</code>
                    </div>

                    {rule.conditions.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">Conditions:</p>
                        <div className="flex flex-wrap gap-1">
                          {rule.conditions.map((condition, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground">Created: {rule.createdAt}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Pricing Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Pricing Templates</h2>
            <Dialog open={isTemplateDialogOpen} onOpenChange={(open) => {
              setIsTemplateDialogOpen(open);
              if (!open) resetTemplateForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingTemplate ? "Edit Pricing Template" : "Add New Pricing Template"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleTemplateSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="templateName">Template Name</Label>
                    <Input
                      id="templateName"
                      value={templateFormData.name}
                      onChange={(e) => setTemplateFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter template name"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        value={templateFormData.industry}
                        onChange={(e) => setTemplateFormData(prev => ({ ...prev, industry: e.target.value }))}
                        placeholder="E-commerce, Healthcare, etc."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="softwareType">Software Type</Label>
                      <Input
                        id="softwareType"
                        value={templateFormData.softwareType}
                        onChange={(e) => setTemplateFormData(prev => ({ ...prev, softwareType: e.target.value }))}
                        placeholder="Web App, Mobile App, etc."
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="baseMultiplier">Base Multiplier</Label>
                    <Input
                      id="baseMultiplier"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={templateFormData.baseMultiplier}
                      onChange={(e) => setTemplateFormData(prev => ({ ...prev, baseMultiplier: parseFloat(e.target.value) || 1.0 }))}
                      placeholder="1.0"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="templateRules">Rule IDs (comma-separated)</Label>
                    <Input
                      id="templateRules"
                      value={templateFormData.rules}
                      onChange={(e) => setTemplateFormData(prev => ({ ...prev, rules: e.target.value }))}
                      placeholder="1, 2, 3"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="templateIsActive"
                      checked={templateFormData.isActive}
                      onChange={(e) => setTemplateFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="templateIsActive">Active</Label>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingTemplate ? "Update" : "Create"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetTemplateForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {pricingTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline">{template.industry}</Badge>
                      <Badge variant="secondary">{template.softwareType}</Badge>
                      <Badge variant={template.isActive ? "default" : "secondary"}>
                        {template.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-admin-danger hover:text-admin-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Base Multiplier</p>
                      <p className="text-lg font-semibold">{template.baseMultiplier}x</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Applied Rules</p>
                      <p className="text-lg">{template.rules.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created</p>
                      <p className="text-lg">{template.createdAt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-admin-primary" />
                Cost Calculator Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Input Parameters</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>Features</Label>
                      <Input
                        value={previewData.features}
                        onChange={(e) => setPreviewData(prev => ({ ...prev, features: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Region</Label>
                      <select
                        value={previewData.region}
                        onChange={(e) => setPreviewData(prev => ({ ...prev, region: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="IN">India</option>
                      </select>
                    </div>
                    <div>
                      <Label>Timeline</Label>
                      <select
                        value={previewData.timeline}
                        onChange={(e) => setPreviewData(prev => ({ ...prev, timeline: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="Express">Express (1.5x)</option>
                        <option value="Standard">Standard (1.0x)</option>
                        <option value="Extended">Extended (0.85x)</option>
                      </select>
                    </div>
                    <div>
                      <Label>Base Cost ($)</Label>
                      <Input
                        type="number"
                        value={previewData.baseCost}
                        onChange={(e) => setPreviewData(prev => ({ ...prev, baseCost: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Calculation Steps</h3>
                  <div className="space-y-2">
                    {calculatePreview().map((step, index) => (
                      <div key={index} className="flex justify-between p-2 bg-muted rounded">
                        <span>{step.step}</span>
                        <span className="font-medium">${step.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}