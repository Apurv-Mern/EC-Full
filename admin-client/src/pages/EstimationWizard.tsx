import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import IndustrySelect from '@/components/estimation/IndustrySelect';
import SoftwareTypeSelect from '@/components/estimation/SoftwareTypeSelect';
import TechStackSelect from '@/components/estimation/TechStackSelect';
import TimelineSelect from '@/components/estimation/TimelineSelect';
import FeatureSelect from '@/components/estimation/FeatureSelect';
import CurrencySelect from '@/components/estimation/CurrencySelect';
import ContactForm from '@/components/estimation/ContactForm';
import EstimationSummary from '@/components/estimation/EstimationSummary';

const STEPS = [
  { id: 1, title: 'Industry', component: IndustrySelect },
  { id: 2, title: 'Software Type', component: SoftwareTypeSelect },
  { id: 3, title: 'Tech Stack', component: TechStackSelect },
  { id: 4, title: 'Timeline', component: TimelineSelect },
  { id: 5, title: 'Features', component: FeatureSelect },
  { id: 6, title: 'Currency', component: CurrencySelect },
  { id: 7, title: 'Contact', component: ContactForm },
  { id: 8, title: 'Summary', component: EstimationSummary }
];

interface EstimationData {
  industries: string[];
  softwareTypes: string[];
  techStack: any;
  timeline: string;
  features: number[];
  currency: string;
  contactName?: string;
  contactEmail?: string;
  contactCompany?: string;
}

const EstimationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [estimationData, setEstimationData] = useState<EstimationData>({
    industries: [],
    softwareTypes: [],
    techStack: {},
    timeline: '',
    features: [],
    currency: ''
  });

  const CurrentStepComponent = STEPS.find(step => step.id === currentStep)?.component;
  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepData = (stepData: Partial<EstimationData>) => {
    setEstimationData(prev => ({ ...prev, ...stepData }));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Project Estimation Calculator</h1>
          <p className="text-muted-foreground">Get an accurate estimate for your software project</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {STEPS.length}</span>
            <span className="text-sm text-muted-foreground">{STEPS[currentStep - 1]?.title}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1]?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {CurrentStepComponent && (
              <CurrentStepComponent
                data={estimationData}
                onDataChange={handleStepData}
                onNext={handleNext}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            {currentStep < STEPS.length && (
              <Button
                onClick={handleNext}
                className="gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimationWizard;
