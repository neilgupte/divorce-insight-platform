
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight,
  Save,
  Clock,
  Upload,
  FileText,
  Check,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

import LocationDetailsForm from "@/components/labour-planning/forms/LocationDetailsForm";
import OperationalDataForm from "@/components/labour-planning/forms/OperationalDataForm";
import TaskConfigurationForm from "@/components/labour-planning/forms/TaskConfigurationForm";
import WorkVolumeForm from "@/components/labour-planning/forms/WorkVolumeForm";
import OutputConfigurationForm from "@/components/labour-planning/forms/OutputConfigurationForm";

const steps = [
  { id: "location", label: "Location Details" },
  { id: "data", label: "Load Operational Data" },
  { id: "tasks", label: "Task Configuration" },
  { id: "forecast", label: "Work Volume Forecast" },
  { id: "output", label: "Output Configuration" }
];

const CreateLabourModel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { modelId } = useParams();
  const isEditing = !!modelId;
  
  const [currentStep, setCurrentStep] = useState("location");
  const [formData, setFormData] = useState({
    location: {
      storeName: isEditing ? "Downtown Pharmacy" : "",
      storeId: isEditing ? "DT001" : "",
      region: isEditing ? "New York" : "",
      storeType: isEditing ? "Existing" : "New",
      operationalHours: {},
      notes: ""
    },
    data: {
      fileUploaded: isEditing,
      dataPreview: isEditing ? [
        { date: "2025-04-01", prescriptions: 120, calls: 45, consultations: 15 },
        { date: "2025-04-02", prescriptions: 135, calls: 52, consultations: 18 }
      ] : [],
      isValid: isEditing
    },
    tasks: {
      tasks: isEditing ? [
        { name: "Prescription Filling", duration: 5, role: "Technician", roleSplit: 100, notes: "" },
        { name: "Patient Consultation", duration: 10, role: "Pharmacist", roleSplit: 100, notes: "" },
        { name: "Inventory Management", duration: 15, role: "Both", roleSplit: 30, notes: "30% pharmacist, 70% technician" }
      ] : [],
      allowPharmTechTasks: true
    },
    forecast: {
      volumeData: isEditing ? {
        prescriptions: [120, 135, 128, 142, 115, 90, 75],
        calls: [45, 52, 48, 55, 42, 38, 30],
        consultations: [15, 18, 16, 20, 14, 10, 8]
      } : {}
    },
    output: {
      timeRange: "weekly",
      outputType: "hoursWithFte",
      constraints: {
        minPharmacist: 1
      }
    }
  });

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = (currentStepIndex / (steps.length - 1)) * 100;

  const handleNext = () => {
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].id);
    } else {
      // Submit the form
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex].id);
    }
  };

  const updateFormData = (step: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step as keyof typeof prev],
        ...data
      }
    }));
  };

  const handleSubmit = () => {
    toast({
      title: isEditing ? "Model Updated" : "Model Created",
      description: `Labour model has been successfully ${isEditing ? "updated" : "created"}.`,
    });
    navigate("/labour-planning");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Labour Model" : "Create Labour Model"}
          </h1>
          <p className="text-muted-foreground">
            Complete all steps to create an optimized labour model
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/labour-planning")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card className="mb-6">
        <div className="p-4">
          <div className="mb-2 flex justify-between items-center">
            <div>
              <span className="text-sm font-medium">Step {currentStepIndex + 1} of {steps.length}: </span>
              <span className="text-sm text-muted-foreground">{steps[currentStepIndex].label}</span>
            </div>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="hidden sm:flex border-t">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              disabled={index > currentStepIndex && !isEditing}
              className={`flex-1 px-4 py-3 text-center text-sm font-medium relative ${
                currentStep === step.id 
                  ? "text-primary border-b-2 border-primary" 
                  : index < currentStepIndex || isEditing 
                    ? "text-muted-foreground hover:text-primary cursor-pointer" 
                    : "text-muted-foreground/50 cursor-not-allowed"
              }`}
            >
              {index < currentStepIndex && <Check className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-green-500" />}
              {step.label}
            </button>
          ))}
        </div>
      </Card>

      <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
        <TabsContent value="location" className="mt-0">
          <LocationDetailsForm 
            data={formData.location} 
            updateData={(data) => updateFormData("location", data)} 
          />
        </TabsContent>

        <TabsContent value="data" className="mt-0">
          <OperationalDataForm 
            data={formData.data} 
            updateData={(data) => updateFormData("data", data)} 
          />
        </TabsContent>

        <TabsContent value="tasks" className="mt-0">
          <TaskConfigurationForm 
            data={formData.tasks} 
            updateData={(data) => updateFormData("tasks", data)} 
          />
        </TabsContent>

        <TabsContent value="forecast" className="mt-0">
          <WorkVolumeForm 
            data={formData.forecast} 
            tasks={formData.tasks.tasks}
            updateData={(data) => updateFormData("forecast", data)} 
          />
        </TabsContent>

        <TabsContent value="output" className="mt-0">
          <OutputConfigurationForm 
            data={formData.output} 
            updateData={(data) => updateFormData("output", data)} 
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {currentStepIndex === steps.length - 1 ? (
          <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Update Model" : "Create Model"}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateLabourModel;
