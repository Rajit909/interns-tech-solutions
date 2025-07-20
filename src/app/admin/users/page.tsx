import { UserTable } from "@/components/admin/UserTable";
import { users } from "@/lib/mockData";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
      <UserTable users={users} />
    </div>
  );
}
