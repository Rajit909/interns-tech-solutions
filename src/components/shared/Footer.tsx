import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Logo } from "./Logo"

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="space-y-4 md:col-span-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Unlock your potential with our curated courses and internships.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-5">
            <div>
              <h4 className="mb-3 font-semibold">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/#courses" className="text-muted-foreground hover:text-primary">Courses</Link></li>
                <li><Link href="/#internships" className="text-muted-foreground hover:text-primary">Internships</Link></li>
                <li><Link href="/#about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Help Center</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="space-y-4 md:col-span-3">
            <h4 className="font-semibold">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">Join our newsletter for the latest updates.</p>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" type="email" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Intern Tech Solutions. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
