
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface AdminUserProfileProps {
  sidebarCollapsed: boolean;
}

export const AdminUserProfile = ({ sidebarCollapsed }: AdminUserProfileProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="absolute bottom-4 left-0 right-0 px-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start px-2 text-white hover:bg-purple-800/50">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium">{user?.name || "Admin User"}</span>
                <span className="text-xs text-purple-200">{user?.role || "Administrator"}</span>
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
