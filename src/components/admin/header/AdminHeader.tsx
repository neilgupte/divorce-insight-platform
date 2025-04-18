
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import MessagingCenter from "@/components/messaging/MessagingCenter";

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

export const AdminHeader = ({ toggleSidebar }: AdminHeaderProps) => {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
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
  );
};
