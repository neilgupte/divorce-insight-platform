import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  X, 
  MinusSquare,
  Bot, 
  User,
  Send,
  Maximize,
  Minimize,
  BarChart3,
  Filter,
  Download,
} from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { US_STATES, TOP_CITIES } from "@/data/mockData";
import { formatNetWorth } from "@/lib/utils";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface DashboardFilters {
  selectedState: string;
  selectedCity: string;
  netWorthRange: [number, number];
}

interface UpdateFiltersHandlers {
  setSelectedState: (state: string) => void;
  setSelectedCity: (city: string) => void;
  setNetWorthRange: (range: [number, number]) => void;
}

interface AIChatbotProps {
  dashboardFilters: DashboardFilters;
  onUpdateFilters: UpdateFiltersHandlers;
  onExport: (format: 'pdf' | 'csv') => void;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ 
  dashboardFilters, 
  onUpdateFilters,
  onExport
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: "Hello, I'm Lexi, your AI assistant. How can I help you with the dashboard today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addNotification } = useNotifications();

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    // Process user request - either update filters or provide information
    processUserRequest(input);
  };

  const processUserRequest = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    
    // Check if the request is to update filters
    if (shouldUpdateFilters(lowerInput)) {
      updateFiltersBasedOnQuery(lowerInput);
      return;
    }
    
    // Check if the request is to export data
    if (isExportRequest(lowerInput)) {
      handleExportRequest(lowerInput);
      return;
    }
    
    // Otherwise, provide information based on query
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: getAIResponse(userInput),
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
      
      // Create a notification that AI has responded
      addNotification({
        title: "AI Assistant Response",
        description: "Lexi has responded to your question.",
        type: "ai",
      });
    }, 1500);
  };

  // Check if the query is asking to update dashboard filters
  const shouldUpdateFilters = (query: string): boolean => {
    // Check for state-related keywords
    const containsState = US_STATES.some(state => 
      query.includes(state.toLowerCase())
    );
    
    // Check for filter-related commands
    const filterCommands = [
      'show', 'filter', 'display', 'view', 'set', 'change'
    ];
    
    const hasFilterCommand = filterCommands.some(cmd => 
      query.includes(cmd)
    );
    
    // Check for net worth mentions
    const netWorthMention = query.includes('$') || 
      query.includes('million') || 
      query.includes('net worth');
    
    return (containsState || netWorthMention) && hasFilterCommand;
  };

  // Check if the request is to export data
  const isExportRequest = (query: string): boolean => {
    const exportKeywords = ['export', 'download', 'save', 'generate report', 'create report', 'pdf', 'csv'];
    return exportKeywords.some(keyword => query.includes(keyword));
  };

  // Handle export requests
  const handleExportRequest = (query: string) => {
    const format = query.includes('pdf') ? 'pdf' : 'csv';
    
    // Generate AI response first
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: `I'll export the current dashboard view as a ${format.toUpperCase()} file for you.`,
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
      
      // Trigger export
      onExport(format);
      
      // Create a notification
      addNotification({
        title: `Exporting Dashboard as ${format.toUpperCase()}`,
        description: "Your export is being prepared.",
        type: "info",
      });
    }, 1000);
  };

  // Update filters based on natural language query
  const updateFiltersBasedOnQuery = (query: string) => {
    let updatedState = dashboardFilters.selectedState;
    let updatedCity = dashboardFilters.selectedCity;
    let updatedNetWorthRange: [number, number] = [...dashboardFilters.netWorthRange];
    let updatedFilters = false;
    
    // Check for state mentions
    US_STATES.forEach(state => {
      if (query.toLowerCase().includes(state.toLowerCase())) {
        updatedState = state;
        updatedCity = "All Cities"; // Reset city when state changes
        updatedFilters = true;
      }
    });
    
    // Check for net worth range mentions
    // Simple parsing for ranges like "$5M-$20M" or "between 5 and 20 million"
    const netWorthRangeRegex = /\$?(\d+)(?:M)?(?:\s*[-–—to]\s*|\s*and\s*)\$?(\d+)(?:M)?/i;
    const netWorthMatch = query.match(netWorthRangeRegex);
    
    if (netWorthMatch && netWorthMatch.length >= 3) {
      const min = parseInt(netWorthMatch[1]);
      const max = parseInt(netWorthMatch[2]);
      
      if (!isNaN(min) && !isNaN(max) && min <= max) {
        updatedNetWorthRange = [
          Math.max(1, Math.min(50, min)),
          Math.min(50, max)
        ] as [number, number];
        updatedFilters = true;
      }
    }
    
    // Check for specific city mentions (if state is already selected)
    if (updatedState !== "All States" && TOP_CITIES[updatedState]) {
      TOP_CITIES[updatedState].forEach(city => {
        if (query.toLowerCase().includes(city.toLowerCase())) {
          updatedCity = city;
          updatedFilters = true;
        }
      });
    }
    
    // If filters were updated, apply them and respond
    if (updatedFilters) {
      // Apply the filter updates
      if (updatedState !== dashboardFilters.selectedState) {
        onUpdateFilters.setSelectedState(updatedState);
      }
      
      if (updatedCity !== dashboardFilters.selectedCity) {
        onUpdateFilters.setSelectedCity(updatedCity);
      }
      
      if (
        updatedNetWorthRange[0] !== dashboardFilters.netWorthRange[0] ||
        updatedNetWorthRange[1] !== dashboardFilters.netWorthRange[1]
      ) {
        onUpdateFilters.setNetWorthRange(updatedNetWorthRange);
      }
      
      // Create AI response
      setTimeout(() => {
        const locationText = updatedCity !== "All Cities" 
          ? `${updatedCity}, ${updatedState}` 
          : updatedState !== "All States" 
            ? updatedState 
            : "all tracked regions";
            
        const netWorthText = `${formatNetWorth(updatedNetWorthRange[0])} to ${formatNetWorth(updatedNetWorthRange[1])}`;
        
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          content: `I've updated the dashboard filters to show data for ${locationText} with net worth range of ${netWorthText}.`,
          sender: "ai",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
        
        // Create a notification
        addNotification({
          title: "Filters Updated",
          description: `Dashboard now showing: ${locationText}, ${netWorthText}`,
          type: "info",
        });
      }, 1000);
    } else {
      // No filter updates were detected, provide a standard response
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          content: "I didn't recognize specific filters to update. You can ask me to filter by state, city, or net worth range. For example, 'Show data for California with net worth $5M to $20M'.",
          sender: "ai",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1000);
    }
  };

  // Enhanced AI response generator with dashboard-specific information
  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Check for dashboard stats queries
    if (
      lowerQuestion.includes('stats') || 
      lowerQuestion.includes('statistics') || 
      lowerQuestion.includes('metrics') ||
      lowerQuestion.includes('summary') ||
      lowerQuestion.includes('overview')
    ) {
      const { selectedState, selectedCity, netWorthRange } = dashboardFilters;
      const locationText = selectedCity !== "All Cities" 
        ? `${selectedCity}, ${selectedState}` 
        : selectedState !== "All States" 
          ? selectedState 
          : "all tracked regions";
      
      return `Based on current dashboard data for ${locationText} (net worth range: ${formatNetWorth(netWorthRange[0])} to ${formatNetWorth(netWorthRange[1])}):
      
• Average net worth is trending up by 12% compared to last year
• Divorce rate shows a concerning 4% increase year-over-year
• Luxury property density has grown 8%, indicating market expansion
• Asset protection strategies usage remains steady with minimal change

Would you like me to filter the dashboard to focus on a specific region or net worth bracket?`;
    }
    
    // Check for divorce rate questions
    if (
      lowerQuestion.includes('divorce') || 
      lowerQuestion.includes('divorce rate')
    ) {
      return `The current divorce rate for the selected filters is 5.8%, which represents a 4% increase from last year. This is higher than the national average for general population, which is around 2.7%. High-net-worth individuals in the $10M-$30M bracket show the highest vulnerability to divorce, particularly in coastal states.`;
    }
    
    // Check for net worth questions
    if (
      lowerQuestion.includes('net worth') || 
      lowerQuestion.includes('wealth') ||
      lowerQuestion.includes('assets')
    ) {
      return `The average net worth based on current filters is $14.2M, up 12% from last year. This growth outpaces inflation and is primarily driven by real estate appreciation and market gains. The top 10% of individuals in this dataset have net worth exceeding $30M.`;
    }
    
    // Location-specific responses
    if (lowerQuestion.includes('location') || lowerQuestion.includes('area') || lowerQuestion.includes('region')) {
      return "Based on our data, Palm Beach, FL and Greenwich, CT currently show the highest concentration of high-net-worth divorce cases. Other notable locations include Manhattan, NY; Atherton, CA; and Naples, FL. Would you like me to update the dashboard to focus on any of these regions?";
    } 
    
    // Asset protection strategies
    if (lowerQuestion.includes('protection') || lowerQuestion.includes('asset protection')) {
      return "Asset protection rates are currently at 38% across the filtered dataset, showing little change from last year. The most common strategies include trusts (43%), family limited partnerships (28%), and offshore structures (18%). Would you like a detailed report on asset protection trends?";
    }
    
    // Help with dashboard usage
    if (lowerQuestion.includes('help') || lowerQuestion.includes('how to')) {
      return `I can help you interact with the dashboard in several ways:

1. Filter data: Ask me to "Show data for Florida with net worth above $10M"
2. Generate insights: Ask "What's the divorce rate trend in California?"
3. Export data: Say "Export this view as PDF" or "Download as CSV"
4. Save views: I can help you save the current dashboard configuration

What would you like to do?`;
    }
    
    // Default response if nothing specific is matched
    return "I can help with dashboard filtering, data analysis, report generation, and insights about high-net-worth divorce trends. You can ask me to show specific locations, net worth brackets, or explain the metrics you're seeing.";
  };

  // Toggle chat open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isMinimized) {
      setIsMinimized(false);
    }
  };

  // Toggle minimize
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <Button 
          onClick={toggleChat} 
          className="h-12 w-12 rounded-full shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`shadow-lg transition-all duration-200 overflow-hidden ${
          isMinimized ? 'h-14 w-80' : 'h-96 w-80 sm:w-96'
        }`}>
          {/* Chat Header */}
          <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback className="bg-primary-foreground text-primary">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">Lexi AI Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-primary-foreground hover:text-primary-foreground/80"
                onClick={toggleMinimize}
              >
                {isMinimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-primary-foreground hover:text-primary-foreground/80"
                onClick={toggleChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content - Only shown when not minimized */}
          {!isMinimized && (
            <>
              <ScrollArea className="flex-1 p-3 h-[calc(24rem-3.5rem-3.5rem)]">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[85%]`}>
                        {message.sender === "ai" && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`rounded-lg px-3 py-2 ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <div className="mt-1 text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        {message.sender === "user" && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className="bg-muted-foreground text-muted">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce"></div>
                            <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <form onSubmit={handleSubmit} className="p-3 border-t">
                <div className="flex items-center space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about data or update filters..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isLoading || !input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default AIChatbot;
