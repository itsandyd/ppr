import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { InitialModal } from "@/components/community/modals/initial-modal";

const SetupPage = async () => {
    const profile = await initialProfile();

    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                }
            }
        },
    });

    if (server) {
        return redirect(`/community/servers/${server.id}`)
    }

    if (!server) {
        return redirect('/community/invite/ppr')
    }
    
    return ( 
        <InitialModal />
     );
}

export default SetupPage;