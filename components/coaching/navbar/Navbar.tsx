"use client"

// import { SafeUser } from "@/app/types";

import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { SafeUser } from "@/types";
import { ClipboardCheck } from "lucide-react";

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({
  currentUser,
}) => {
  return ( 
    <div className="fixed w-full z-50 shadow-sm dark:shadow-neutral-800 bg-white dark:bg-neutral-900 theme-transition">
      <div
        className="
          py-4 
          border-b-[1px]
          border-neutral-200
          dark:border-neutral-700
        "
      >
      <Container>
        <div 
          className="
            flex 
            flex-row 
            items-center 
            justify-between
            gap-3
            md:gap-0
          "
        >
          <Logo />
          {/* <Search /> */}
          <UserMenu currentUser={currentUser} />
        </div>
      </Container>
    </div>
    {/* <Categories /> */}
  </div>
  );
}


export default Navbar;