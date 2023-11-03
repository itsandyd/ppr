'use client';

import { cn } from "@/lib/utils";
import { ClipboardCheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return ( 
    <Link href="/">
     <h1 className={cn("text-2xl font-bold p-2")}>
          Coaching
        </h1>
    </Link>
   );
}
 
export default Logo;