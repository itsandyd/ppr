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

    if (!categories) {
        return (
            <div>
                <h1>No courses found</h1>
            </div>
        )}
  
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
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">
                        Browse Courses
                    </h1>
                {/* <span className="text-sm text-slate-700">
                        Complete all the fields {}
                    </span> */}
                </div>
                <div>
                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                    {courses.map((course) => (
                        <div key={course.id}>
                            <h2>{course.title}</h2>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </div>

        );
}

export default SearchPage;