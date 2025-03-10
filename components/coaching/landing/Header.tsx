'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from 'react';
import { SafeUser } from "@/types";
import UserMenu from "@/components/coaching/navbar/UserMenu";

const Header = () => {
  const { user, isLoaded } = useUser();
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      // We're using simplified data since we don't need full SafeUser functionality
      const basicUser = {
        id: user.id,
        name: user.fullName || '',
        email: user.emailAddresses[0]?.emailAddress || '',
        image: user.imageUrl,
      } as SafeUser;
      
      setCurrentUser(basicUser);
    }
  }, [isLoaded, user]);
  
  return (
    <div className="w-full bg-background border-b border-border/80 theme-transition">
      <header className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Music className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">SoundMentor</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {/* <Link href="/coaching" className="hover:text-primary transition-colors">
            Home
          </Link> */}
          <Link href="/coaching/browse" className="hover:text-primary transition-colors">
            Browse Coaches
          </Link>
          {/* <Link href="#" className="hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            About
          </Link> */}
          {(!isLoaded || !user) && (
            <>
              <Button variant="outline" className="ml-2" asChild>
                <Link href="/sign-in">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
        
        <UserMenu currentUser={currentUser} />
      </header>
    </div>
  );
};

export default Header;