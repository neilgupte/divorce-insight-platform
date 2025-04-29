
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Bot, Send, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface NetworkAIAssistantProps {
  onClose: () => void;
}

const NetworkAIAssistant: React.FC<NetworkAIAssistantProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your Network Optimization assistant. How can I help you analyze your facilities and optimize your network?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sample responses for network optimization topics
  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("optimize") || lowerQuery.includes("network")) {
      return "Network optimization involves balancing facility costs, transportation expenses, and service levels. Would you like me to analyze your current network configuration?";
    }
    
    if (lowerQuery.includes("facility") || lowerQuery.includes("facilities")) {
      return "Your facility distribution affects both operational costs and service coverage. Based on the current data, you could improve coverage by 12% by relocating 2 facilities. Would you like a detailed report?";
    }
    
    if (lowerQuery.includes("cost") || lowerQuery.includes("expense")) {
      return "Cost optimization can be achieved through facility consolidation, better routing, or improved inventory management. The current data suggests potential savings of up to 15% through strategic facility placement.";
    }
    
    if (lowerQuery.includes("simulation") || lowerQuery.includes("scenario")) {
      return "Running a simulation helps evaluate different network configurations. I can generate scenarios based on criteria like cost minimization, service level maximization, or risk reduction. What's your main optimization goal?";
    }
    
    if (lowerQuery.includes("data") || lowerQuery.includes("report")) {
      return "I can prepare detailed reports on network performance, facility utilization, and optimization opportunities. Would you like a report focused on specific regions or metrics?";
    }
    
    return "I can help analyze your network efficiency, simulate optimization scenarios, or provide insights on facility placement. What specific aspect of network optimization interests you?";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(input),
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
      
      if (input.toLowerCase().includes("report") || input.toLowerCase().includes("analyze")) {
        toast({
          title: "Analysis Initiated",
          description: "The network analysis has been started. Results will be available shortly.",
          duration: 3000,
        });
      }
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="shadow-lg border border-border h-full flex flex-col">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot size={18} />
          <CardTitle className="text-base">Network AI Assistant</CardTitle>
        </div>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={onClose}>
          <X size={18} />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-[calc(100%-1rem)] p-4">
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar className={`h-8 w-8 ${message.role === "assistant" ? "bg-primary" : "bg-muted"}`}>
                    {message.role === "assistant" ? (
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </Avatar>
                  
                  <div>
                    <div className={`p-3 rounded-lg ${
                      message.role === "assistant"
                        ? "bg-card border border-border"
                        : "bg-primary text-primary-foreground"
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                    <div className={`text-xs mt-1 text-muted-foreground ${message.role === "user" ? "text-right" : ""}`}>
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <Avatar className="h-8 w-8 bg-primary">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </Avatar>
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-3 border-t bg-card">
        <div className="flex w-full items-center gap-2">
          <Input
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NetworkAIAssistant;
