
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  userId: string;
  userName: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
}

interface MessagingContextType {
  messages: Message[];
  conversations: Conversation[];
  activeConversation: string | null;
  unreadTotal: number;
  sendMessage: (recipientId: string, recipientName: string, content: string) => void;
  markAsRead: (userId: string) => void;
  setActiveConversation: (userId: string | null) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  // Generate conversations based on messages
  const conversations = React.useMemo(() => {
    if (!user) return [];

    // Get unique user IDs from messages (excluding current user)
    const userIds = Array.from(
      new Set([
        ...messages.map(m => m.senderId),
        ...messages.map(m => m.recipientId)
      ])
    ).filter(id => id !== user.id);

    // Create a conversation object for each unique user
    return userIds.map(userId => {
      // Get all messages between current user and this user
      const conversationMessages = messages.filter(
        m => (m.senderId === userId && m.recipientId === user.id) ||
             (m.senderId === user.id && m.recipientId === userId)
      ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      // Get the most recent message
      const lastMessage = conversationMessages[0];
      
      // Count unread messages sent by the other user
      const unreadCount = conversationMessages.filter(
        m => m.senderId === userId && !m.read
      ).length;

      return {
        userId,
        userName: conversationMessages.find(m => m.senderId === userId)?.senderName || "Unknown User",
        lastMessage: lastMessage?.content || "",
        timestamp: lastMessage?.timestamp || new Date(),
        unreadCount
      };
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [messages, user]);

  // Calculate total unread messages
  const unreadTotal = React.useMemo(() => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  }, [conversations]);

  // Send a message
  const sendMessage = (recipientId: string, recipientName: string, content: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      senderId: user.id,
      senderName: user.name,
      recipientId,
      content,
      timestamp: new Date(),
      read: false
    };

    setMessages(prev => [...prev, newMessage]);

    // Mock receiving a response after a delay
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const responses = [
          "I'll review this and get back to you shortly.",
          "Thanks for the update. Let's discuss this at our next meeting.",
          "Great insight. I'll incorporate this into our analysis.",
          "Can you provide more details on this case?",
          "I've forwarded this to the research team.",
        ];
        
        const responseMessage: Message = {
          id: Math.random().toString(36).substring(2, 9),
          senderId: recipientId,
          senderName: recipientName,
          recipientId: user.id,
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          read: false
        };
        
        setMessages(prev => [...prev, responseMessage]);
        
        // Add notification for new message
        addNotification({
          title: "New Message",
          description: `${recipientName} has sent you a message.`,
          type: "user",
        });
      }, 8000 + Math.random() * 5000);
    }
  };

  // Mark all messages from a specific user as read
  const markAsRead = (userId: string) => {
    setMessages(prev => 
      prev.map(message => 
        message.senderId === userId && message.recipientId === user?.id && !message.read
          ? { ...message, read: true }
          : message
      )
    );
  };

  // Load initial sample data
  useEffect(() => {
    if (!user) return;

    const teamMembers = [
      { id: "user1", name: "Marie Johnson" },
      { id: "user2", name: "Robert Chen" },
      { id: "user3", name: "Sarah Williams" },
    ];

    const sampleMessages: Message[] = [
      // Conversation with Marie
      {
        id: "m1",
        senderId: "user1",
        senderName: "Marie Johnson",
        recipientId: user.id,
        content: "Have you seen the new data on Palm Beach? Divorce rates are up 1.5% this quarter.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false
      },
      {
        id: "m2",
        senderId: user.id,
        senderName: user.name,
        recipientId: "user1",
        content: "Not yet. Can you send me the report?",
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
        read: true
      },
      
      // Conversation with Robert
      {
        id: "m3",
        senderId: "user2",
        senderName: "Robert Chen",
        recipientId: user.id,
        content: "I've uploaded the latest probate trends document to the vault.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        read: false
      },
      
      // Conversation with Sarah
      {
        id: "m4",
        senderId: "user3",
        senderName: "Sarah Williams",
        recipientId: user.id,
        content: "Can we schedule a meeting to discuss the Connecticut analysis?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true
      },
      {
        id: "m5",
        senderId: user.id,
        senderName: user.name,
        recipientId: "user3",
        content: "Sure, how about tomorrow at 2pm?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
        read: true
      },
      {
        id: "m6",
        senderId: "user3",
        senderName: "Sarah Williams",
        recipientId: user.id,
        content: "That works for me. I'll send a calendar invite.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22), // 22 hours ago
        read: true
      },
    ];

    setMessages(sampleMessages);
  }, [user]);

  return (
    <MessagingContext.Provider
      value={{
        messages,
        conversations,
        activeConversation,
        unreadTotal,
        sendMessage,
        markAsRead,
        setActiveConversation
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error("useMessaging must be used within a MessagingProvider");
  }
  return context;
};
