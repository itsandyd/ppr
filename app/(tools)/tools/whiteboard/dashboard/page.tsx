"use client"

import { useOrganization } from "@clerk/nextjs"
import { EmptyOrg } from "../components/EmptyOrg";
import { BoardList } from "../components/BoardList";

interface DashboardPageProps {
    searchParams: {
        search?: string;
        favorites?: string;
    }
}

const WhiteboardDashboardPage = ({
    searchParams,
}: DashboardPageProps) => {

    const { organization } = useOrganization();

    return (
        <div className="flex h-[calc(100%-80px)] p-6">
            {!organization ? (
            <EmptyOrg />
            ) : (
            <div>
                <BoardList
                    orgId={organization.id}
                    query={searchParams}
                />
            </div>
            )}
        </div>
    )
}

export default WhiteboardDashboardPage