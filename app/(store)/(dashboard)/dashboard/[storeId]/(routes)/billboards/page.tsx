import SettingsForm from "@/components/store/settings-form";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { BillboardClient } from "./components/client";

interface DashboardPageProps {
    params: { storeId: string };
}

const BillboardsPage: React.FC<DashboardPageProps> = async ({ params }) => {

    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const store = await db.store.findFirst({
        where: {
            id: params.storeId
        }
    });

    if (!store) {
        redirect('/');
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient />
            </div>
        </div>
    )
}

export default BillboardsPage;