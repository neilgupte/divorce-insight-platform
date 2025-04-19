import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const clientSetupSchema = z.object({
  clientName: z.string().min(1, { message: "Client name is required" }),
  modules: z.array(z.string()).min(1, { message: "Select at least one module" }),
  seats: z.number().min(1, { message: "Seats must be at least 1" }),
  paymentTerm: z.enum(["monthly", "annual"]),
  paymentMethod: z.enum(["card", "invoice", "trial"]),
});

type ClientSetupFormData = z.infer<typeof clientSetupSchema>;

interface ClientSetupFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

export function ClientSetupForm({ onClose, onSubmit }: ClientSetupFormProps) {
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const availableModules = [
    { id: "labour-planning", label: "Labour Planning" },
    { id: "real-estate-iq", label: "Real Estate IQ" },
    { id: "module-3", label: "Divorce IQ" },
    { id: "module-4", label: "Module 4" },
    { id: "module-5", label: "Module 5" },
  ];

  const form = useForm<ClientSetupFormData>({
    resolver: zodResolver(clientSetupSchema),
    defaultValues: {
      clientName: "",
      modules: [],
      seats: 1,
      paymentTerm: "monthly",
      paymentMethod: "card",
    },
  });

  const handleSubmit = (data: ClientSetupFormData) => {
    console.log("Form data:", data);
    
    // Show success message
    toast({
      title: "Client setup complete",
      description: `Billing profile created for ${data.clientName}`,
    });
    
    // Show confirmation screen
    setShowConfirmation(true);
  };

  const handleContinue = () => {
    onSubmit();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        {!showConfirmation ? (
          <>
            <DialogHeader>
              <DialogTitle>Client Billing Setup</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter client name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="modules"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Modules</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {availableModules.map((module) => (
                          <FormField
                            key={module.id}
                            control={form.control}
                            name="modules"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={module.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(module.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, module.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== module.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {module.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="seats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seats</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentTerm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Terms</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment terms" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="annual">Annual</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="card">Credit Card</SelectItem>
                          <SelectItem value="invoice">Invoice</SelectItem>
                          <SelectItem value="trial">Trial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit</Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Setup Complete</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Client Setup Successful</h3>
              <p className="text-center text-muted-foreground mb-6">
                The client billing profile has been created and an onboarding email has been sent.
              </p>
              <Button onClick={handleContinue}>Continue</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
