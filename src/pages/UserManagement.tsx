import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { USERS, USER_ACTIVITY } from "@/data/mockData";
import {
  MoreHorizontal,
  Search,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  Clock,
  UserCog,
  ShieldAlert,
  KeyRound,
  Mail,
  Upload,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  status: string;
  lastLogin: string;
  createdAt: string;
}

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

const UserManagement = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(USERS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(USER_ACTIVITY);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAddUserDialog, setShowAddUserDialog] = useState<boolean>(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user",
    permissions: [] as string[],
  });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const newUserId = `user-${Date.now().toString().slice(-4)}`;
    
    const user: User = {
      id: newUserId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      permissions: newUser.permissions.length > 0 ? newUser.permissions : 
                  newUser.role === "superuser" ? ["all"] : ["dashboard:view"],
      status: "active",
      lastLogin: "Never",
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setUsers([...users, user]);
    
    const newActivity: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: currentUser?.id || "",
      userName: currentUser?.name || "System",
      action: "User Creation",
      details: `Created new user '${user.email}'`,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
    
    setActivityLogs([newActivity, ...activityLogs]);
    
    setShowAddUserDialog(false);
    setNewUser({
      name: "",
      email: "",
      role: "user",
      permissions: [],
    });
    
    toast({
      title: "User created",
      description: `${user.name} has been added as a ${user.role}`,
    });
  };

  const openEditUserDialog = (user: User) => {
    setEditingUser(user);
    setShowEditUserDialog(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    
    const updatedUsers = users.map(user => 
      user.id === editingUser.id ? editingUser : user
    );
    
    setUsers(updatedUsers);
    
    const newActivity: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: currentUser?.id || "",
      userName: currentUser?.name || "System",
      action: "User Update",
      details: `Updated user '${editingUser.email}'`,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
    
    setActivityLogs([newActivity, ...activityLogs]);
    
    setShowEditUserDialog(false);
    setEditingUser(null);
    
    toast({
      title: "User updated",
      description: `${editingUser.name}'s information has been updated`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    if (!userToDelete) return;
    
    setUsers(users.filter(user => user.id !== userId));
    
    const newActivity: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: currentUser?.id || "",
      userName: currentUser?.name || "System",
      action: "User Deletion",
      details: `Deleted user '${userToDelete.email}'`,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
    
    setActivityLogs([newActivity, ...activityLogs]);
    
    toast({
      title: "User deleted",
      description: `${userToDelete.name} has been removed from the system`,
    });
  };

  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === "active" ? "inactive" : "active";
        
        const newActivity: ActivityLog = {
          id: `log-${Date.now()}`,
          userId: currentUser?.id || "",
          userName: currentUser?.name || "System",
          action: "Status Change",
          details: `Changed ${user.email}'s status to ${newStatus}`,
          timestamp: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
        };
        
        setActivityLogs([newActivity, ...activityLogs]);
        
        return { ...user, status: newStatus };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    const user = users.find(u => u.id === userId);
    const newStatus = user?.status === "active" ? "inactive" : "active";
    
    toast({
      title: "Status updated",
      description: `${user?.name}'s status has been set to ${newStatus}`,
    });
  };

  const togglePermission = (permission: string) => {
    if (editingUser) {
      if (editingUser.permissions.includes(permission)) {
        setEditingUser({
          ...editingUser,
          permissions: editingUser.permissions.filter(p => p !== permission),
        });
      } else {
        setEditingUser({
          ...editingUser,
          permissions: [...editingUser.permissions, permission],
        });
      }
    } else {
      if (newUser.permissions.includes(permission)) {
        setNewUser({
          ...newUser,
          permissions: newUser.permissions.filter(p => p !== permission),
        });
      } else {
        setNewUser({
          ...newUser,
          permissions: [...newUser.permissions, permission],
        });
      }
    }
  };

  const permissions = [
    { id: "dashboard:view", label: "View Dashboard" },
    { id: "location:view", label: "Access Location Analyzer" },
    { id: "reports:view", label: "Access Report Generator" },
    { id: "reports:create", label: "Create Reports" },
    { id: "documents:view", label: "View Document Vault" },
    { id: "documents:upload", label: "Upload Documents" },
    { id: "assistant:view", label: "Access AI Assistant" },
  ];

  const adminPermissions = [
    { id: "users:manage", label: "Manage Users" },
    { id: "settings:manage", label: "Manage Settings" },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users and permissions within the platform
          </p>
        </div>
        <Button onClick={() => setShowAddUserDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Platform Users</CardTitle>
                  <CardDescription>
                    View and manage user accounts and permissions
                  </CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.role === "superuser" ? "destructive" : "outline"}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === "active" ? "outline" : "secondary"}
                            className={
                              user.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
                            }
                          >
                            {user.status === "active" ? (
                              <Check className="mr-1 h-3 w-3" />
                            ) : (
                              <X className="mr-1 h-3 w-3" />
                            )}
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>{user.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openEditUserDialog(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                                {user.status === "active" ? (
                                  <>
                                    <X className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Log</CardTitle>
              <CardDescription>
                Track user actions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {log.timestamp}
                      </TableCell>
                      <TableCell>{log.userName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {log.action === "Login" && <KeyRound className="mr-1 h-3 w-3" />}
                          {log.action === "User Creation" && <UserPlus className="mr-1 h-3 w-3" />}
                          {log.action === "User Update" && <UserCog className="mr-1 h-3 w-3" />}
                          {log.action === "Document Upload" && <Upload className="mr-1 h-3 w-3" />}
                          {log.action === "Report Access" && <Eye className="mr-1 h-3 w-3" />}
                          {log.action === "Status Change" && <ShieldAlert className="mr-1 h-3 w-3" />}
                          {log.action === "User Deletion" && <Trash2 className="mr-1 h-3 w-3" />}
                          {log.action === "Location Analysis" && <Search className="mr-1 h-3 w-3" />}
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account and set permissions
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newUser.role}
                onValueChange={(value) => setNewUser({...newUser, role: value})}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="superuser">Superuser</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Superusers have access to all features including user management
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="rounded-md border p-4">
                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-medium">General Permissions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`perm-${permission.id}`} 
                          checked={newUser.permissions.includes(permission.id) || newUser.role === "superuser"}
                          disabled={newUser.role === "superuser"}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <label
                          htmlFor={`perm-${permission.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="mb-2 text-sm font-medium">Administrative Permissions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {adminPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`perm-${permission.id}`} 
                          checked={newUser.permissions.includes(permission.id) || newUser.role === "superuser"}
                          disabled={newUser.role === "superuser"}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <label
                          htmlFor={`perm-${permission.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {newUser.role === "superuser" && (
                <p className="text-xs text-muted-foreground">
                  Superusers automatically have all permissions
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <Label>Invitation Email</Label>
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground">
                  An invitation email will be sent to this user with instructions to set up their password
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Modify user details and permissions
            </DialogDescription>
          </DialogHeader>
          
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input 
                    id="edit-name" 
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input 
                    id="edit-email" 
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={editingUser.role}
                  onValueChange={(value) => setEditingUser({...editingUser, role: value})}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="superuser">Superuser</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="rounded-md border p-4">
                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-medium">General Permissions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`edit-perm-${permission.id}`} 
                            checked={editingUser.permissions.includes(permission.id) || editingUser.role === "superuser"}
                            disabled={editingUser.role === "superuser"}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <label
                            htmlFor={`edit-perm-${permission.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="mb-2 text-sm font-medium">Administrative Permissions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {adminPermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`edit-perm-${permission.id}`} 
                            checked={editingUser.permissions.includes(permission.id) || editingUser.role === "superuser"}
                            disabled={editingUser.role === "superuser"}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <label
                            htmlFor={`edit-perm-${permission.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={editingUser.status}
                  onValueChange={(value) => setEditingUser({...editingUser, status: value})}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
