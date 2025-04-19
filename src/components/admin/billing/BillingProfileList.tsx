
import { useState } from "react";
import { 
  CreditCard, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  CalendarIcon, 
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BillingProfile } from "./types";
import { BillingProfileDetail } from "./BillingProfileDetail";
import { ClientBillingConfirmation } from "./ClientBillingConfirmation";
import { PaymentMethodEntry } from "./PaymentMethodEntry";

export function BillingProfileList() {
  const [selectedProfile, setSelectedProfile] = useState<BillingProfile | null>(null);
  const [viewMode, setViewMode] = useState<'detail' | 'confirmation' | 'payment'>('detail');
  
  // Mock data for billing profiles
  const billingProfiles: BillingProfile[] = [
    {
      id: 1,
      clientId: 1,
      clientName: "Acme Corporation",
      modules: ["Labour Planning", "Real Estate IQ"],
      seats: 5,
      paymentTerm: "monthly",
      paymentMethod: "card",
      nextBillingDate: "2025-05-15",
      status: "active",
    },
    {
      id: 2,
      clientId: 2,
      clientName: "Tech Innovators",
      modules: ["Labour Planning"],
      seats: 3,
      paymentTerm: "annual",
      paymentMethod: "invoice",
      nextBillingDate: "2026-01-10",
      status: "active",
    },
    {
      id: 3,
      clientId: 3,
      clientName: "StartUp Inc",
      modules: ["Real Estate IQ"],
      seats: 2,
      paymentTerm: "monthly",
      paymentMethod: "trial",
      nextBillingDate: "2025-05-01",
      status: "trial",
    },
    {
      id: 4,
      clientId: 4,
      clientName: "Global Systems",
      modules: ["Labour Planning", "Module 4"],
      seats: 10,
      paymentTerm: "annual",
      paymentMethod: "card",
      nextBillingDate: "2025-12-15",
      status: "suspended",
    }
  ];

  const handleOpenProfile = (profile: BillingProfile) => {
    setSelectedProfile(profile);
    setViewMode('detail');
  };

  const handleClose = () => {
    setSelectedProfile(null);
    setViewMode('detail');
  };

  const handleShowConfirmation = () => {
    setViewMode('confirmation');
  };

  const handleShowPaymentEntry = () => {
    setViewMode('payment');
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {billingProfiles.map((profile) => (
          <div 
            key={profile.id}
            className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleOpenProfile(profile)}
          >
            <div className="flex justify-between mb-3">
              <h3 className="font-medium text-lg">{profile.clientName}</h3>
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
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="capitalize">{profile.paymentMethod}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>
                  {profile.seats} seats ({profile.paymentTerm})
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>Next billing: {profile.nextBillingDate}</span>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {profile.modules.map((module, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {module}
                    </Badge>
                  ))}
                </div>
                
                <Button variant="ghost" className="h-8 w-8 p-0" asChild>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedProfile && viewMode === 'detail' && (
        <BillingProfileDetail 
          profile={selectedProfile}
          onClose={handleClose}
          onContinue={handleShowConfirmation}
        />
      )}
      
      {selectedProfile && viewMode === 'confirmation' && (
        <ClientBillingConfirmation
          profile={selectedProfile}
          onBack={() => setViewMode('detail')}
          onConfirm={handleShowPaymentEntry}
        />
      )}
      
      {selectedProfile && viewMode === 'payment' && (
        <PaymentMethodEntry
          profile={selectedProfile}
          onBack={() => setViewMode('confirmation')}
          onComplete={handleClose}
        />
      )}
    </div>
  );
}
