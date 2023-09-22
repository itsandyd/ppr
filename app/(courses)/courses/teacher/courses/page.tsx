import { Button } from "@/components/ui/button";
import Link from "next/link";

const TeacherCoursesPage = () => {
    return ( 
        <div className="p-6">
            <Link href="/courses/teacher/create">
                <Button>New Course</Button>
            </Link>
        </div>
     );
}

export default TeacherCoursesPage;