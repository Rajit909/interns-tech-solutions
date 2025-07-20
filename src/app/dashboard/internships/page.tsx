import { CourseCard } from "@/components/shared/CourseCard";
import { listings } from "@/lib/mockData";

export default function InternshipsPage() {
    const internships = listings.filter(l => l.type === 'Internship');

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">All Internships</h1>
                <p className="text-muted-foreground">Find your next opportunity with our exclusive internships.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {internships.map((listing) => (
                    <CourseCard key={listing.id} listing={listing} />
                ))}
            </div>
        </div>
    );
}
