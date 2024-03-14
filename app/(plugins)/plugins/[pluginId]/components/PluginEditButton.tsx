"use client"

import { Button } from "@/components/ui/button";
import { WrenchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface PluginEditButtonProps {
    pluginId: string;
}

export const PluginEditButton = ({
    pluginId,
}: PluginEditButtonProps) => {
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/dashboard/plugins/${pluginId}`);
    };

    return (
        <Button
            size="sm"
            className="w-full md:w-auto"
            onClick={handleEdit}
            variant="outline"
        >
            <WrenchIcon className="w-4 h-4" />
            {/* Edit Plugin */}
        </Button>
    );
}