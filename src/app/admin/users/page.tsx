
'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { PlusCircle } from 'lucide-react';
import { UserTable } from "@/components/admin/UserTable";
import type { IUser } from "@/models/User";
import { fetcher } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { UserForm } from '@/components/admin/UserForm';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsersPage() {
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [view, setView] = useState<'table' | 'form'>('table');
  const { toast } = useToast();

  const { data, error, isLoading } = useSWR('/api/users', fetcher);
  
  const users: IUser[] = data?.users || [];

  const handleAddClick = () => {
    setEditingUser(null);
    setView('form');
  };

  const handleEditClick = (user: IUser) => {
    setEditingUser(user);
    setView('form');
  };

  const handleDelete = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete user.');
      toast({ title: 'Success', description: 'User deleted successfully.' });
      mutate('/api/users');
    } catch (error) {
      toast({ title: 'Error', description: 'Could not delete user.', variant: 'destructive' });
    }
  };

  const handleStatusToggle = async (user: IUser) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    try {
      const res = await fetch(`/api/users/${(user as any)._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(`Failed to ${newStatus === 'active' ? 'unblock' : 'block'} user.`);
      toast({ title: 'Success', description: `User has been ${newStatus}.` });
      mutate('/api/users');
    } catch (error) {
      toast({ title: 'Error', description: 'Could not update user status.', variant: 'destructive' });
    }
  };

  const handleSave = () => {
    setView('table');
    mutate('/api/users');
  };

  const handleCancel = () => {
    setView('table');
  };
  
  if (error) return <div>Failed to load users.</div>;

  return (
    <div className="space-y-6">
      {view === 'table' ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
            <Button onClick={handleAddClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
          {isLoading ? (
            <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <UserTable 
              users={users} 
              onEdit={handleEditClick}
              onDelete={handleDelete}
              onStatusToggle={handleStatusToggle}
            />
          )}
        </>
      ) : (
        <>
           <div>
            <h1 className="text-3xl font-bold tracking-tight">{editingUser ? 'Edit User' : 'Add New User'}</h1>
            <p className="text-muted-foreground">
              {editingUser ? 'Update the details of the user.' : 'Fill in the details to create a new user.'}
            </p>
          </div>
          <UserForm user={editingUser} onSave={handleSave} onCancel={handleCancel} />
        </>
      )}
    </div>
  );
}
