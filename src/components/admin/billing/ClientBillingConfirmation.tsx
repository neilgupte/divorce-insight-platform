
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BillingProfile } from "./types";
import { CheckCircle, ArrowLeft } from "lucide-react";

interface ClientBillingConfirmationProps {
  profile: BillingProfile;
  onBack: () => void;
  onConfirm: () => void;
}

export function ClientBillingConfirmation({ 
  profile, 
  onBack,
  onConfirm 
}: ClientBillingConfirmationProps) {
  // Calculate monthly price based on mock data
  const basePrice = 99.99;
  const seatsPrice = profile.seats * basePrice;
  
  // Apply annual discount if applicable
  const isAnnual = profile.paymentTerm === "annual";
  const discount = isAnnual ? 0.2 : 0; // 20% annual discount
  const totalPrice = seatsPrice * (1 - discount);
  
  // Format the prices
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalPrice);
  
  const formattedMonthlyPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(basePrice);

  return (
    <Dialog open={true} onOpenChange={onBack}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirm Billing Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">
              {profile.clientName}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Please review your subscription details below
            </p>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-1">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-medium">Business Plan</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <span className="text-muted-foreground">Billing Cycle:</span>
                <span className="font-medium capitalize">{profile.paymentTerm}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <span className="text-muted-foreground">Seats:</span>
                <span className="font-medium">{profile.seats}</span>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-1">
                <span className="text-muted-foreground">Price per seat:</span>
                <span className="font-medium">{formattedMonthlyPrice}/month</span>
              </div>
              
              {isAnnual && (
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-muted-foreground">Annual discount:</span>
                  <span className="font-medium text-green-600">20%</span>
                </div>
              )}
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-1">
                <span className="font-medium">Total Price:</span>
                <span className="font-bold">
                  {formattedPrice}/{isAnnual ? 'year' : 'month'}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Included Modules</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {profile.modules.map((module, i) => (
                <li key={i}>
                  {module} <CheckCircle className="h-3 w-3 inline text-green-600 ml-1" />
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mt-3 sm:mt-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Button onClick={onConfirm}>
            Confirm & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
