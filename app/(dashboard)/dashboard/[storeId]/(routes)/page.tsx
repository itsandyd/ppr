import { db } from "@/lib/db";

interface DashboardPageProps {
    params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {

    const store = await db.store.findFirst({
        where: {
            id: params.storeId
        }
    });

    return (
        <div>
            <h1>Active Store: {store?.name}</h1>
        </div>
    )
}

export default DashboardPage;