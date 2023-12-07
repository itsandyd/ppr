"use client"

import { cn } from "@/lib/utils";
import { Member, Profile, Server, MemberRole } from "@prisma/client";
import { Crown, Shield } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
// import { UserAvatar } from "../user-avatar";


interface ServerMemberProps {
    member: Member & { profile: Profile };
    server: Server;
}

const roleIconMap = {
    [MemberRole.ADMIN]: <Crown className="w-4 h-4"/>,
    [MemberRole.MODERATOR]: <Shield className="w-4 h-4"/>,
    [MemberRole.GUEST]: null,
}

export const ServerMember = ({
    member,
    server,
}: ServerMemberProps) => {

    const params = useParams();
    const icon = roleIconMap[member.role];
    const router = useRouter();
    const profile = member.profile;

    const onClick = () => {
        router.push(`/community/servers/${params?.serverId}/conversations/${member.id}`)
      }

    return ( 
        <button 
            onClick={onClick}
            className={cn("group px-2 py-2 rounded-md align-center flex items-center space-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 mr-auto",
            params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700")}>
            {/* <UserAvatar 
                src={member.profile.imageUrl}
                className="w-4 h-4 md:h-4 md:w-4"
            /> */}
            <p
                className={cn("font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}
            >
                {member.profile.name}
            </p>
            <div className="h-4 w-4 text-zinc-500">
                {icon}
            </div>
        </button>
    );
}

export default ServerMember;