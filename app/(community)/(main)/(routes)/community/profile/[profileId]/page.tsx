import Image from "next/image";
import { db } from "@/lib/db";
import { redirect, useRouter } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";
import { Badge, User } from "lucide-react";
import { Button } from "@/components/ui/button";
// import MessageButton from "@/components/community/profile/message-button";
import { UserAvatar } from "@/components/community/user-avatar";
import { BsSpotify } from "react-icons/bs";
import { FaSoundcloud } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

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
        <Avatar className="w-24 h-24 rounded-full border-4 border-white">
          <AvatarImage src={profile.imageUrl}/>
        </Avatar>
        <div>
          <h1 className="text-4xl font-bold">{profile.name}</h1>
          {/* <p className="text-lg">Producer, Artist, Instrumentalist</p> */}
          {/* <p className="text-sm text-gray-400">Busty & the Bass, The Franklin Electric, Ewan Macintyre, +2</p> */}
          <div className="flex items-center space-x-2 mt-1">
            {/* <Locate className="text-blue-500" /> */}
            {/* <span>Montreal, Canada</span> */}
            {/* <Badge className="text-blue-500" /> */}
          </div>
        </div>
      </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              {/* <p className="hidden md:block font-semibold text-sm">
                Welcome back
              </p> */}
              {/* <h1 
              className="
              text-white 
                text-4xl 
                sm:text-5xl 
                lg:text-7xl 
                font-bold
                "
              >
              {profile.name} */}
            {/* </h1> */}
              <Button>
              <Link href={`/community/conversations/${profile.id}`}>Message</Link>
              </Button>
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