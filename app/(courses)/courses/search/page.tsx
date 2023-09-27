import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface SearchPageProps {
    searchParams: {
      title: string;
      categoryId: string;
    }
  };
  
  const SearchPage = async ({
    searchParams
  }: SearchPageProps) => {
    const { userId } = auth();
  
    if (!userId) {
      return redirect("/");
    }
  
    const categories = await db.category.findMany({
      orderBy: {
        name: "asc"
      }
    });
  
    const courses = await db.course.findMany({
    });

    if (!courses) {
        return (
            <div>
                <h1>No courses found</h1>
            </div>
        )}
        
    return (
        <div className="p-6">
            <h1>Courses</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {courses.map((course) => (
                        <div key={course.id}>
                            <h2>{course.title}</h2>
                        </div>
                    ))}
                </div>
            </div>
        );
}

export default SearchPage;