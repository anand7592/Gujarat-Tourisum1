import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { User } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Trash2, Plus, Pencil } from "lucide-react";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");

  // --- UNIFIED FORM STATE (Cleaner & Less Code) ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // One state object for both Create and Edit
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contactNo: "",
    address: "",
  });

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  // --- ACTIONS ---

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (err: unknown) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare Form for CREATING
  const openCreateDialog = () => {
    setEditingId(null); // Null means "Create Mode"
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      contactNo: "",
      address: "",
    });
    setIsDialogOpen(true);
  };

  // Prepare Form for EDITING
  const openEditDialog = (user: User) => {
    setEditingId(user._id); // ID exists means "Edit Mode"
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "", // Empty means "Don't change password"
      contactNo: user.contactNo,
      address: user.address,
    });
    setIsDialogOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      // 1. Basic Validation
      if (!formData.email || !formData.firstName || !formData.address) {
        alert("Please fill in required fields (Name, Email, Address).");
        return;
      }

      // 2. Password Validation (Required only for Create)
      if (!editingId && !formData.password) {
        alert("Password is required for new users.");
        return;
      }

      if (editingId) {
        // --- UPDATE MODE ---
        // Filter out empty password so we don't overwrite it with ""
        const payload = { ...formData };
        if (!payload.password) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          delete (payload as any).password;
        }

        const { data } = await api.put(`/users/${editingId}`, payload);
        
        // Update list immediately
        setUsers((prev) => prev.map((u) => (u._id === editingId ? data : u)));
      } else {
        // --- CREATE MODE ---
        const { data } = await api.post("/users", formData);
        setUsers((prev) => [...prev, data]);
      }

      setIsDialogOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers((users) => users.filter((u) => u._id !== userId));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  // --- RENDER ---

  if (!currentUser?.isAdmin) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            Only Administrators can manage users.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus size={16} /> Add User
        </Button>
      </div>

      {/* SHARED DIALOG (Handles both Create & Edit) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>
              {editingId 
                ? "Update details. Leave password blank to keep current one." 
                : "Create a new account manually."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fname">First Name</Label>
                <Input
                  id="fname"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lname">Last Name</Label>
                <Input
                  id="lname"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pass">
                {editingId ? "New Password (Optional)" : "Password"}
              </Label>
              <Input
                id="pass"
                type="password"
                placeholder={editingId ? "Leave blank to keep current" : ""}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact">Contact No</Label>
              <Input
                id="contact"
                value={formData.contactNo}
                onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSaveUser}>
              {editingId ? "Save Changes" : "Create Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* USER LIST */}
      <Card>
        <CardHeader>
          <CardTitle>All Registered Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact No</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Edit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell className="font-medium">
                      {u.firstName} {u.lastName}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.contactNo}</TableCell>
                    <TableCell>{u.address}</TableCell>
                    <TableCell>
                      {u.isAdmin ? (
                        <Badge className="bg-blue-600">Admin</Badge>
                      ) : (
                        <Badge variant="secondary">User</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(u)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil size={16} />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      {currentUser?._id !== u._id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete <strong>{u.firstName}</strong>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeleteUser(u._id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;