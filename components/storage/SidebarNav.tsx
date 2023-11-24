"use client"

import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { Folder, Home, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { NewFolderForm } from "./NewFolder";

interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

interface SidebarNavProps {
    userId: string;
    folders: Folder[];
}

interface FormInput {
    folderName: string;
}

export default function SidebarNav({ userId, folders }: SidebarNavProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm<FormInput>();

    const handleOpenForm = () => {
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
    };

    const onSubmit = async (data: FormInput) => {
        // Here you can handle the creation of the new folder
        // After creating the new folder, you can close the form and reset the form fields
        handleCloseForm();
        reset();
    };

    return (
        <nav className="grid items-start px-4 text-sm font-medium">
            <div className="flex justify-between items-center">
                <div className="text-zinc-500 mt-4 mb-2">Folders</div>
                <button onClick={handleOpenForm}>
                    <Plus className="h-4 w-4" />
                </button>
            </div>
            {isFormOpen && (
                <NewFolderForm
                    onSubmit={onSubmit}
                    onClose={handleCloseForm}
                />
            )}
            <div className="space-y-1">
                {folders.map((folder) => (
                    <Link
                        key={folder.id}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                        href={`/storage/${folder.id}`}
                    >
                        <Folder className="h-4 w-4" />
                        {folder.name}
                    </Link>
                ))}
            </div>
        </nav>
    );
}