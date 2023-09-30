import AiNavbar from "@/components/ai/ai-navbar";
import AiSidebar from "@/components/ai/ai-sidebar";



const DashboardLayout = ({
    children
}: {
    children: React.ReactNode;
}) => (
    <div className="h-full relative">
        <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
            <div className="text-white">
                <AiSidebar />
            </div>
        </div>
        <main className="md:pl-72">
            <AiNavbar />
                {children}
        </main>
    </div>
);

export default DashboardLayout;
