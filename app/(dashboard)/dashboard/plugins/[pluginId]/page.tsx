import { IconBadge } from "@/components/courses/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import { Banner } from "@/components/courses/banner";
import PluginTitleForm from "./components/PluginTitleForm";
import PluginDescriptionForm from "./components/PluginDescriptionForm";
import PluginImageForm from "./components/PluginImageForm";
import PluginCategoryForm from "./components/PluginCategoryForm";
import PluginPriceForm from "./components/PluginPriceForm";
import PluginTypeForm from "./components/PluginTypeForm";


const PluginIdPage = async ({
    params,
}: {
    params: {
        pluginId: string;
    };
}) => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const plugin = await db.plugin.findUnique({
        where: {
            id: params.pluginId,
            userId,
        },
    });

    if (!plugin) {
        return redirect("/");
    }

    const effectCategories = (await db.pluginEffectCategory.findMany({
        orderBy: {
            name: "asc",
        }
    })).map(category => ({ label: category.name, value: category.id }));
    
    const instrumentCategories = (await db.pluginInstrumentCategory.findMany({
        orderBy: {
        }
    })).map(category => ({ label: category.name, value: category.id }));

    const studioToolCategories = (await db.pluginStudioToolCategory.findMany({
        orderBy: {
        }
    })).map(category => ({ label: category.name, value: category.id }));

    console.log(effectCategories)
    console.log(instrumentCategories)
    console.log(studioToolCategories)
    
    const types = (await db.pluginType.findMany({
        orderBy: {
            name: "asc",
        }
    })).map(type => ({ label: type.name, value: type.id }));

    const requiredFields = [
        plugin.name,
        plugin.description,
        plugin.image,
        // plugin.price,
        plugin.categoryId,
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
                        Plugin Setup
                    </h1>
                <span className="text-sm">
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
                    <PluginTitleForm 
                        initialData={plugin}
                        pluginId={plugin.id}
                    />
                    <PluginDescriptionForm 
                        initialData={plugin}
                        pluginId={plugin.id}
                    />
                    <PluginImageForm 
                        initialData={plugin}
                        pluginId={plugin.id}
                    />
                   <PluginCategoryForm
                        initialData={plugin}
                        pluginId={params.pluginId}
                        effectCategories={effectCategories}
                        instrumentCategories={instrumentCategories}
                        types={types}
                        studioToolCategories={studioToolCategories}
/>
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={CircleDollarSign} />
                            <h2 className="text-xl font-bold">
                                Price your plugin
                            </h2>
                        </div>
                        <PluginPriceForm 
                            initialData={plugin}
                            pluginId={plugin.id}
                        />
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

export default PluginIdPage;