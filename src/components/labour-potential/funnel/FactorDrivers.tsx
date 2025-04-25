
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUp, ArrowDown, ArrowRight, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";

interface Factor {
  id: string;
  name: string;
  trend: "up" | "down" | "flat";
  multiplier: string;
}

const FactorDrivers: React.FC = () => {
  const [factors, setFactors] = useState<Factor[]>([
    { id: uuidv4(), name: "Local educational programs", trend: "up", multiplier: "1.3x" },
    { id: uuidv4(), name: "Economic growth", trend: "up", multiplier: "1.5x" },
    { id: uuidv4(), name: "Competition for talent", trend: "up", multiplier: "0.8x" },
    { id: uuidv4(), name: "Workforce aging", trend: "down", multiplier: "0.9x" },
    { id: uuidv4(), name: "Training programs", trend: "flat", multiplier: "1.0x" }
  ]);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTrend, setEditTrend] = useState<"up" | "down" | "flat">("up");
  const [editMultiplier, setEditMultiplier] = useState("");
  
  const addFactor = () => {
    const newFactor = {
      id: uuidv4(),
      name: "New Factor",
      trend: "up" as const,
      multiplier: "1.0x"
    };
    setFactors([...factors, newFactor]);
    setEditingId(newFactor.id);
    setEditName(newFactor.name);
    setEditTrend(newFactor.trend);
    setEditMultiplier(newFactor.multiplier);
  };
  
  const startEditing = (factor: Factor) => {
    setEditingId(factor.id);
    setEditName(factor.name);
    setEditTrend(factor.trend);
    setEditMultiplier(factor.multiplier);
  };
  
  const saveEditing = () => {
    if (!editingId) return;
    
    setFactors(factors.map(factor => 
      factor.id === editingId ? {
        ...factor,
        name: editName,
        trend: editTrend,
        multiplier: editMultiplier
      } : factor
    ));
    
    setEditingId(null);
  };
  
  const cancelEditing = () => {
    setEditingId(null);
  };
  
  const deleteFactor = (id: string) => {
    setFactors(factors.filter(factor => factor.id !== id));
    if (editingId === id) {
      cancelEditing();
    }
  };
  
  const getTrendIcon = (trend: "up" | "down" | "flat") => {
    switch (trend) {
      case "up": 
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case "down": 
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      case "flat": 
        return <ArrowRight className="h-4 w-4 text-amber-600" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Top Trends / Factor Drivers</CardTitle>
          <CardDescription>Market factors influencing labour potential</CardDescription>
        </div>
        <Button onClick={addFactor} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Factor
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Factor Name</TableHead>
              <TableHead className="w-24">Trend</TableHead>
              <TableHead className="w-32">Multiplier</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {factors.map(factor => (
              <TableRow key={factor.id}>
                {editingId === factor.id ? (
                  <>
                    <TableCell>
                      <Input 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Select value={editTrend} onValueChange={(value: "up" | "down" | "flat") => setEditTrend(value)}>
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Trend" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="up">Up</SelectItem>
                          <SelectItem value="down">Down</SelectItem>
                          <SelectItem value="flat">Flat</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={editMultiplier} 
                        onChange={(e) => setEditMultiplier(e.target.value)}
                        placeholder="e.g. 1.5x"
                      />
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={saveEditing}>Save</Button>
                      <Button variant="ghost" size="sm" onClick={cancelEditing}>Cancel</Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium">{factor.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(factor.trend)}
                        <span className="capitalize">{factor.trend}</span>
                      </div>
                    </TableCell>
                    <TableCell>{factor.multiplier}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => startEditing(factor)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteFactor(factor.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <Button onClick={addFactor} className="mt-4" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Factor
        </Button>
      </CardContent>
    </Card>
  );
};

export default FactorDrivers;
