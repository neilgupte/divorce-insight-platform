
import React, { useState } from "react";
import AIChatbot from "@/components/common/AIChatbot";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingAIChatbotProps {
  title?: string;
  initialMessage?: string;
}

const FloatingAIChatbot: React.FC<FloatingAIChatbotProps> = ({
  title = "AI Assistant",
  initialMessage = "Hello! How can I help you today?",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-96 h-[500px] shadow-xl">
          <AIChatbot 
            title={title}
            initialMessage={initialMessage}
            minimized={false}
            onToggleMinimize={() => setIsOpen(false)}
          />
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full shadow-lg h-12 w-12 p-0 bg-primary"
        >
          <Bot className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default FloatingAIChatbot;
