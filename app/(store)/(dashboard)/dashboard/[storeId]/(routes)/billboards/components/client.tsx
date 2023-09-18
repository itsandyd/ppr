"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

export const BillboardClient = () => {

    const router = useRouter();
    const params = useParams();


    return ( 
        <div className="flex items-center justify-between">
            <Heading 
                title="Billboards (0)"
                description="Manage billboards for your store"
            />
            <Button onClick={() => router.push(`/dashboard/${params?.storeId}/billboards/new`)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Billboard
            </Button>
        </div>
    )
}