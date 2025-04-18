
import { useState } from "react";
import { 
  User, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail,
  Building,
  UserPlus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data for users
  const [users] = useState([
    { 
      id: 1, 
      name: "John Smith", 
      email: "john@acmecorp.com", 
      company: "Acme Corporation",
      role: "Admin", 
      lastActive: "Today", 
      status: "active" 
    },
    { 
      id: 2, 
      name: "Sarah Johnson", 
      email: "sarah@acmecorp.com", 
      company: "Acme Corporation",
      role: "Manager", 
      lastActive: "Yesterday", 
      status: "active" 
    },
    { 
      id: 3, 
      name: "Mike Williams", 
      email: "mike@acmecorp.com", 
      company: "Acme Corporation",
      role: "User", 
      lastActive: "3 days ago", 
      status: "pending" 
    },
    { 
      id: 4, 
      name: "Lisa Brown", 
      email: "lisa@acmecorp.com", 
      company: "Acme Corporation",
      role: "User", 
      lastActive: "1 week ago", 
      status: "suspended" 
    },
    { 
      id: 5, 
      name: "David Garcia", 
      email: "david@techgiant.com", 
      company: "TechGiant Inc",
      role: "Admin", 
      lastActive: "Today", 
      status: "active" 
    },
    { 
      id: 6, 
      name: "Emma Wilson", 
      email: "emma@techgiant.com", 
      company: "TechGiant Inc",
      role: "User", 
      lastActive: "2 days ago", 
      status: "active" 
    },
    { 
      id: 7, 
      name: "Robert Lee", 
      email: "robert@smallbusiness.com", 
      company: "Small Business LLC",
      role: "Admin", 
      lastActive: "Today", 
      status: "active" 
    },
  ]);

  // Filter users based on search query and status filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage users across all companies
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> Invite User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage platform users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <User className="h-10 w-10 mx-auto text-muted-foreground/30" />
                      <p className="mt-2 text-muted-foreground">No users found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          {user.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                          {user.company}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.lastActive}
                      </TableCell>
                      <TableCell>
                        {user.status === "active" && (
                          <Badge className="bg-green-600">Active</Badge>
                        )}
                        {user.status === "pending" && (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                        {user.status === "suspended" && (
                          <Badge variant="destructive">Suspended</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuItem>Edit Access</DropdownMenuItem>
                            {user.status === "active" ? (
                              <DropdownMenuItem className="text-destructive">
                                Suspend User
                              </DropdownMenuItem>
                            ) : user.status === "suspended" ? (
                              <DropdownMenuItem>
                                Activate User
                              </DropdownMenuItem>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
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

export default Users;
