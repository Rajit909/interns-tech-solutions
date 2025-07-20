import { AiRecommender } from "@/components/student/AiRecommender";
import { CourseCard } from "@/components/shared/CourseCard";
import { listings } from "@/lib/mockData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function StudentDashboardPage() {
    const enrolledCourses = listings.filter(l => l.type === 'Course').slice(0, 2);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, Student!</h1>
                <p className="text-muted-foreground">Here's what's happening today.</p>
            </div>

            <AiRecommender />
            
            <section>
                <h2 className="text-2xl font-semibold tracking-tight mb-4">My Courses</h2>
                {enrolledCourses.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {enrolledCourses.map((listing) => (
                            <CourseCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-muted-foreground">You are not enrolled in any courses yet.</p>
                        </CardContent>
                    </Card>
                )}
            </section>
        </div>
    );
}
