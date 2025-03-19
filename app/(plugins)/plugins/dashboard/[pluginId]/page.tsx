import { IconBadge } from "@/components/courses/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { CircleDollarSign, File, LayoutDashboard, ListChecks, Music2, Video, FileText } from "lucide-react";
import { redirect } from "next/navigation";
import { Banner } from "@/components/courses/banner";
import { PluginCategoryForm } from "@/app/(dashboard)/dashboard/plugins/[pluginId]/components/PluginCategoryForm";
import PluginTitleForm from "@/app/(dashboard)/dashboard/plugins/[pluginId]/components/PluginTitleForm";
import PluginDescriptionForm from "@/app/(dashboard)/dashboard/plugins/[pluginId]/components/PluginDescriptionForm";
import PluginImageForm from "@/app/(dashboard)/dashboard/plugins/[pluginId]/components/PluginImageForm";
import PluginPriceForm from "@/app/(dashboard)/dashboard/plugins/[pluginId]/components/PluginPriceForm";
import { AIPluginGenerator } from "./components/AIPluginGenerator";
import { Actions } from "./components/Actions";
import EnhanceDetailsButton from "./components/EnhanceDetailsButton";
import { PluginVideoForm } from "./components/PluginVideoForm";
import { PluginAudioForm } from "./components/PluginAudioForm";
import { PluginScriptForm } from "./components/PluginScriptForm";

interface PluginPageProps {
    params: {
        pluginId: string;
    };
}

const PluginIdPage = async ({ params }: PluginPageProps) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    // Get the current user to check if they're an admin
    const user = await db.user.findUnique({
        where: {
            id: userId,
        },
    });

    // Check if user is admin
    const isAdmin = !!user?.admin;

    // Query the plugin without user restrictions
    const plugin = await db.plugin.findFirst({
        where: {
            OR: [
                { id: params.pluginId },
                { slug: params.pluginId }
            ],
        },
    });

    // If no plugin is found, redirect
    if (!plugin) {
        return redirect("/");
    }

    // Authorization check:
    // Allow if user created the plugin OR user is admin
    const isCreator = plugin.userId === userId;
    
    if (!isAdmin) {
        return redirect("/plugins");
    }

    const effectCategories = (await db.pluginEffectCategory.findMany({
        orderBy: {
            name: "asc",
        }
    })).map(category => ({ label: category.name, value: category.id }));
    
    const instrumentCategories = (await db.pluginInstrumentCategory.findMany({
        orderBy: {
            name: "asc"
        }
    })).map(category => ({ label: category.name, value: category.id }));

    const studioToolCategories = (await db.pluginStudioToolCategory.findMany({
        orderBy: {
            name: "asc"
        }
    })).map(category => ({ label: category.name, value: category.id }));
    
    const types = (await db.pluginType.findMany({
        orderBy: {
            name: "asc",
        }
    })).map(type => ({ label: type.name, value: type.id }));

    const requiredFields = [
        plugin.name,
        plugin.description,
        plugin.image,
        plugin.categoryId,
        plugin.slug,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);
    const isPublished = plugin.description?.includes("[PUBLISHED]") || false;

    
    return ( 
        <>
        {!isPublished && (
        <Banner
          label="This Plugin is unpublished. It will not be visible."
        />
      )}
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
                <div className="flex items-center gap-x-2">
                    <AIPluginGenerator
                        pluginId={params.pluginId}
                        pluginTitle={plugin.name || ""}
                        pluginDescription={plugin.description || ""}
                    />
                    <Actions
                        disabled={!isComplete}
                        pluginId={params.pluginId}
                        isPublished={isPublished}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} variant="success" />
                            <h2 className="text-xl font-bold">
                                Customize your plugin
                            </h2>
                        </div>
                        <EnhanceDetailsButton
                            pluginTitle={plugin.name || ""}
                            pluginDescription={plugin.description || ""}
                        />
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
                        pluginId={plugin.id}
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
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={FileText} />
                            <h2 className="text-xl font-bold">
                                Video Script
                            </h2>
                        </div>
                        <PluginScriptForm 
                            initialData={plugin}
                            pluginId={plugin.id}
                        />
                    </div>
                    
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Video} />
                            <h2 className="text-xl font-bold">
                                Demo Video
                            </h2>
                        </div>
                        <PluginVideoForm 
                            initialData={plugin}
                            pluginId={plugin.id}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Music2} />
                            <h2 className="text-xl font-bold">
                                Audio Sample
                            </h2>
                        </div>
                        <PluginAudioForm 
                            initialData={plugin}
                            pluginId={plugin.id}
                        />
                    </div>
                </div>
            </div>
        </div>
        </>
     );
}

export default PluginIdPage;