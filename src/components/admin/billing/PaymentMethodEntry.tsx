
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
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
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { BillingProfile } from "./types";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, CheckCircle, AlertCircle } from "lucide-react";

const paymentSchema = z.object({
  cardNumber: z.string().min(16, { message: "Valid card number is required" }),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/, { message: "Expiry should be MM/YY format" }),
  cardCvc: z.string().min(3, { message: "Valid CVC is required" }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentMethodEntryProps {
  profile: BillingProfile;
  onBack: () => void;
  onComplete: () => void;
}

export function PaymentMethodEntry({ 
  profile, 
  onBack,
  onComplete 
}: PaymentMethodEntryProps) {
  const { toast } = useToast();
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      agreeToTerms: false,
    },
  });

  const handleSubmit = (data: PaymentFormData) => {
    setPaymentStatus("processing");
    
    // Simulate payment processing
    setTimeout(() => {
      // 80% success rate for demo purposes
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        setPaymentStatus("success");
        toast({
          title: "Payment successful",
          description: "Your payment method has been saved",
        });
        
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        setPaymentStatus("error");
        toast({
          variant: "destructive",
          title: "Payment failed",
          description: "Please try again or use a different payment method",
        });
      }
    }, 1500);
  };

  if (paymentStatus === "success") {
    return (
      <Dialog open={true}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Payment Successful</h3>
            <p className="text-center text-muted-foreground mb-6">
              Your payment method has been successfully saved. You will be redirected shortly.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (paymentStatus === "error") {
    return (
      <Dialog open={true}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Payment Failed</h3>
            <p className="text-center text-muted-foreground mb-6">
              There was an issue processing your payment. Please try again or use a different payment method.
            </p>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => setPaymentStatus("idle")}>
                Try Again
              </Button>
              <Button onClick={onBack}>
                Back
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onBack}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Payment Method</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5" />
                  <h3 className="font-medium">Credit or Debit Card</h3>
                </div>
                
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="1234 5678 9012 3456" 
                            className="font-mono"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cardExpiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="MM/YY" 
                              className="font-mono"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cardCvc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="123" 
                              className="font-mono"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="leading-none">
                      <FormLabel className="text-sm font-normal">
                        I agree to the terms and conditions and authorize charges to my payment method
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
              <Button 
                type="button"
                variant="outline" 
                onClick={onBack}
                className="mt-3 sm:mt-0"
                disabled={paymentStatus === "processing"}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button 
                type="submit"
                disabled={paymentStatus === "processing"}
              >
                {paymentStatus === "processing" ? (
                  <>
                    <span className="animate-spin mr-2">◌</span>
                    Processing...
                  </>
                ) : (
                  "Submit Payment"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
