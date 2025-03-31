import { useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Menu, X, LayoutDashboard, Map, FileText, FileBox, MessageCircle, Users, Settings } from "lucide-react";

const MainLayout = () => {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
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

  const filteredMenuItems = menuItems.filter(item => 
    hasPermission(item.permission) || user.role === 'superuser'
  );

  const filteredAdminMenuItems = adminMenuItems.filter(item => 
    hasPermission(item.permission) || user.role === 'superuser'
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-6">
            <h1 className="text-2xl font-bold text-white">DivorceIQ</h1>
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}

            {filteredAdminMenuItems.length > 0 && (
              <>
                <div className="my-4 border-t border-sidebar-border"></div>
                <div className="px-3 pb-2 text-xs font-semibold uppercase text-sidebar-foreground/60">
                  Administration
                </div>

                {filteredAdminMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </>
            )}
          </nav>

          <div className="border-t border-sidebar-border p-4">
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
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b bg-card/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            <div className="flex items-center space-x-4 ml-auto">
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
