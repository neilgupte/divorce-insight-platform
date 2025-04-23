
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import MessagingCenter from "@/components/messaging/MessagingCenter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ModelSwitcher } from "./ModelSwitcher";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { MainNavigationMenu } from "./MainNavigationMenu";
import { UserMenu } from "./UserMenu";

const MainLayout = () => {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, sidebarCollapsed, toggleSidebar, toggleCollapse } = useSidebarState();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const showMainSidebar = !location.pathname.startsWith('/labour-potential');

  return (
    <div className="flex h-screen overflow-hidden">
      {showMainSidebar && (
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white"
                  >
                    <span className="sr-only">Toggle Model Menu</span>
                  </Button>
                </div>
              )}
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sidebar-foreground lg:hidden ml-1"
                  onClick={() => toggleSidebar()}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <MainNavigationMenu 
              sidebarCollapsed={sidebarCollapsed}
              hasPermission={hasPermission}
              userRole={user.role}
            />

            <div className="border-t border-sidebar-border p-4">
              <UserMenu 
                user={user}
                sidebarCollapsed={sidebarCollapsed}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b bg-card/80 backdrop-blur-sm">
          <div className="flex h-14 items-center justify-between px-4">
            {showMainSidebar && (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => toggleSidebar()}
              >
                <Menu className="h-6 w-6" />
              </Button>
            )}

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
