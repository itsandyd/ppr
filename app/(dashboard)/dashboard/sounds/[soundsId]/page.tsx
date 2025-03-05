import { IconBadge } from "@/components/courses/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import { Banner } from "@/components/courses/banner";
import SoundsTitleForm from "./components/SoundsTitleForm";
import SoundsDescriptionForm from "./components/SoundsDescriptionForm";
import SoundsImageForm from "./components/SoundsImageForm";
import SoundsCategoryForm from "./components/SoundsCategoryForm";
import SoundsPriceForm from "./components/SoundsPriceForm";


const SoundsIdPage = async ({
    params,
}: {
    params: {
        soundsId: string;
    };
}) => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const sounds = await db.sounds.findUnique({
        where: {
            id: params.soundsId,
            userId,
        },
    });

    // If not found by ID, try by slug
    if (!sounds) {
        const soundsBySlug = await db.sounds.findFirst({
            where: {
                slug: params.soundsId,
                userId,
            },
        });
        
        if (!soundsBySlug) {
            return redirect("/");
        }
        
        return redirect(`/dashboard/sounds/${soundsBySlug.id}`);
    }

    const categories = await db.soundsCategory.findMany({
        orderBy: {
            name: "asc",
        }
    });

    const requiredFields = [
        sounds.name,
        sounds.description,
        sounds.image,
        // plugin.price,
        sounds.categoryId,
        // course.courseChapter.some(chapter => chapter.title),
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`

    const isComplete = requiredFields.every(Boolean);

    return ( 
        <>
        {/* {!plugin.isPublished && (
        <Banner
          label="This Plugin is unpublished. It will not be visible."
        />
      )} */}
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">
                        Sounds Setup
                    </h1>
                <span className="text-sm text-slate-700">
                        Complete all the fields {completionText}
                    </span>
                </div>
                {/* <Actions
                    disabled={!isComplete}
                    courseId={params.courseId}
                    isPublished={course.isPublished}
                /> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} variant="success" />
                        <h2 className="text-xl font-bold">
                            Customize your plugin
                        </h2>
                    </div>
                    {/* <SoundsTitleForm 
                        initialData={sounds}
                        soundsId={sounds.id}
                    />
                    <SoundsDescriptionForm 
                        initialData={sounds}
                        soundsId={sounds.id}
                    />
                    <SoundsImageForm 
                        initialData={sounds}
                        soundsId={sounds.id}
                    />
                    <SoundsCategoryForm 
                        initialData={sounds}
                        soundsId={sounds.id}
                        options={categories.map((category) => ({
                            label: category.name,
                            value: category.id,
                        }))}
                    /> */}
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={CircleDollarSign} />
                            <h2 className="text-xl font-bold">
                                Price your plugin
                            </h2>
                        </div>
                        {/* <SoundsPriceForm 
                            initialData={sounds}
                            soundsId={sounds.id}
                        /> */}
                    </div>
                    <div>
                        {/* <div className="flex items-center gap-x-2">
                            <IconBadge icon={File} />
                            <h2 className="text-xl font-bold">
                                Resources & Attachments
                            </h2>
                        </div> */}
                        {/* <AttachmentForm 
                            initialData={course}
                            courseId={course.id}
                        /> */}
                    </div>
                </div>
            </div>
        </div>
        </>
     );
}

export default SoundsIdPage;