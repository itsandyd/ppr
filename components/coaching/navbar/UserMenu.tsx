// 'use client';

import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
// import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

// import useLoginModal from "@/app/hooks/useLoginModal";
// import useRegisterModal from "@/app/hooks/useRegisterModal";
// import useRentModal from "@/app/hooks/useRentModal";


import MenuItem from "./MenuItem";
import Avatar from "../Avatar";
import { SafeUser } from "@/types";

import { UserButton } from "@clerk/nextjs";
import useCoachingRegisterModal from "@/hooks/useCoachingRegisterModal";

interface UserMenuProps {
  currentUser?: SafeUser | null
}

const UserMenu: React.FC<UserMenuProps> = ({
  currentUser
}) => {
  const router = useRouter();

  // const loginModal = useLoginModal();
  // const registerModal = use();
  const coachingRegisterModal = useCoachingRegisterModal();

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const onRent = useCallback(() => {
    // if (!currentUser) {
    //   return loginModal.onOpen();
    // }
    console.log('onRent called - opening coaching register modal');
    coachingRegisterModal.onOpen();
  }, [coachingRegisterModal,]);

  return ( 
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div 
          onClick={onRent}
          className="
            hidden
            md:block
            text-sm 
            font-semibold 
            py-3 
            px-4 
            rounded-full 
            hover:bg-neutral-100 
            dark:hover:bg-neutral-800
            dark:text-white
            transition 
            cursor-pointer
            theme-transition
          "
        >
          Register as a coach
        </div>
        <div 
        onClick={toggleOpen}
        className="
          p-4
          md:py-1
          md:px-2
          border-[1px] 
          border-neutral-200 
          dark:border-neutral-700
          flex 
          flex-row 
          items-center 
          gap-3 
          rounded-full 
          cursor-pointer 
          hover:shadow-md 
          dark:hover:shadow-neutral-800
          dark:text-white
          dark:bg-neutral-900
          transition
          theme-transition
          "
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            {/* <Avatar src={currentUser?.image} /> */}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
      {isOpen && (
        <div 
          className="
            absolute 
            rounded-xl 
            shadow-md
            dark:shadow-gray-800
            w-[40vw]
            md:w-3/4 
            bg-white 
            dark:bg-neutral-900
            overflow-hidden 
            right-0 
            top-12 
            text-sm
            border-[1px]
            border-neutral-200
            dark:border-neutral-700
            z-50
          "
        >
          <div className="flex flex-col cursor-pointer">
            {/* {currentUser ? ( */}
              <>
              <MenuItem 
                label="My Sessions" 
                onClick={() => router.push('/coaching/sessions')}
              />
              <MenuItem 
                label="Favorite Coaches" 
                onClick={() => router.push('/coaching/favorites')}
              />
              <MenuItem 
                label="My Bookings" 
                onClick={() => router.push('/coaching/bookings')}
              />
              <MenuItem 
                label="Learning Materials" 
                onClick={() => router.push('/coaching/materials')}
              />
              <MenuItem 
                label="Coach Panel" 
                onClick={() => router.push('/coaching/coach-panel')}
              />
              <MenuItem 
                label="Register as a coach" 
                onClick={coachingRegisterModal.onOpen}
              />
              <hr className="dark:border-neutral-700" />
              { /* <MenuItem 
                label="Logout" 
                onClick={() => signOut()}
              /> */}
              </>
            {/* ) : ( */}
              <>
                {/* <MenuItem 
                  label="Login" 
                  onClick={loginModal.onOpen}
                />
                <MenuItem 
                  label="Sign up" 
                  onClick={registerModal.onOpen}
                /> */}
              </>
            {/* ) */}
            {/* } */}
          </div>
        </div>
      )}
    </div>
   );
}
 
export default UserMenu;