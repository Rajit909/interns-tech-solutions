import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookMarked, Briefcase, Users, BadgeDollarSign } from "lucide-react";

const stats = [
    { title: "Total Users", value: "1,250", icon: Users, change: "+15.2% from last month" },
    { title: "Active Courses", value: "85", icon: BookMarked, change: "+5 from last month" },
    { title: "Active Internships", value: "32", icon: Briefcase, change: "+2 from last month" },
    { title: "Subscriptions", value: "$12,450", icon: BadgeDollarSign, change: "+8.1% from last month" },
];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-muted-foreground">Activity feed will be displayed here.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Platform Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Charts and graphs will be displayed here.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
