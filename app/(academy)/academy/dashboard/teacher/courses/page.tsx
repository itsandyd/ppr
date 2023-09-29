import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns"; 
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const TeacherCoursesPage = async () => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const courses = await db.course.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    if (!courses.length) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-3xl font-bold text-gray-900">No Courses</h1>
                <Link href="/academy/dashboard/teacher/create" className="p-6">
                    <Button>Create Course</Button>
                </Link>
            </div>
        );
    }
        
    return ( 
        <div className="p-6">
            <DataTable columns={columns} data={courses} />
        </div>
     );
}

export default TeacherCoursesPage;