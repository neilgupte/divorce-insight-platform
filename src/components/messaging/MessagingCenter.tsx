
import React, { useState } from "react";
import { Mail, MailPlus, Send, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMessaging, Conversation, Message } from "@/contexts/MessagingContext";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

const MessagingCenter = () => {
  const { user } = useAuth();
  const { 
    messages, 
    conversations, 
    activeConversation, 
    unreadTotal, 
    sendMessage, 
    markAsRead, 
    setActiveConversation 
  } = useMessaging();
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const activeMessages = messages.filter(
    m => activeConversation && (
      (m.senderId === activeConversation && m.recipientId === user?.id) ||
      (m.senderId === user?.id && m.recipientId === activeConversation)
    )
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const activeUser = conversations.find(c => c.userId === activeConversation);

  // Handle opening a conversation
  const handleOpenConversation = (userId: string) => {
    setActiveConversation(userId);
    markAsRead(userId);
  };

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || !activeUser) return;

    sendMessage(activeConversation, activeUser.userName, newMessage);
    setNewMessage("");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Mail className="h-5 w-5" />
            {unreadTotal > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
              >
                {unreadTotal > 9 ? "9+" : unreadTotal}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] p-0">
          <DialogHeader className="px-4 py-2 border-b">
            <DialogTitle>Messages</DialogTitle>
          </DialogHeader>
          <div className="flex h-[500px]">
            {/* Conversations List */}
            <div className="w-1/3 border-r overflow-hidden flex flex-col">
              <ScrollArea className="flex-1">
                {conversations.length > 0 ? (
                  <div className="divide-y">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.userId}
                        className={`p-3 hover:bg-muted cursor-pointer transition-colors ${
                          activeConversation === conversation.userId ? "bg-muted" : ""
                        }`}
                        onClick={() => handleOpenConversation(conversation.userId)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {conversation.userName.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-2">
                              <p className="font-medium truncate">{conversation.userName}</p>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDistanceToNow(conversation.timestamp, { addSuffix: true })}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.lastMessage}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <Badge variant="default" className="ml-2">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No conversations yet
                  </div>
                )}
              </ScrollArea>
              <div className="p-3 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  <MailPlus className="h-4 w-4 mr-2" />
                  New Message
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="w-2/3 flex flex-col">
              {activeConversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="px-4 py-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {activeUser?.userName.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{activeUser?.userName}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveConversation(null)}
                      className="md:hidden"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {activeMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}
                        >
                          <div className="flex items-start space-x-2 max-w-[80%]">
                            {message.senderId !== user?.id && (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {message.senderName.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`rounded-lg px-3 py-2 ${
                                message.senderId === user?.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <div className="mt-1 text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-3 border-t">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button 
                        type="submit" 
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <User className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Conversation</h3>
                  <p className="text-muted-foreground max-w-xs">
                    Choose a conversation from the list to view messages or start a new conversation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MessagingCenter;
