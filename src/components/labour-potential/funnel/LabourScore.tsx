import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, X } from "lucide-react";

interface Factor {
  name: string;
  impact: string;
  details: string;
}

const LabourScore: React.FC = () => {
  const [openSheet, setOpenSheet] = useState(false);
  const [viewingFactor, setViewingFactor] = useState<Factor | null>(null);

  const currentScore = 72;
  const projectedScore = 84;

  const factors: Factor[] = [
    {
      name: "Increased educational programs",
      impact: "+5",
      details: "This reflects increased access to local technical programs."
    },
    {
      name: "Migration trends from nearby cities",
      impact: "+4",
      details: "Influx of workers from neighbouring cities boosts availability."
    },
    {
      name: "New professional certification programs",
      impact: "+3",
      details: "New initiatives by trade associations support rapid upskilling."
    },
    {
      name: "Aging workforce in certain specialties",
      impact: "-2",
      details: "Declining participation in some critical trades due to age."
    },
    {
      name: "Competitive wage growth",
      impact: "+2",
      details: "Higher wages attracting talent from outside the region."
    },
    {
      name: "Market expansion",
      impact: "+3",
      details: "Retail footprint and infrastructure growth creating more demand."
    }
  ];

  return (
    <>
      {/* Score Cards + Flyout Trigger */}
      <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-2">Current Score (As of 25th April 2025)</div>
            <div className="text-3xl font-bold">{currentScore}/100</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-2">Projected Score (3–5 Years)</div>
            <div className="text-3xl font-bold text-green-600">{projectedScore}/100</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-semibold flex items-center gap-2 mb-1">
              🧠 Why?
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {factors.length} factor drivers impacting score
            </div>
            <Button variant="outline" size="sm" onClick={() => setOpenSheet(true)}>
              <Eye className="w-4 h-4 mr-1" /> View
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Flyout Panel */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent side="right" className="w-[320px] sm:w-[400px]">
          <SheetHeader className="flex flex-row items-center justify-between">
            <SheetTitle>Factor Drivers</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenSheet(false)}
              className="text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </SheetHeader>

          <ScrollArea className="mt-4 h-[80vh] pr-2">
            <div className="space-y-4">
              {factors.map((factor, index) => (
                <div
                  key={index}
                  className="flex flex-col border border-muted px-3 py-2 rounded-md bg-background"
                >
                  <div className="flex justify-between text-sm font-medium">
                    <span>{factor.name}</span>
                    <span
                      className={
                        factor.impact.startsWith("+")
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {factor.impact} pts
                    </span>
                  </div>
                  <div className="text-xs mt-1">
                    <Button
                      size="xs"
                      variant="link"
                      className="px-0 text-blue-600"
                      onClick={() => setViewingFactor(factor)}
                    >
                      View more
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Modal Dialog for More Info */}
      <Dialog open={!!viewingFactor} onOpenChange={() => setViewingFactor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewingFactor?.name}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {viewingFactor?.details}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LabourScore;
