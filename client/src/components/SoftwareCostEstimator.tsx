import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, Calculator, Download, Mail, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

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

const SoftwareCostEstimator = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<EstimatorFormData>({
    industries: [],
    softwareType: null,
    techStack: { backend: "", frontend: "", mobile: "" },
    timeline: null,
    features: [],
    currency: "USD" as Currency,
  });
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", company: "" });
  const [showContactForm, setShowContactForm] = useState(false);

  // API hooks
  const { data: staticData, isLoading, error } = useStaticData();
  const createEstimationMutation = useCreateEstimation();
  const createEstimationWithContactMutation = useCreateEstimationWithContact();

  // Destructure API data
  const industries = staticData?.industries || [];
  const softwareTypes = staticData?.softwareTypes || [];
  const techStacks = staticData?.techStacks || { backend: [], frontend: [], mobile: [] };
  const timelines = staticData?.timelines || [];
  const features = staticData?.features || [];
  const currencies = staticData?.currencies || [];

  const calculateTotal = () => {
    if (!formData.softwareType || !formData.timeline) return 0;

    const basePrice = formData.softwareType.basePrice[formData.currency];
    const featuresPrice = formData.features.reduce((total, featureName) => {
      const feature = features.find((f) => f.name === featureName);
      return total + (feature?.price[formData.currency] || 0);
    }, 0);

    return (basePrice + featuresPrice) * formData.timeline.multiplier;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US").format(Math.round(price));
  };

  const getCurrencySymbol = () =>
    currencies.find((c) => c.code === formData.currency)?.symbol || "";

  const handleCreateEstimation = async (withContact = false) => {
    if (!formData.softwareType || !formData.timeline) {
      toast.error("Please complete all required fields");
      return;
    }

    const estimationData: CreateEstimationRequest = {
      industries: formData.industries,
      softwareType: formData.softwareType.name,
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
      } else {
        await createEstimationMutation.mutateAsync(estimationData);
      }
    } catch (error) {
      // Error is handled by the mutation hooks
      console.error("Failed to create estimation:", error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full flex justify-center mt-20 md:mt-24">
        <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl px-4 md:px-8 py-8 md:py-12 bg-background rounded-2xl shadow-xl border border-border">
          <div className="text-center space-y-6">
            <Skeleton className="h-10 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full flex justify-center mt-20 md:mt-24">
        <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl px-4 md:px-8 py-8 md:py-12 bg-background rounded-2xl shadow-xl border border-border">
          <div className="text-center space-y-6">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-destructive">Failed to Load Data</h2>
              <p className="text-muted-foreground">
                We're having trouble loading the estimation data. Please check your connection and try again.
              </p>
            </div>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
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
              {industries.map((industry) => {
                const selected = formData.industries.includes(industry);
                return (
                  <Button
                    key={industry}
                    variant={selected ? "default" : "outline"}
                    className="h-12"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        industries: selected
                          ? formData.industries.filter((i) => i !== industry)
                          : [...formData.industries, industry],
                      });
                    }}
                  >
                    {industry}
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
                Select the type of software you need
              </p>
            </div>
            <div className="grid gap-4">
              {softwareTypes.map((type) => (
                <Button
                  key={type.name}
                  variant={
                    formData.softwareType?.name === type.name
                      ? "default"
                      : "outline"
                  }
                  className="h-16 justify-between"
                  onClick={() =>
                    setFormData({ ...formData, softwareType: type })
                  }
                >
                  <span>{type.name}</span>
                  <span className="font-bold">
                    From {getCurrencySymbol()}
                    {formatPrice(type.basePrice[formData.currency])}
                  </span>
                </Button>
              ))}
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
                  {techStacks.backend.map((tech) => (
                    <Button
                      key={tech}
                      variant={
                        formData.techStack.backend === tech
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          techStack: { ...formData.techStack, backend: tech },
                        })
                      }
                    >
                      {tech}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Frontend Technology</h3>
                <div className="flex flex-wrap gap-2">
                  {techStacks.frontend.map((tech) => (
                    <Button
                      key={tech}
                      variant={
                        formData.techStack.frontend === tech
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          techStack: { ...formData.techStack, frontend: tech },
                        })
                      }
                    >
                      {tech}
                    </Button>
                  ))}
                </div>
              </div>
              {formData.softwareType?.name === "Mobile App" && (
                <div>
                  <h3 className="font-semibold mb-3">Mobile Technology</h3>
                  <div className="flex flex-wrap gap-2">
                    {techStacks.mobile.map((tech) => (
                      <Button
                        key={tech}
                        variant={
                          formData.techStack.mobile === tech
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            techStack: { ...formData.techStack, mobile: tech },
                          })
                        }
                      >
                        {tech}
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

      case 5:
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
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.features.includes(feature.name)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => {
                    const newFeatures = formData.features.includes(feature.name)
                      ? formData.features.filter((f) => f !== feature.name)
                      : [...formData.features, feature.name];
                    setFormData({ ...formData, features: newFeatures });
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{feature.name}</span>
                    <span className="text-primary font-bold">
                      +{getCurrencySymbol()}
                      {formatPrice(feature.price[formData.currency])}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

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
                  className="h-28 flex flex-col items-center justify-center gap-2 py-4 px-2 text-center border-2"
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
            {formData.softwareType && formData.timeline && (
              <Card>
                <CardHeader>
                  <CardTitle>Estimated Cost</CardTitle>
                  <CardDescription>Based on your selections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Base Cost ({formData.softwareType.name})</span>
                    <span>
                      {getCurrencySymbol()}
                      {formatPrice(
                        formData.softwareType.basePrice[formData.currency]
                      )}
                    </span>
                  </div>
                  {formData.features.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Features:
                      </div>
                      {formData.features.map((featureName) => {
                        const feature = features.find(
                          (f) => f.name === featureName
                        );
                        return (
                          <div
                            key={featureName}
                            className="flex justify-between text-sm"
                          >
                            <span>{featureName}</span>
                            <span>
                              +{getCurrencySymbol()}
                              {formatPrice(
                                feature?.price[formData.currency] || 0
                              )}
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
                    <Button className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Quote
                    </Button>
                  </div>
                  <Button size="lg" className="w-full">
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
                  (step === 2 && !formData.softwareType) ||
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
      </div>
    </div>
  );
};

export default SoftwareCostEstimator;