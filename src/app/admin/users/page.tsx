'use client';

import useSWR from 'swr';
import { UserTable } from "@/components/admin/UserTable";
import type { IUser } from "@/models/User";
import { fetcher } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminUsersPage() {
  const { data, error, isLoading } = useSWR('/api/users', fetcher);
  
  const users: IUser[] = data?.users || [];

  if (error) return <div>Failed to load users.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
      {isLoading ? (
        <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <UserTable users={users} />
      )}
    </div>
  );
}
