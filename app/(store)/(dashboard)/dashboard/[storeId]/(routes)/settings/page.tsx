import SettingsForm from "@/components/store/dashboard/settings-form";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface DashboardPageProps {
    params: { storeId: string };
}

const SettingsPage: React.FC<DashboardPageProps> = async ({ params }) => {

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
                <SettingsForm
                    initialData={store}
                />
            </div>
        </div>
    )
}

export default SettingsPage;