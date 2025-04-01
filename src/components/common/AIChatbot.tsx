
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, Sparkles, X, Maximize2, Minimize2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

// Define types for our component
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type ChatbotAction = {
  name: string;
  description: string;
  handler: () => void;
};

interface AIChatbotProps {
  initialMessage?: string;
  title?: string;
  onAction?: (actionType: string, data: any) => void;
  availableActions?: ChatbotAction[];
  minimized?: boolean;
  onToggleMinimize?: () => void;
}

// Mock AI responses based on user input patterns
const generateAIResponse = (message: string): string => {
  // Convert to lowercase for easier matching
  const lowercaseMsg = message.toLowerCase();
  
  // Detect commands related to filtering
  if (lowercaseMsg.includes('show') || lowercaseMsg.includes('filter')) {
    // State detection
    if (lowercaseMsg.includes('california')) {
      return "I've filtered the dashboard to show California. You can see the updated metrics now.";
    } else if (lowercaseMsg.includes('new york')) {
      return "I've updated the filters to focus on New York. The dashboard now shows data specific to this state.";
    } else if (lowercaseMsg.includes('florida')) {
      return "Florida data is now displayed on the dashboard. Notice the higher luxury property density.";
    } else if (lowercaseMsg.includes('texas')) {
      return "I've filtered to show Texas data. The dashboard now reflects metrics specific to Texas.";
    }
    
    // Net worth detection
    if (lowercaseMsg.includes('high net worth') || lowercaseMsg.includes('wealthy')) {
      return "I've adjusted the filters to show only high net worth individuals ($20M+). The dashboard has been updated.";
    } else if (lowercaseMsg.includes('above $10m')) {
      return "I've set the net worth range to be above $10M. You can see the updated metrics on the dashboard.";
    }
  }
  
  // Handle specific data questions
  if (lowercaseMsg.includes('divorce rate')) {
    return "The average divorce rate for high-net-worth individuals is 5.8%, which is 2.3% higher than last year. Florida and Nevada show the highest rates at 7.2% and 8.1% respectively.";
  }
  
  if (lowercaseMsg.includes('asset protection')) {
    return "Asset protection rates vary significantly by state. The national average is 38%, with New York (52%) and California (49%) showing the highest adoption rates, typically through irrevocable trusts and LLC structures.";
  }
  
  if (lowercaseMsg.includes('trust') || lowercaseMsg.includes('trusts')) {
    return "Trust creation is highly correlated with divorce planning. Data shows 76% of high-net-worth individuals establish irrevocable trusts 12-18 months before filing for divorce, with the highest activity in coastal regions.";
  }
  
  if (lowercaseMsg.includes('export') || lowercaseMsg.includes('download')) {
    return "I've prepared an export of the current dashboard view. You can download it as a PDF or CSV from the export menu in the top right of the dashboard.";
  }
  
  if (lowercaseMsg.includes('insights') || lowercaseMsg.includes('analyze')) {
    return "Based on current filter settings, I notice an anomaly in asset transfers among ultra-high-net-worth individuals in the selected region. There's a 32% increase in property transfers to LLCs compared to the same period last year.";
  }
  
  if (lowercaseMsg.includes('summarize') || lowercaseMsg.includes('summary')) {
    return "Dashboard Summary: Average net worth is $14.2M (↑12.5%), divorce rate is 5.8% (↑2.3%), luxury property density is 6.2/km² (↑8.4%), and asset protection rate is 38% (↑15.2%). Florida and California show the highest activity across all metrics.";
  }
  
  // Default responses if no specific patterns are matched
  const defaultResponses = [
    "I can help you analyze divorce trends and asset protection strategies across different states and net worth brackets. What specific insights are you looking for?",
    "Would you like me to filter the dashboard or explain any specific metrics you see?",
    "I can help you interpret the data or adjust the dashboard view. What would you like to know?",
    "Is there a particular state or net worth bracket you'd like to focus on?",
    "I can export this view, save it as a snapshot, or perform deeper analysis. What would you prefer?"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

const AIChatbot: React.FC<AIChatbotProps> = ({
  initialMessage = "Hello! I'm Lexi, your AI assistant. I can help you analyze data, filter the dashboard, or export insights. What would you like to know?",
  title = "Lexi AI Assistant",
  onAction,
  availableActions = [],
  minimized = false,
  onToggleMinimize
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    if (!minimized) {
      inputRef.current?.focus();
    }
  }, [minimized]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      // Generate AI response
      const aiResponse = generateAIResponse(userMessage.content);
      
      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Show toast for specific actions
      if (userMessage.content.toLowerCase().includes('filter') || 
          userMessage.content.toLowerCase().includes('show')) {
        toast({
          title: "Dashboard Updated",
          description: "The dashboard filters have been updated based on your request.",
          duration: 3000,
          variant: "default",
        });
        
        // Call onAction callback if provided
        if (onAction) {
          onAction('filter', { source: userMessage.content });
        }
      }
      
      if (userMessage.content.toLowerCase().includes('export') || 
          userMessage.content.toLowerCase().includes('download')) {
        toast({
          title: "Export Prepared",
          description: "Your export is ready for download.",
          duration: 3000,
          variant: "default",
        });
        
        // Call onAction callback if provided
        if (onAction) {
          onAction('export', { format: 'pdf' });
        }
      }
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // If minimized, render only the header with minimize/maximize button
  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 w-64 shadow-lg rounded-md z-50">
        <CardHeader className="p-3 flex-row items-center justify-between bg-primary text-primary-foreground rounded-t-md cursor-pointer" onClick={onToggleMinimize}>
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-sm">{title}</CardTitle>
          </div>
          <Maximize2 className="h-4 w-4 cursor-pointer" onClick={(e) => {
            e.stopPropagation();
            if (onToggleMinimize) onToggleMinimize();
          }} />
        </CardHeader>
      </div>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col shadow-lg overflow-hidden">
      <CardHeader className="p-4 flex-row items-center justify-between bg-primary text-primary-foreground">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </div>
        {onToggleMinimize && (
          <Minimize2 
            className="h-4 w-4 cursor-pointer" 
            onClick={onToggleMinimize}
          />
        )}
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4 bg-muted/20">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className={`h-8 w-8 ${message.role === 'assistant' ? 'bg-primary' : 'bg-muted'}`}>
                  {message.role === 'assistant' ? <Bot className="h-4 w-4 text-primary-foreground" /> : <User className="h-4 w-4" />}
                </Avatar>
                <div>
                  <div className={`p-3 rounded-lg ${
                    message.role === 'assistant' 
                      ? 'bg-card text-card-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    {message.content}
                  </div>
                  <div className={`text-xs mt-1 text-muted-foreground ${message.role === 'user' ? 'text-right' : ''}`}>
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[80%]">
                <Avatar className="h-8 w-8 bg-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </Avatar>
                <div className="p-3 rounded-lg bg-card text-card-foreground">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Available actions */}
          {availableActions.length > 0 && (
            <div className="flex flex-wrap gap-2 my-2">
              {availableActions.map((action, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={action.handler}
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  {action.name}
                </Badge>
              ))}
            </div>
          )}
          
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
      
      <CardFooter className="p-4 border-t bg-card">
        <div className="flex w-full items-center space-x-2">
          <Input
            ref={inputRef}
            placeholder="Type your message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button 
            size="icon" 
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIChatbot;
