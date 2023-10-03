"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

import { useEffect, useState } from "react";

import { Menu } from "lucide-react";

import { CompanionSidebar } from "./companion-sidebar";

interface MobileSidebarProps {
    isPro: boolean | undefined;
}

const CompanionMobileSidebar = ({
    isPro
}: MobileSidebarProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Sheet>
            <SheetTrigger>
        <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
        </Button>
        </SheetTrigger>
        <SheetContent className="p-0" side="left">
            <CompanionSidebar isPro={isPro}/>
        </SheetContent>
        </Sheet>
    )
}

export default CompanionMobileSidebar;