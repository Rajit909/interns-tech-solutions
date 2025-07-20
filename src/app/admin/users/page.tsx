import { UserTable } from "@/components/admin/UserTable";
import type { User } from "@/lib/types";

async function getUsers() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    return res.json();
  } catch (error) {
    console.error("Error loading users: ", error);
    return { users: [] };
  }
}

export default async function AdminUsersPage() {
  const { users } : { users: User[] } = await getUsers();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
      <UserTable users={users} />
    </div>
  );
}
