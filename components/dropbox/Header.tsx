import { SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "../community/mode-toggle";

function Header() {
    return (
        <header className="flex items-center justify-between px-6">
            <Link href="/dropbox" className="flex items-center space-x-2">
                {/* <div className="bg-[#99d8f5] w-fit">
                    <Image 
                        src="/ppr.svg"
                        alt="logo"
                        className="invert"
                        height={50}
                        width={50}
                    />
                </div> */}
                <h1 className="font-bold text-xl">Storage</h1>
            </Link>
            <div className="px-5 flex space-x-2 items-center"> 
                <ModeToggle />
                <UserButton afterSignOutUrl="/"/>

                <SignedOut>
                    <SignInButton afterSignInUrl="/dashboard" mode="modal"/>
                </SignedOut>

            </div>
        </header>
    )
}

export default Header;