"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { IconType } from "react-icons";

interface TypeItem {
    label: string;
    icon?: IconType;
    value?: string;
}

export const PluginTypeItem = ({
    label,
    icon,
    value
}: TypeItem) => {

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentTypeId = searchParams?.get("pluginTypeId");

    const currentTitle = searchParams?.get("title");

    const isSelected = currentTypeId === value;

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname || '',
            query: {
                title: currentTitle ?? '',
                pluginTypeId: value || '',
            }
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    }

    return ( 
        <Button 
            onClick={onClick}
            variant="ghost"
            className={cn("py-2 px-3 text-sm border border-slate-200 rounded-small flex items-center gap-x-1 hover:border-sky-700 transition", 
        )}
            type="button"
        >
            <div className="truncate">
                {label}
            </div>
        </Button>
     );
}