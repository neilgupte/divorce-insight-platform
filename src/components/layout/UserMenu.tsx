
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

interface UserMenuProps {
  user: {
    name: string;
    avatar?: string;
    role: string;
  };
  sidebarCollapsed: boolean;
  onLogout: () => void;
}

export const UserMenu = ({ user, sidebarCollapsed, onLogout }: UserMenuProps) => {
  if (sidebarCollapsed) {
    return (
      <Avatar className="mx-auto h-8 w-8" title={user.name}>
        <AvatarImage src={user.avatar} />
        <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
          {user.name.substring(0, 2)}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
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
        <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
