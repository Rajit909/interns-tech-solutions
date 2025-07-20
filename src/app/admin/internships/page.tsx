import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminInternshipsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Manage Internships</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Internship Listings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Internship management interface will be here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
