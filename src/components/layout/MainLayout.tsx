import { useState } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Menu, X, LayoutDashboard, Map, FileText, FileBox, MessageCircle, Users, Settings, Activity, HelpCircle, ChevronLeft, ChevronRight, Brain, MapPin } from "lucide-react";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import MessagingCenter from "@/components/messaging/MessagingCenter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ModelSwitcher } from "./ModelSwitcher";
import { models } from "./ModelSwitcher";

const MainLayout = () => {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      permission: "dashboard:view"
    },
    {
      name: "Location Analyzer",
      icon: Map,
      path: "/location",
      permission: "location:view"
    },
    {
      name: "Report Generator",
      icon: FileText,
      path: "/reports",
      permission: "reports:view"
    },
    {
      name: "Document Vault",
      icon: FileBox,
      path: "/documents",
      permission: "documents:view"
    },
    {
      name: "AI Assistant",
      icon: MessageCircle,
      path: "/assistant",
      permission: "assistant:view"
    },
    {
      name: "Audit Logs",
      icon: Activity,
      path: "/audit-logs",
      permission: "logs:view"
    }
  ];

  const adminMenuItems = [
    {
      name: "User Management",
      icon: Users,
      path: "/users",
      permission: "users:manage"
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
      permission: "settings:manage"
    }
  ];

  const supportMenuItem = {
    name: "Help & Support",
    icon: HelpCircle,
    path: "/help",
    permission: ""
  };

  const filteredMenuItems = menuItems.filter(item => 
    hasPermission(item.permission) || user.role === 'superuser'
  );

  const filteredAdminMenuItems = adminMenuItems.filter(item => 
    hasPermission(item.permission) || user.role === 'superuser'
  );

  const labourPlanningMenuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/labour-planning",
      permission: ""
    },
    {
      name: "Reports",
      icon: FileText,
      path: "/labour-planning/reports",
      permission: ""
    },
    {
      name: "Labour Planning",
      icon: Users,
      path: "/labour-planning/schedule",
      permission: ""
    },
    {
      name: "Locations",
      icon: MapPin,
      path: "/labour-planning/locations",
      permission: ""
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/labour-planning/settings",
      permission: ""
    }
  ];

  const activeModule = models.find(model => 
    location.pathname.startsWith(model.path)
  )?.id;

  const currentMenuItems = activeModule === 'labour-planning' 
    ? labourPlanningMenuItems 
    : filteredMenuItems;

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={cn(
          "bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-2 py-4">
            {!sidebarCollapsed ? (
              <div className="flex-1">
                <ModelSwitcher />
              </div>
            ) : (
              <div className="w-full px-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white"
                    >
                      <Brain className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[300px] p-3"
                    sideOffset={8}
                  >
                    <div className="grid gap-3">
                      
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground"
                onClick={toggleCollapse}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground lg:hidden ml-1"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-2">
            {currentMenuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            ))}

            {filteredAdminMenuItems.length > 0 && (
              <>
                <div className="my-2 border-t border-sidebar-border"></div>
                {!sidebarCollapsed && (
                  <div className="px-3 pb-2 text-xs font-semibold uppercase text-sidebar-foreground/60">
                    Administration
                  </div>
                )}

                {filteredAdminMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                ))}
              </>
            )}
            
            <div className="my-2 border-t border-sidebar-border"></div>
            <Link
              to={supportMenuItem.path}
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              title={sidebarCollapsed ? supportMenuItem.name : undefined}
            >
              <supportMenuItem.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{supportMenuItem.name}</span>}
            </Link>
          </nav>

          <div className="border-t border-sidebar-border p-4">
            {!sidebarCollapsed ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start px-2 text-sidebar-foreground">
                    <Avatar className="mr-2 h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                        {user.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs opacity-70">{user.role}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Avatar className="mx-auto h-8 w-8" title={user.name}>
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                  {user.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b bg-card/80 backdrop-blur-sm">
          <div className="flex h-14 items-center justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </Button>

            <div className="flex items-center space-x-2 ml-auto">
              <ThemeToggle />
              <NotificationCenter />
              <MessagingCenter />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
