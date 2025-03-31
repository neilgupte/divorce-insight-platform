
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AI_SAMPLE_RESPONSES } from "@/data/mockData";
import { Send, Bot, User, PanelLeftClose, PanelLeftOpen, LineChart, Map, FileSearch, Table } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  visualizations?: Visualization[];
}

interface Visualization {
  type: "chart" | "map" | "table";
  title: string;
  data?: any;
}

// Sample chart data for visualizations
const chartData = [
  { name: "Palm Beach", value: 34.2 },
  { name: "Miami-Dade", value: 28.7 },
  { name: "Collier", value: 22.5 },
  { name: "Broward", value: 17.3 },
  { name: "Orange", value: 14.8 },
];

// Sample table data
const tableData = [
  { location: "Palm Beach, FL", divorceRate: 6.8, netWorth: "$22.5M", properties: 532 },
  { location: "Marin County, CA", divorceRate: 5.2, netWorth: "$18.7M", properties: 467 },
];

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      content: "Hello, I'm Lexi, your AI assistant for divorce intelligence. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested queries
  const suggestedQueries = [
    "Show me counties in Florida with the highest rate of asset protection cases",
    "Compare Palm Beach, FL to Marin County, CA",
    "Create a dashboard for luxury property distribution in New York",
    "Summarize divorce trends among tech executives in California",
    "Show me high-net-worth divorce hotspots near private airports",
  ];

  // Autoscroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse: Message;
      
      // Check if we have a sample response for this query
      const sampleResponse = AI_SAMPLE_RESPONSES.find(
        (sample) => sample.query.toLowerCase() === input.toLowerCase()
      );

      if (input.toLowerCase().includes("florida") && input.toLowerCase().includes("asset protection")) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          content: "Analyzing data for Florida counties:\n\n1. Palm Beach County: 34.2% of cases\n2. Miami-Dade County: 28.7% of cases\n3. Collier County (Naples): 22.5% of cases\n4. Broward County: 17.3% of cases\n5. Orange County: 14.8% of cases\n\nWould you like me to generate a visualization of this data?",
          sender: "ai",
          timestamp: new Date(),
          visualizations: [
            {
              type: "chart",
              title: "Asset Protection Cases by Florida County",
              data: chartData,
            },
          ],
        };
      } else if (input.toLowerCase().includes("compare") && input.toLowerCase().includes("palm beach") && input.toLowerCase().includes("marin")) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          content: "Comparison between Palm Beach, FL and Marin County, CA:\n\nDivorce Rate:\nPalm Beach: 6.8 per 1,000 households\nMarin County: 5.2 per 1,000 households\n\nAverage Net Worth:\nPalm Beach: $22.5M\nMarin County: $18.7M\n\nLuxury Real Estate:\nPalm Beach: 532 properties above $5M\nMarin County: 467 properties above $5M\n\nPrivate Transportation Access:\nPalm Beach: 3 private airports, 5 marinas\nMarin County: 1 private airport, 3 marinas\n\nWould you like me to generate a detailed report comparing these locations?",
          sender: "ai",
          timestamp: new Date(),
          visualizations: [
            {
              type: "table",
              title: "Palm Beach vs. Marin County Comparison",
              data: tableData,
            },
          ],
        };
      } else if (sampleResponse) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          content: sampleResponse.response,
          sender: "ai",
          timestamp: new Date(),
        };
      } else {
        aiResponse = {
          id: `ai-${Date.now()}`,
          content: "I'm analyzing your request. This might involve looking at high-net-worth divorce data, property information, or other metrics from our database. Can you provide more specific details about what you're looking for?",
          sender: "ai",
          timestamp: new Date(),
        };
      }
      
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] flex-col px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Assistant (Lexi)</h1>
          <p className="text-muted-foreground">
            Ask questions about high-net-worth divorce data and insights
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </Button>
      </div>

      <div className="grid flex-1 gap-4 overflow-hidden md:grid-cols-4">
        {/* Sidebar with suggested queries */}
        {sidebarOpen && (
          <Card className="flex flex-col md:col-span-1">
            <CardContent className="flex flex-col p-4">
              <h3 className="mb-4 text-sm font-medium">Suggested Queries</h3>
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {suggestedQueries.map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left text-sm"
                      onClick={() => handleSuggestedQuery(query)}
                    >
                      {query}
                    </Button>
                  ))}
                </div>
                <div className="mt-4 rounded-md bg-muted p-3">
                  <h4 className="mb-2 text-xs font-medium">Query Tips</h4>
                  <ul className="list-inside list-disc text-xs text-muted-foreground">
                    <li>Ask about specific locations</li>
                    <li>Request data visualizations</li>
                    <li>Compare multiple regions</li>
                    <li>Filter by net worth or time period</li>
                    <li>Ask for report generation</li>
                  </ul>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Chat area */}
        <Card className={`flex flex-col ${sidebarOpen ? "md:col-span-3" : "md:col-span-4"}`}>
          <CardContent className="flex flex-1 flex-col p-4">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex max-w-[80%] items-start space-x-2">
                      {message.sender === "ai" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="mb-1 text-sm whitespace-pre-line">{message.content}</p>
                        {message.visualizations && (
                          <div className="mt-4 space-y-4">
                            {message.visualizations.map((viz, index) => (
                              <div key={index} className="rounded-md bg-background p-2">
                                <div className="mb-2 flex items-center">
                                  {viz.type === "chart" && <LineChart className="mr-2 h-4 w-4 text-primary" />}
                                  {viz.type === "map" && <Map className="mr-2 h-4 w-4 text-primary" />}
                                  {viz.type === "table" && <Table className="mr-2 h-4 w-4 text-primary" />}
                                  <span className="text-xs font-medium">{viz.title}</span>
                                </div>
                                
                                {viz.type === "chart" && viz.data && (
                                  <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <BarChart data={viz.data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#3B82F6" />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                )}
                                
                                {viz.type === "table" && viz.data && (
                                  <div className="mt-2 overflow-x-auto">
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="border-b">
                                          {Object.keys(viz.data[0]).map((key) => (
                                            <th key={key} className="p-2 text-left font-medium">{key}</th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {viz.data.map((row: any, rowIndex: number) => (
                                          <tr key={rowIndex} className="border-b">
                                            {Object.values(row).map((value: any, valueIndex: number) => (
                                              <td key={valueIndex} className="p-2">{value}</td>
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-1 text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-muted-foreground">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[80%] items-start space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg bg-muted px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40" style={{ animationDelay: "0.2s" }}></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2">
              <Input
                placeholder="Ask Lexi a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;
