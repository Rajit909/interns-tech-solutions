import { CourseCard } from "@/components/shared/CourseCard";
import { listings } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";

export default function SavedItemsPage() {
  const savedItems = listings.slice(2, 5); // Mocking saved items

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Saved Items</h1>
      
      {savedItems.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {savedItems.map((listing) => (
            <CourseCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-center">You haven't saved any items yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
