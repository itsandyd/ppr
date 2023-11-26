import Image from "next/image";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
// import MessageButton from "@/components/community/profile/message-button";
import { UserAvatar } from "@/components/community/user-avatar";
import { BsSpotify } from "react-icons/bs";
import { FaSoundcloud } from "react-icons/fa";

interface ProfileIdPageProps {
  params: {
    profileId: string;
  }
}

const ProfileIdPage = async ({
  params,
}: ProfileIdPageProps) => {
  const profile = await db.profile.findUnique({
    where: {
      id: params.profileId
    },
  });

  if (!profile) {
    return redirectToSignIn();
  }

  return (
    <div 
      className="
        bg-neutral-900 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
      "
    >
        <div className="m-10">
          <div 
            className="
              flex 
              flex-col 
              md:flex-row 
              items-center 
              gap-x-5
              
            "
          >
            <div className="flex items-center space-x-4">
              {/* <div className="w-40 h-40"> */}
                <UserAvatar
                  src={profile.imageUrl}
                  className="w-24 h-24 items-center justify-center"
                />
              {/* </div>  */}
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">
                Welcome back
              </p>
              <h1 
              className="
              text-white 
                text-4xl 
                sm:text-5xl 
                lg:text-7xl 
                font-bold
                "
              >
              {profile.name}
            </h1>
              {/* <MessageButton profileId={profile.id}/> */}
            </div>
            
          </div>
          <div className="mt-6 flex">
        <Button variant="link">
          <BsSpotify />
        </Button>
        <Button variant="link">
          <FaSoundcloud />
        </Button>
      </div>
        </div>
    </div>
  );
}

export default ProfileIdPage;