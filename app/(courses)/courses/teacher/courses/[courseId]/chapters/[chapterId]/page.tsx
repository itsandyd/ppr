import { IconBadge } from "@/components/courses/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { boolean } from "zod";
import ChapterTitleForm from "./components/chapter-title-form";

const ChapterIdPage = async ({
    params
 }: {
    params: {
        courseId: string;
        chapterId: string
    }
}) => {

    const { userId} = auth();

    if (!userId) {
        return redirect("/")
    }

    const chapter = await db.courseChapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId
        },
        include: {
            muxData: true,
        }
    })

    if (!chapter) {
        return redirect("/")
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;


    return (
        <div className="p-6">
            <div>
                <div>
                    <Link href={`/courses/teacher/courses/${params.courseId}`}>
                        <ArrowLeft />
                        Back to course setup
                    </Link>
                    <div>
                        <div>
                            <h1>Chapter Creation</h1>
                            <span className="text-sm text-slate-700">
                                Complete all fields {completionText}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 mt-16">
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <ChapterTitleForm 
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChapterIdPage