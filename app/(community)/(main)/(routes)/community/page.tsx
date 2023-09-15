import { LandingNavbar } from "@/components/community/landing/community-landing-navbar";
import { LandingHero } from "@/components/community/landing/community-landing-hero";
import { CommunityLandingContent } from "@/components/community/landing/community-landing-content";
import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const LandingPage = async () => {

  return ( 
    <div className="h-full ">
      {/* <LandingNavbar /> */}
      <LandingHero />
      <CommunityLandingContent />
    </div>
   );
}
 
export default LandingPage;