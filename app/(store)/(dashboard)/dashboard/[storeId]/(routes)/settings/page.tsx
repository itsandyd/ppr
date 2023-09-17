import { db } from "@/lib/db";

interface DashboardPageProps {
    params: { storeId: string };
}

const SettingsPage: React.FC<DashboardPageProps> = async ({ params }) => {

    const store = await db.store.findFirst({
        where: {
            id: params.storeId
        }
    });

    return (
        <div>
            <h1>Active Store Settings: {store?.name}</h1>
        </div>
    )
}

export default SettingsPage;