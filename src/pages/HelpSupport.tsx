
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Search, Mail, LifeBuoy, BookOpen, MessageSquare, FileText, Map, PieChart, FileBox, Bot, User, Settings } from "lucide-react";

const HelpSupport = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Support Request Submitted",
      description: "We've received your request and will respond shortly.",
    });
    setContactSubject("");
    setContactMessage("");
  };

  // Sample FAQs
  const faqs = [
    {
      question: "How do I interpret the divorce rate indicators?",
      answer: "Divorce rate indicators are shown as percentages based on population data. Red indicates higher than average rates, while green indicates lower than average. You can hover over any indicator to see the exact percentages and how they compare to national averages."
    },
    {
      question: "Can I export data to my own analytics tools?",
      answer: "Yes! All reports generated in the Report Generator can be exported in multiple formats including CSV, Excel, PDF, and JSON. This allows you to import the data into your preferred analytics tools for further processing."
    },
    {
      question: "How is the luxury score calculated?",
      answer: "The luxury score is a composite metric based on multiple factors including: property values, high-end amenities (spas, golf courses, exclusive clubs), luxury retail presence, and concentration of high net worth individuals. The algorithm weighs these factors to produce a score from 1-100."
    },
    {
      question: "How often is the data updated?",
      answer: "Most demographic and statistical data is updated quarterly, while property listings and luxury indicators are updated monthly. Real-time data sources like market trends may be updated daily. You can check the 'Last Updated' timestamp on each data view for specific information."
    },
    {
      question: "How do I grant access to another team member?",
      answer: "If you have superuser privileges, you can add team members through the User Management page. Navigate there from the sidebar, click 'Add User', enter their email and select appropriate permission levels. They'll receive an invitation to join the platform."
    },
    {
      question: "Can I create custom regions for analysis?",
      answer: "Yes, you can create custom regions by using the 'Custom Region' tool in the Location Analyzer. This allows you to define areas by drawing polygons on the map or by selecting multiple existing regions to combine into a single analysis unit."
    }
  ];

  // Sample AI prompt guides
  const aiPromptGuides = [
    {
      title: "Location Comparison",
      description: "Compare multiple locations against selected criteria",
      prompts: [
        "Compare divorce rates in Beverly Hills, Aspen, and Palm Beach",
        "Which areas have the highest concentration of properties valued over $5M?",
        "Show me locations with both high wealth indicators and low divorce rates"
      ]
    },
    {
      title: "Trend Analysis",
      description: "Identify trends over time in specific metrics",
      prompts: [
        "Show divorce rate trends in California over the last 5 years",
        "Has the luxury property market in Miami changed since 2020?",
        "Plot the correlation between high net worth individuals and divorce filings"
      ]
    },
    {
      title: "Report Creation",
      description: "Generate comprehensive reports with visualizations",
      prompts: [
        "Create a detailed report on Chicago's luxury real estate market",
        "Generate a comparative analysis of divorce statistics across the top 10 wealthiest counties",
        "Prepare a quarterly report on wealth distribution changes in New York state"
      ]
    },
    {
      title: "Document Analysis",
      description: "Extract insights from documents in the vault",
      prompts: [
        "Summarize key findings from all documents related to California property valuations",
        "What do our reports say about seasonal trends in divorce filings?",
        "Extract all data points about high net worth divorces from the last 3 quarterly reports"
      ]
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq => 
    searchQuery === "" || 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sample feature guides
  const featureGuides = [
    {
      icon: PieChart,
      title: "Dashboard",
      description: "Navigate the main dashboard and interpret KPIs",
      link: "/help/dashboard"
    },
    {
      icon: Map,
      title: "Location Analyzer",
      description: "Compare locations and analyze wealth indicators",
      link: "/help/location-analyzer"
    },
    {
      icon: FileText,
      title: "Report Generator",
      description: "Create, customize, and export reports",
      link: "/help/reports"
    },
    {
      icon: FileBox,
      title: "Document Vault",
      description: "Securely store and organize documents",
      link: "/help/documents"
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Get the most out of the AI capabilities",
      link: "/help/ai-assistant"
    },
    {
      icon: User,
      title: "User Management",
      description: "Add and manage platform users",
      link: "/help/user-management"
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Configure your experience and preferences",
      link: "/help/settings"
    }
  ];

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">Get assistance and learn how to use DivorceIQ effectively</p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            className="pl-10 py-6 text-lg"
            placeholder="Search for help topics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5" />
                <CardTitle>User Guides</CardTitle>
              </div>
              <CardDescription>
                Step-by-step tutorials for all features
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-5 w-5" />
                <CardTitle>Ask AI</CardTitle>
              </div>
              <CardDescription>
                Get instant help from our AI assistant
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5" />
                <CardTitle>Contact Support</CardTitle>
              </div>
              <CardDescription>
                Reach our dedicated support team
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="guides" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="guides">Feature Guides</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="ai-prompts">AI Prompt Examples</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guides" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Feature Guides</CardTitle>
              <CardDescription>
                Learn how to use each part of the DivorceIQ platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {featureGuides.map((guide, index) => (
                  <Card key={index} className="hover:bg-accent/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <guide.icon className="h-5 w-5" />
                        <CardTitle className="text-base">{guide.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        {guide.description}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="link" className="p-0">Read guide</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No FAQs match your search query</p>
                  <Button 
                    variant="link" 
                    onClick={() => setSearchQuery("")}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai-prompts" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>AI Assistant Prompt Examples</CardTitle>
              <CardDescription>
                Learn how to effectively use Lexi, your AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {aiPromptGuides.map((category, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-44 rounded-md border p-4">
                        <ul className="space-y-3">
                          {category.prompts.map((prompt, promptIndex) => (
                            <li key={promptIndex} className="flex gap-2">
                              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 rounded-full">
                                <MessageSquare className="h-4 w-4" />
                                <span className="sr-only">Copy prompt</span>
                              </Button>
                              <span className="text-sm">{prompt}</span>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Get in touch with our support team for personalized assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Subject
                  </label>
                  <Input 
                    id="subject"
                    placeholder="Briefly describe your issue" 
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <Textarea 
                    id="message"
                    placeholder="Please provide details about your question or issue" 
                    className="min-h-[150px]"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Submit Request
                  </Button>
                  <Button type="button" variant="outline" className="gap-2">
                    <LifeBuoy className="h-4 w-4" />
                    Schedule Call
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Support Hours</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Monday - Friday</span>
                <span>9:00 AM - 8:00 PM ET</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Saturday</span>
                <span>10:00 AM - 6:00 PM ET</span>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>support@divorceiq.example.com</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <LifeBuoy className="h-4 w-4" />
                <span>Emergency Support: +1 (800) 555-0123</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpSupport;
