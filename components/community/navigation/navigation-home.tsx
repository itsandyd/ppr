"use client"

import { Home } from "lucide-react";

import { ActionTooltip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";

export const NavigationHome = () => {

    const router = useRouter();

    return ( 
        <div>
            <ActionTooltip 
                label="Home"
                align="center"  
                side="right"
            > 
                <button 
                    onClick={() => router.push("/community")}
                    className="group flex items-center"
                >
                    <div className="
                        flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] 
                        transition-all overflow-hidden items-center justify-center 
                        bg-background dark:bg-neutral-700 group-hover:bg-emerald-500"
                    >
                        <Home
                            className="group-hover:text-white transition text-emerald-500"
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
     );
}

export default NavigationHome;