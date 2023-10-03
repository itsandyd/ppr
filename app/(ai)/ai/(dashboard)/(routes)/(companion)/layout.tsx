import { CompanionNavbar } from "@/components/ai/companion/companion-navbar";
import { CompanionSidebar } from "@/components/ai/companion/companion-sidebar";


import { checkSubscription } from "@/lib/subscriptions";

const CompanionLayout = async({ 
    children 
}: {
    children: React.ReactNode;
}) => {

    const isPro = await checkSubscription();

    return (
        <div className="h-full">
            <CompanionNavbar isPro={isPro} />
            <div className="hidden md:flex mt-16 w-20 flex-col fixed inset-y-0">
                <CompanionSidebar isPro={isPro}/>
            </div>
            <main className="md:pl-20 pt-16 h-full">
                {children}
            </main>
        </div>
    )
}

export default CompanionLayout;