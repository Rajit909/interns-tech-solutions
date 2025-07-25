
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage your notification preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="email-notifications" defaultChecked />
            <Label htmlFor="email-notifications">
              Receive email notifications for new user signups.
            </Label>
          </div>
           <div className="flex items-center space-x-2">
            <Checkbox id="security-alerts" defaultChecked />
            <Label htmlFor="security-alerts">
              Enable security alerts for your admin account.
            </Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Preferences</Button>
        </CardFooter>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Manage your API keys for third-party integrations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google-api-key">Google API Key</Label>
            <Input id="google-api-key" type="password" defaultValue="xxxxxxxxxxxx" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="stripe-api-key">Stripe API Key</Label>
            <Input id="stripe-api-key" type="password" defaultValue="xxxxxxxxxxxx" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Update API Keys</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
