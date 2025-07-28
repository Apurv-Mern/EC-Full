import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, Calculator, Download, Mail, Loader2, AlertCircle, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// API Integration
import { useStaticData, useCreateEstimation, useCreateEstimationWithContact } from "@/hooks/useApi";
import {
  Currency,
  EstimatorFormData,
  SoftwareType,
  Timeline,
  Feature,
  CreateEstimationRequest
} from "@/types/api";
import { EstimationStepSkeleton } from "./ui/estimation-skeletons";

const SoftwareCostEstimator = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<EstimatorFormData>({
    industries: [],
    softwareType: [],
    techStack: { backend: "", frontend: "", mobile: "" },
    timeline: null,
    features: [],
    currency: "USD" as Currency,
  });
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", company: "" });
  const [showContactForm, setShowContactForm] = useState(false);

  // API hooks
  const { data, isLoading, isError, refetch } = useStaticData();

  console.log({ data });
  const createEstimationMutation = useCreateEstimation();
  const createEstimationWithContactMutation = useCreateEstimationWithContact();

  // Destructure API data
  const industries = data?.industries || [];
  const softwareTypes = data?.softwareTypes || [];
  const techStacks = data?.techStacks || { backend: [], frontend: [], mobile: [] };
  const timelines = data?.timelines || [];
  const features = data?.features || {};
  const currencies = data?.currencies || [];

  // Helper function to flatten features
  const getFlattenedFeatures = () => {
    if (!features || typeof features !== 'object') return [];
    return Object.values(features).flat();
  };

  // Helper function to find feature by ID
  const findFeatureById = (featureId: number) => {
    const flattenedFeatures = getFlattenedFeatures();
    return flattenedFeatures.find((f: any) => f.id === featureId);
  };

  // Helper function to get currency exchange rate
  const getCurrencyRate = () => {
    const selectedCurrency = currencies.find(c => c.code === formData.currency);
    return selectedCurrency?.exchangeRate || 1;
  };

  const calculateTotal = () => {
    if (!formData.softwareType.length || !formData.timeline) return 0;

    // Calculate total base price for all selected software types
    const basePrice = formData.softwareType.reduce((total, softwareType) => {
      return total + ((softwareType.basePrice || 0) * getCurrencyRate());
    }, 0);

    // Calculate features price
    const featuresPrice = formData.features.reduce((total, featureId) => {
      const feature = findFeatureById(featureId);
      return total + ((feature?.basePrice || 0) * getCurrencyRate());
    }, 0);

    return (basePrice + featuresPrice) * formData.timeline.multiplier;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US").format(Math.round(price));
  };

  const getCurrencySymbol = () =>
    currencies.find((c) => c.code === formData.currency)?.symbol || "";

  const handleCreateEstimation = async (withContact = false) => {
    if (!formData.softwareType.length || !formData.timeline) {
      toast.error("Please complete all required fields");
      return;
    }

    const estimationData: CreateEstimationRequest = {
      industries: formData.industries,
      softwareType: formData.softwareType.map(st => st.name),
      techStack: formData.techStack,
      timeline: formData.timeline.label,
      timelineMultiplier: formData.timeline.multiplier,
      features: formData.features,
      currency: formData.currency,
      ...(withContact && {
        contactName: contactInfo.name,
        contactEmail: contactInfo.email,
        contactCompany: contactInfo.company,
      }),
    };

    try {
      if (withContact) {
        await createEstimationWithContactMutation.mutateAsync(estimationData);
        toast.success("Estimation created and sent to your email!");
      } else {
        await createEstimationMutation.mutateAsync(estimationData);
      }
    } catch (error) {
      console.error("Failed to create estimation:", error);
    }
  };

  const handleSubmitWithContact = async () => {
    if (!contactInfo.name || !contactInfo.email) {
      toast.error("Please fill in all required contact fields");
      return;
    }

    if (!formData.softwareType.length || !formData.timeline) {
      toast.error("Please complete all estimation steps first");
      return;
    }

    try {
      await handleCreateEstimation(true);
      setShowContactForm(false);
      // Reset contact form
      setContactInfo({ name: "", email: "", company: "" });
    } catch (error) {
      console.error("Failed to submit with contact:", error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full flex justify-center mt-20 md:mt-24">
        <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl px-4 md:px-8 py-8 md:py-12 bg-background rounded-2xl shadow-xl border border-border">
          <EstimationStepSkeleton step={step} />
        </div>
      </div>
    )
  };

  // Error state
  if (isError) {
    return (
      <div className="w-full flex justify-center mt-20 md:mt-24">
        <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl px-4 md:px-8 py-8 md:py-12 bg-background rounded-2xl shadow-xl border border-border">
          <Alert variant="destructive">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
            <div className="space-y-2">
              <AlertTitle>Failed to Load Data</AlertTitle>
              <AlertDescription>
                We're having trouble loading the estimation data. Please check your connection and try again.
              </AlertDescription>
            </div>
            <Button onClick={() => refetch()} className="mt-4">
              <RefreshCw className="w-5 h-5 mr-2 inline-block" />Try Again
            </Button>
          </Alert>
        </div>
      </div>
    );
  }

  const nextStep = () => setStep(Math.min(step + 1, 6));
  const prevStep = () => setStep(Math.max(step - 1, 0));

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Software Cost Estimator</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get an estimated cost for your software project tailored to your
                region and requirements
              </p>
            </div>
            <Button onClick={nextStep} size="lg" className="px-8">
              <Calculator className="w-5 h-5 mr-2" />
              Estimate Your Software Cost
            </Button>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Select Industry</h2>
              <p className="text-muted-foreground">
                Choose your business industry (you can select multiple)
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {industries.map(({ id, name }: any) => {
                const selected = formData.industries.includes(name);
                return (
                  <Button
                    key={id}
                    variant={selected ? "default" : "outline"}
                    className="h-12"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        industries: selected
                          ? formData.industries.filter((i) => i !== name)
                          : [...formData.industries, name],
                      });
                    }}
                  >
                    {name}
                  </Button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Choose Software Type</h2>
              <p className="text-muted-foreground">
                Select the type of software you need (you can select multiple)
              </p>
            </div>
            <div className="grid gap-4">
              {softwareTypes.map((type) => {
                const isSelected = formData.softwareType.some(st => st.id === type.id);
                return (
                  <Button
                    key={type.id}
                    variant={isSelected ? "default" : "outline"}
                    className="h-16 justify-between"
                    onClick={() => {
                      const newSoftwareTypes = isSelected
                        ? formData.softwareType.filter(st => st.id !== type.id)
                        : [...formData.softwareType, type];
                      setFormData({ ...formData, softwareType: newSoftwareTypes });
                    }}
                  >
                    <span>{type.name}</span>
                    <span className="font-bold">
                      From {getCurrencySymbol()}
                      {formatPrice((type.basePrice || 0) * getCurrencyRate())}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                Select Technology Stack
              </h2>
              <p className="text-muted-foreground">
                Choose your preferred technologies
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Backend Technology</h3>
                <div className="flex flex-wrap gap-2">
                  {techStacks.backend.map(({ id, name }: any) => {
                    return (
                      <Button
                        key={id}
                        variant={
                          formData.techStack.backend === name
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            techStack: { ...formData.techStack, backend: name },
                          })
                        }
                      >
                        {name}
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Frontend Technology</h3>
                <div className="flex flex-wrap gap-2">
                  {techStacks.frontend.map(({ id, name }: any) => (
                    <Button
                      key={id}
                      variant={
                        formData.techStack.frontend === name
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          techStack: { ...formData.techStack, frontend: name },
                        })
                      }
                    >
                      {name}
                    </Button>
                  ))}
                </div>
              </div>
              {formData.softwareType.some(st => st.name === "Mobile App") && (
                <div>
                  <h3 className="font-semibold mb-3">Mobile Technology</h3>
                  <div className="flex flex-wrap gap-2">
                    {techStacks.mobile.map(({ id, name }: any) => (
                      <Button
                        key={id}
                        variant={
                          formData.techStack.mobile === name
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            techStack: { ...formData.techStack, mobile: name },
                          })
                        }
                      >
                        {name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                Time Required for Delivery
              </h2>
              <p className="text-muted-foreground">
                Select your preferred timeline
              </p>
            </div>
            <div className="grid gap-4">
              {timelines.map((timeline) => (
                <Button
                  key={timeline.label}
                  variant={
                    formData.timeline?.label === timeline.label
                      ? "default"
                      : "outline"
                  }
                  className="h-16 justify-between"
                  onClick={() => setFormData({ ...formData, timeline })}
                >
                  <span>{timeline.label}</span>
                  <Badge variant="secondary">
                    {timeline.multiplier === 1.5 && "Express (+50%)"}
                    {timeline.multiplier === 1.0 && "Standard"}
                    {timeline.multiplier === 0.8 && "Save 20%"}
                    {timeline.multiplier === 0.7 && "Save 30%"}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        );

      case 5: {
        // Flatten the grouped features into a single array
        const flattenedFeatures = getFlattenedFeatures();

        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                Select Required Features
              </h2>
              <p className="text-muted-foreground">
                Choose additional features for your project
              </p>
            </div>
            <div className="grid gap-3">
              {flattenedFeatures.map((feature: any) => (
                <div
                  key={feature.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${formData.features.includes(feature.id)
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                    }`}
                  onClick={() => {
                    const newFeatures = formData.features.includes(feature.id)
                      ? formData.features.filter((f) => f !== feature.id)
                      : [...formData.features, feature.id];
                    setFormData({ ...formData, features: newFeatures });
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-medium">{feature.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {feature.description}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {feature.estimatedHours}h • {feature.complexity}
                      </span>
                    </div>
                    <span className="text-primary font-bold">
                      +{getCurrencySymbol()}
                      {formatPrice((feature.basePrice || 0) * getCurrencyRate())}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Select Region</h2>
              <p className="text-muted-foreground">Choose your currency</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {currencies.map((currency) => (
                <Button
                  key={currency.code}
                  variant={
                    formData.currency === currency.code ? "default" : "outline"
                  }
                  className={`h-28 flex flex-col items-center justify-center gap-2 py-4 px-2 text-center border-2 ${formData.currency === currency.code ? "shadow-neon" : ""
                    }`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      currency: currency.code as Currency,
                    })
                  }
                >
                  <span className="text-4xl mb-1 block leading-none">
                    {currency.flag}
                  </span>
                  <span className="font-bold text-lg tracking-wide">
                    {currency.code}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {currency.name}
                  </span>
                </Button>
              ))}
            </div>
            {formData.softwareType.length > 0 && formData.timeline && (
              <Card>
                <CardHeader>
                  <CardTitle>Estimated Cost</CardTitle>
                  <CardDescription>Based on your selections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Show selected industries */}
                  {formData.industries.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Industries:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {formData.industries.map((industry) => (
                          <Badge key={industry} variant="secondary">
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Show base cost for the selected software types */}
                  {formData.softwareType.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Software Types:
                      </div>
                      {formData.softwareType.map((softwareType) => (
                        <div key={softwareType.id} className="flex justify-between text-sm">
                          <span>{softwareType.name}</span>
                          <span>
                            {getCurrencySymbol()}
                            {formatPrice((softwareType.basePrice || 0) * getCurrencyRate())}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Show selected tech stack */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      Technology Stack:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {formData.techStack.backend && (
                        <div>
                          <span className="font-medium">Backend:</span> {formData.techStack.backend}
                        </div>
                      )}
                      {formData.techStack.frontend && (
                        <div>
                          <span className="font-medium">Frontend:</span> {formData.techStack.frontend}
                        </div>
                      )}
                      {formData.techStack.mobile && (
                        <div>
                          <span className="font-medium">Mobile:</span> {formData.techStack.mobile}
                        </div>
                      )}
                    </div>
                  </div>

                  {formData.features.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Features:
                      </div>
                      {formData.features.map((featureId) => {
                        const feature = findFeatureById(featureId);

                        return (
                          <div
                            key={featureId}
                            className="flex justify-between text-sm"
                          >
                            <span>{feature?.name || `Feature #${featureId}`}</span>
                            <span>
                              +{getCurrencySymbol()}
                              {formatPrice((feature?.basePrice || 0) * getCurrencyRate())}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Timeline Adjustment ({formData.timeline.label})</span>
                    <span>
                      {formData.timeline.multiplier === 1
                        ? "No change"
                        : `×${formData.timeline.multiplier}`}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-2xl font-bold">
                      <span>Total Estimate:</span>
                      <span>
                        {getCurrencySymbol()}
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      className="flex-1"
                      onClick={() => handleCreateEstimation(false)}
                      disabled={createEstimationMutation.isPending}
                    >
                      {createEstimationMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      Download PDF
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowContactForm(true)}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email Quote
                    </Button>
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setShowContactForm(true)}
                  >
                    Talk to Us - Start Project
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full flex justify-center mt-20 md:mt-24">
      <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl px-4 md:px-8 py-8 md:py-12 bg-background rounded-2xl shadow-xl border border-border">
        {step > 0 && (
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" onClick={prevStep} disabled={step === 0}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-sm text-muted-foreground">
              Step {step} of 6
            </div>
            {step < 6 && (
              <Button
                onClick={nextStep}
                disabled={
                  (step === 1 && !formData.industries.length) ||
                  (step === 2 && !formData.softwareType.length) ||
                  (step === 4 && !formData.timeline)
                }
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}

        {renderStep()}

        {/* Contact Form Dialog */}
        <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Contact Information</DialogTitle>
              <DialogDescription>
                Please provide your contact details to receive your detailed estimation and start your project.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Contact Name *</Label>
                <Input
                  id="contact-name"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-company">Company Name</Label>
                <Input
                  id="contact-company"
                  value={contactInfo.company}
                  onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })}
                  placeholder="Enter your company name (optional)"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowContactForm(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmitWithContact}
                disabled={!contactInfo.name || !contactInfo.email || createEstimationWithContactMutation.isPending}
              >
                {createEstimationWithContactMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Submit & Get Quote
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SoftwareCostEstimator;
