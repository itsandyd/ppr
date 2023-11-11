import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingHero } from "@/components/landing/landing-hero";
// import { LandingContent } from "@/components/landing-content";
import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const LandingPage = async () => {
  // const profile = await initialProfile();

  // const server = await db.server.findFirst({
  //   where: {
  //     members: {
  //       some: {
  //         profileId: profile.id,
  //       },
  //     },
  //   },
  // });

  return (
    <div className="h-full ">
      <LandingNavbar />
      <LandingHero />
      {/* <LandingContent /> */}
    </div>
  );
}

export default LandingPage;