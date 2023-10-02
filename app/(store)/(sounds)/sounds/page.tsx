import getBillboard from "@/actions/get-billboard";
import Billboard from "@/components/store/store/billboard";
import Footer from "@/components/store/store/footer";
import Navbar from "@/components/store/store/navbar";
import Container from "@/components/store/store/ui/container";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface SoundsPageProps {
    params: {
      storeId: string;
    }
  }

const SoundsPage = async ({
    params,
}: SoundsPageProps) => {
    const store = await db.store.findFirst({
    });

    if (!store) {
        redirect("/");
    }

    // const sounds = await db.

    // const billboard = await getBillboard("0e12e5cf-29ab-4529-b8d5-c5371dae1f7b");

    return ( 
        <>
            <div className="space-y-10 pb-10">
                <Navbar />
                <div className="flex-col">
                    <div className="flex-1 space-y-4 p-8 pt-6">
                    {store.name}
                    </div>
                    </div>
                </div>
      </>
     );
}

export default SoundsPage;
