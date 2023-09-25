import { IconBadge } from "@/components/courses/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./components/title-form";
import DescriptionForm from "./components/description-form";
import ImageForm from "./components/image-form";
import CategoryForm from "./components/category-form";
import PriceForm from "./components/price-form";
import { AttachmentForm } from "./components/attachment-form";

const CourseIdPage = async ({
    params,
}: {
    params: {
        courseId: string;
    };
}) => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId,
        },
        include: {
            attachments: {
                orderBy: {
                    createdAt: "desc",
                }
            }
        }
    });

    if (!course) {
        return redirect("/");
    }

    const categories = await db.courseCategory.findMany({
        orderBy: {
            name: "asc",
        }
    });

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.courseCategoryId
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`

    return ( 
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">
                        Course Setup
                    </h1>
                <span className="text-sm text-slate-700">
                        Complete all the fields {completionText}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} variant="success" />
                        <h2 className="text-xl font-bold">
                            Customize your course
                        </h2>
                    </div>
                    <TitleForm 
                        initialData={course}
                        courseId={course.id}
                    />
                    <DescriptionForm 
                        initialData={course}
                        courseId={course.id}
                    />
                    <ImageForm 
                        initialData={course}
                        courseId={course.id}
                    />
                    <CategoryForm 
                        initialData={course}
                        courseId={course.id}
                        options={categories.map((category) => ({
                            label: category.name,
                            value: category.id,
                        }))}
                    />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge
                                icon={ListChecks}
                            />
                            <h2 className="text-xl font-bold">
                                Course chapters
                            </h2>
                        </div>
                        <div>
                            TODO: Chapters
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={CircleDollarSign} />
                            <h2 className="text-xl font-bold">
                                Sell your course
                            </h2>
                        </div>
                        <PriceForm 
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={File} />
                            <h2 className="text-xl font-bold">
                                Resources & Attachments
                            </h2>
                        </div>
                        <AttachmentForm 
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                </div>
            </div>
        </div>
     );
}

export default CourseIdPage;