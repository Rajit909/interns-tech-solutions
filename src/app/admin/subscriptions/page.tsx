import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSubscriptionsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Manage Subscriptions</h1>
            <Card>
                <CardHeader>
                    <CardTitle>User Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Subscription management interface will be here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
