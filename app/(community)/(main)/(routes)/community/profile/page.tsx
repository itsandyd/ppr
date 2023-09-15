// @profile/[profileId].tsx
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

interface ProfileIdPageProps {
  params: {
    profileId: string;
  }
}

const ProfileIdPage = async ({
  params,
}: ProfileIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const profileData = await db.profile.findUnique({
    where: {
      id: profile.id
    },
  });

  if (!profileData) {
    return redirect("/");
  }

  // Render your profile page here using the profileData
  return (
    <div>
      <h1>{profileData.name}</h1>
    </div>
  );
}

export default ProfileIdPage;