
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

// Define the User interface with all required properties
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  permissions: string[];
  modules?: string[];
  status?: string;
  lastLogin?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample user data with modules property
const SAMPLE_USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "Administrator",
    avatar: "/placeholder.svg",
    permissions: ["*"],
    modules: ["realestate", "labour", "multivariate", "network"], // Admin has access to all modules
    status: "active",
    lastLogin: "2023-12-02 09:34 AM",
    createdAt: "2022-10-15",
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@example.com",
    role: "Manager",
    permissions: ["dashboard:view", "location:view", "reports:view"],
    modules: ["realestate", "labour"], // Manager has access to two modules
    status: "active",
    lastLogin: "2023-11-30 02:15 PM",
    createdAt: "2022-11-05",
  },
  {
    id: "3",
    name: "Analyst User",
    email: "analyst@example.com",
    role: "Analyst",
    permissions: ["dashboard:view", "location:view"],
    modules: ["realestate"], // Analyst has access to one module
    status: "active",
    lastLogin: "2023-11-28 10:22 AM",
    createdAt: "2023-01-15",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = SAMPLE_USERS.find(u => u.email === email);
    
    if (!foundUser) {
      setIsLoading(false);
      return false; // Return false for failed login
    }
    
    // In a real app, you would verify the password here
    
    setUser(foundUser);
    localStorage.setItem('user', JSON.stringify(foundUser));
    setIsLoading(false);
    return true; // Return true for successful login
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.role === 'superuser') return true;
    return user.permissions.includes(permission) || user.permissions.includes('all');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
