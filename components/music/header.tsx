"use client";

import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { HiHome } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
// import Button from './Button';
// import useAuthModal from '@/hooks/useAuthModal';
// import { useSupabaseClient } from '@supabase/auth-helpers-react';
// import { useUser } from '@/hooks/useUser';
import { FaUserAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
// import UploadModal from './UploadModal';
// import useUploadModal from '@/hooks/useUploadModal';
import { AiOutlinePlus } from 'react-icons/ai';
import { UserButton, auth } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { useModal } from '@/hooks/use-modal-store';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
    children, 
    className 
}) => {
    // const authModal = useAuthModal();
    const uploadModal = useModal();
    const router = useRouter();
//   const supabaseClient = useSupabaseClient();

  return (
    <div className={cn(`
      h-fit
      bg-gradient-to-b
      from-sky-300
      p-6
    `, className)}>
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            onClick={() => router.back()}
            className="rounded-full bg-black text-white flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretLeft size={35} />
          </button>
          <button
            onClick={() => router.forward()}
            className="rounded-full bg-black text-white flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretRight size={35} />
          </button>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
        <button 
          className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition"
          onClick={() => router.push('/')}
        >
          <HiHome className="text-black" size={20} />
        </button>
        <button 
          className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition"
          onClick={() => router.push('/search')}
        >
          <BiSearch className="text-black" size={20} />
        </button>
          <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
            <AiOutlinePlus className="text-black" size={20} onClick={uploadModal.onOpen} />
          </button>
        </div>
        <div className="flex justify-between items-center gap-x-4">
            <UserButton />
        </div>
      </div>
      {children}
    </div>
  );
}

export default Header;
