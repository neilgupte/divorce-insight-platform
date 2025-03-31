
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter, Download, Search, AlertTriangle, FileText, MessageSquare, User, Trash, Edit, Eye } from "lucide-react";

// Sample audit log data
const sampleAuditLogs = [
  {
    id: "1",
    timestamp: new Date(2023, 6, 12, 14, 30),
    user: "Admin User",
    userEmail: "admin@example.com",
    action: "login",
    details: "Successful login",
    ipAddress: "192.168.1.1",
    severity: "info"
  },
  {
    id: "2",
    timestamp: new Date(2023, 6, 12, 15, 45),
    user: "Admin User",
    userEmail: "admin@example.com",
    action: "view",
    details: "Viewed sensitive document #XCV-2023-0472",
    ipAddress: "192.168.1.1",
    severity: "info"
  },
  {
    id: "3",
    timestamp: new Date(2023, 6, 12, 16, 20),
    user: "Regular User",
    userEmail: "user@example.com",
    action: "generate",
    details: "Generated report for California divorce statistics Q2 2023",
    ipAddress: "192.168.1.42",
    severity: "info"
  },
  {
    id: "4",
    timestamp: new Date(2023, 6, 13, 9, 15),
    user: "Regular User",
    userEmail: "user@example.com",
    action: "failed",
    details: "Failed to access user management (insufficient permissions)",
    ipAddress: "192.168.1.42",
    severity: "warning"
  },
  {
    id: "5",
    timestamp: new Date(2023, 6, 13, 11, 30),
    user: "Admin User",
    userEmail: "admin@example.com",
    action: "delete",
    details: "Deleted document #XCV-2023-0468",
    ipAddress: "192.168.1.1",
    severity: "critical"
  },
  {
    id: "6",
    timestamp: new Date(2023, 6, 14, 10, 0),
    user: "Admin User",
    userEmail: "admin@example.com",
    action: "update",
    details: "Modified user permissions for user@example.com",
    ipAddress: "192.168.1.1",
    severity: "important"
  }
];

const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string>("all-users");
  const [selectedAction, setSelectedAction] = useState<string>("all-actions");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Filter logs based on search term, selected user, action, and date
  const filteredLogs = sampleAuditLogs.filter(log => {
    const matchesSearch = 
      searchTerm === "" || 
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUser = 
      selectedUser === "all-users" || 
      log.userEmail === selectedUser;
    
    const matchesAction = 
      selectedAction === "all-actions" || 
      log.action === selectedAction;
    
    const matchesDate = 
      !selectedDate || 
      (log.timestamp.getDate() === selectedDate.getDate() &&
       log.timestamp.getMonth() === selectedDate.getMonth() &&
       log.timestamp.getFullYear() === selectedDate.getFullYear());
    
    return matchesSearch && matchesUser && matchesAction && matchesDate;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case "login": return <User className="h-4 w-4" />;
      case "view": return <Eye className="h-4 w-4" />;
      case "generate": return <FileText className="h-4 w-4" />;
      case "failed": return <AlertTriangle className="h-4 w-4" />;
      case "delete": return <Trash className="h-4 w-4" />;
      case "update": return <Edit className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "info": return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "warning": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "critical": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "important": return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  // Extract unique users and actions for filters
  const uniqueUsers = Array.from(new Set(sampleAuditLogs.map(log => log.userEmail)));
  const uniqueActions = Array.from(new Set(sampleAuditLogs.map(log => log.action)));

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedUser("all-users");
    setSelectedAction("all-actions");
    setSelectedDate(undefined);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Audit & Activity Logs</h1>
        <p className="text-muted-foreground">Track and monitor user activity for compliance and security</p>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Narrow down log entries by user, action, date, or search term
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search in logs..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">User</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="All users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-users">All users</SelectItem>
                  {uniqueUsers.map(user => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Action</label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-actions">All actions</SelectItem>
                  {uniqueActions.map(action => (
                    <SelectItem key={action} value={action}>
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between">
            <Button variant="outline" onClick={resetFilters} className="gap-2">
              <Filter className="h-4 w-4" />
              Reset filters
            </Button>
            
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export logs
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            {filteredLogs.length} log entries found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="hidden md:table-cell">IP Address</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No log entries match your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        <div>{format(log.timestamp, "yyyy-MM-dd")}</div>
                        <div className="text-xs text-muted-foreground">{format(log.timestamp, "HH:mm:ss")}</div>
                      </TableCell>
                      <TableCell>
                        <div>{log.user}</div>
                        <div className="text-xs text-muted-foreground">{log.userEmail}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className="flex items-center gap-1 capitalize"
                        >
                          {getActionIcon(log.action)}
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs">
                        {log.ipAddress}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <span className="flex-grow">{log.details}</span>
                          {log.severity !== "info" && (
                            <Badge className={getSeverityColor(log.severity)}>
                              {log.severity}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
