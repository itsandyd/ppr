"use client";

import AuthModal from "@/components/music/AuthModal";
import UploadModal from "@/components/music/UploadModal";

import { useEffect, useState } from "react";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

  return (
    <>
    <AuthModal />
    <UploadModal />
    </>
  )
}

export default ModalProvider