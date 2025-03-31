
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export type NotificationType = "data" | "profile" | "report" | "ai" | "document" | "user";

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: NotificationType;
  read: boolean;
  link?: string;
}

export interface NotificationPreferences {
  frequency: "realtime" | "daily" | "off";
  categories: {
    data: boolean;
    profile: boolean;
    report: boolean;
    ai: boolean;
    document: boolean;
    user: boolean;
  };
  emailSummary: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
  clearAll: () => void;
}

const defaultPreferences: NotificationPreferences = {
  frequency: "realtime",
  categories: {
    data: true,
    profile: true,
    report: true,
    ai: true,
    document: true,
    user: true,
  },
  emailSummary: false,
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const { toast } = useToast();

  // Calculate unread count
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  // Add a new notification
  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show toast for real-time notifications if preference is set
    if (preferences.frequency === "realtime" && preferences.categories[notification.type as keyof typeof preferences.categories]) {
      toast({
        title: notification.title,
        description: notification.description,
        duration: 5000,
      });
    }
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Update notification preferences
  const updatePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }));
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  useEffect(() => {
    // Load sample notifications for demo purposes
    const sampleNotifications: Notification[] = [
      {
        id: "n1",
        title: "📍 Miami divorce rate rose 1.5% this quarter",
        description: "The divorce rate in Miami has increased by 1.5% this quarter, potentially indicating a new trend.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        type: "data",
        read: false,
      },
      {
        id: "n2",
        title: "Saved Profile Match",
        description: "Your 'Asset Protection Hotspots' profile now scores 8.8 in Dallas.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        type: "profile",
        read: false,
        link: "/location",
      },
      {
        id: "n3",
        title: "New Report Generated",
        description: "Marie generated a new report: 'Luxury Clusters - TX'",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        type: "report",
        read: true,
        link: "/reports",
      },
      {
        id: "n4",
        title: "AI Assistant Task Complete",
        description: "Lexi finished summarizing the uploaded document.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        type: "ai",
        read: true,
        link: "/assistant",
      },
      {
        id: "n5",
        title: "New Document Uploaded",
        description: "New PDF uploaded: 'Probate Trends - 2024'",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        type: "document",
        read: true,
        link: "/documents",
      },
    ];

    setNotifications(sampleNotifications);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        preferences,
        addNotification,
        markAsRead,
        markAllAsRead,
        updatePreferences,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
