import getBillboard from "@/actions/get-billboard";
import Billboard from "@/components/store/store/billboard";
import Footer from "@/components/store/store/footer";
import Navbar from "@/components/store/store/navbar";
import Container from "@/components/store/store/ui/container";
import { db } from "@/lib/db";

export const revalidate = 0;

const SoundsPage = async () => {

    const billboard = await getBillboard("0e12e5cf-29ab-4529-b8d5-c5371dae1f7b");

    return ( 
<>
            <div className="space-y-10 pb-10">
                <Navbar />
                <Billboard data={billboard}/>
            </div>
      </>
     );
}

export default SoundsPage;