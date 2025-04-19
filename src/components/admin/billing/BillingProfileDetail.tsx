
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BillingProfile } from "./types";

interface BillingProfileDetailProps {
  profile: BillingProfile;
  onClose: () => void;
  onContinue: () => void;
}

export function BillingProfileDetail({ profile, onClose, onContinue }: BillingProfileDetailProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Client Billing Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{profile.clientName}</h3>
            {profile.status === "active" && (
              <Badge className="bg-green-600">Active</Badge>
            )}
            {profile.status === "trial" && (
              <Badge className="bg-blue-500">Trial</Badge>
            )}
            {profile.status === "suspended" && (
              <Badge variant="destructive">Suspended</Badge>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <span className="text-muted-foreground">Payment Term:</span>
              <span className="capitalize font-medium">{profile.paymentTerm}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="capitalize font-medium">{profile.paymentMethod}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-muted-foreground">Seats:</span>
              <span className="font-medium">{profile.seats}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-muted-foreground">Next Billing:</span>
              <span className="font-medium">{profile.nextBillingDate}</span>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Active Modules</h4>
            <div className="flex flex-wrap gap-2">
              {profile.modules.map((module, i) => (
                <Badge key={i} variant="secondary" className="text-sm">
                  {module}
                </Badge>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Client Actions</h4>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={onContinue} 
                className="w-full justify-start"
              >
                Send Payment Link
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
              >
                Generate Invoice
              </Button>
              {profile.status === "active" ? (
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  Suspend Account
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-green-600 hover:text-green-600"
                >
                  Activate Account
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
