import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { useUser } from "@clerk/nextjs";

interface UserAvatarProps {
    src: string;
}

export const UserAvatar = () => {
    const { user } = useUser();

    return (
        <Avatar>
            <AvatarImage src={user?.imageUrl} />
        </Avatar>
    )
}