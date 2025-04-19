
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/contexts/MessagingContext";
import {
  BarChart,
  Settings,
  User,
  FileText,
  Compass,
  Building,
  ScrollText,
  Brain,
  LogOut,
  Bell,
  Inbox,
  HelpCircle,
  Network,
  LayoutPanelLeft,
} from "lucide-react";

const MainLayout = () => {
  const { user, logout } = useAuth();
  const { unreadTotal } = useMessaging();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar navigation */}
      <nav className="flex-none w-64 border-r bg-background hidden md:block p-6">
        <div className="space-y-1">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col space-y-1">
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/location" className="flex items-center gap-2">
                    <Compass className="h-4 w-4" />
                    <span>Location Analyzer</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/luxury-locations" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>Luxury Locations</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/reports" className="flex items-center gap-2">
                    <ScrollText className="h-4 w-4" />
                    <span>Report Generator</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/documents" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Document Vault</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/assistant" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span>AI Assistant</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/invoices" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Invoices</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/labour-planning" className="flex items-center gap-2">
                    <LayoutPanelLeft className="h-4 w-4" />
                    <span>Labour Planning</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/network" className="flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    <span>Network Optimization</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 border-b bg-background">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="md:hidden mr-2"
              onClick={toggleSidebar}
            >
              <LayoutPanelLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">
              {location.pathname === "/dashboard"
                ? "Dashboard"
                : location.pathname === "/location"
                ? "Location Analyzer"
                : location.pathname === "/luxury-locations"
                ? "Luxury Locations"
                : location.pathname === "/reports"
                ? "Report Generator"
                : location.pathname === "/documents"
                ? "Document Vault"
                : location.pathname === "/assistant"
                ? "AI Assistant"
                : location.pathname === "/users"
                ? "User Management"
                : location.pathname === "/settings"
                ? "Settings"
                : location.pathname === "/audit-logs"
                ? "Audit Logs"
                : location.pathname === "/help"
                ? "Help & Support"
                : "Real Estate IQ"}
            </h1>
          </div>

          {/* User profile and settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user?.name} ({user?.role})
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/users">
                  <User className="mr-2 h-4 w-4" />
                  <span>User Management</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
