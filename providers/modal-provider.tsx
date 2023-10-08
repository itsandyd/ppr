"use client"

import { useState, useEffect } from "react"

import { CreateServerModal } from "@/components/community/modals/create-server-modal"
import { InviteModal } from "@/components/community/modals/invite-modal";
import { EditServerModal } from "../components/community/modals/edit-server-modal";
import { MembersModal } from "../components/community/modals/members-modal";
import { CreateChannelModal } from "@/components/community/modals/create-channel-modal";
import { DeleteServerModal } from "../components/community/modals/delete-server-modal";
import { DeleteChannelModal } from "../components/community/modals/delete-channel-modal";
import { EditChannelModal } from "../components/community/modals/edit-channel-modal";
import { MessageFileModal } from "../components/community/modals/message-file-modal";
import { StoreModal } from "@/components/store/dashboard/modals/store-modal";




export const ModalProvider = () => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <CreateServerModal />
            <InviteModal />
            <EditServerModal />
            <MembersModal />
            <CreateChannelModal />
            <DeleteServerModal />
            <DeleteChannelModal />
            <EditChannelModal />
            <MessageFileModal />
            <StoreModal />
        </>
    )
}