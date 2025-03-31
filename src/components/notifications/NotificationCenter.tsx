
import React from "react";
import { Bell, BellDot, Check, X, Settings, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNotifications, NotificationType } from "@/contexts/NotificationContext";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

// Icon mapping for notification types
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "data":
      return "📊";
    case "profile":
      return "📍";
    case "report":
      return "📑";
    case "ai":
      return "🤖";
    case "document":
      return "📄";
    case "user":
      return "👤";
    default:
      return "📣";
  }
};

const NotificationCenter = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearAll 
  } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <>
              <BellDot className="h-5 w-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            </>
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 md:w-96 p-0" 
        align="end"
        sideOffset={5}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold">Notifications</div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={markAllAsRead}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Mark all read
              </Button>
            )}
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        {notifications.length > 0 ? (
          <>
            <ScrollArea className="h-[350px]">
              <div className="flex flex-col divide-y">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-3 hover:bg-muted transition-colors cursor-pointer ${
                      !notification.read ? "bg-muted/50" : ""
                    }`}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-xl">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="font-medium text-sm truncate">{notification.title}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.description}
                        </p>
                        {notification.link && (
                          <Link 
                            to={notification.link}
                            className="text-xs text-primary mt-1 inline-block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View details
                          </Link>
                        )}
                      </div>
                      {!notification.read && (
                        <Badge 
                          variant="default" 
                          className="h-2 w-2 rounded-full p-0 self-center"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-2 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={clearAll}
              >
                Clear all
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Clock className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="font-medium mb-1">No notifications</h3>
            <p className="text-sm text-muted-foreground">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
