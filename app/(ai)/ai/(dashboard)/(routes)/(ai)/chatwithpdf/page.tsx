import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function ChatWithPDFHome () {

    const { userId } = await auth();
    const isAuth =  !!userId;

    return ( 
        <div className="w-screen min-h-screen bg-gradient-to-r from-[#99d8f5] to-[#EE106A]">
            <div className="absolute top-1/2 left-1/2">
                <div className="flex flex-col items-center text-center">
                    <div className="flex items-center">
                        <h1 className="mr-3 text-5xl font-semibold">
                            Chat with any PDF
                        </h1>
                    </div>
                    <div className="flex mt-2">
                        {isAuth && (
                            <Button>
                                Go to chats
                            </Button>
                        )}
                    </div>
                    <p className="max-w-xl mt-2 text-lg text-slate-600">
                        Transform your music production experience with our AI platform, where uploading VST documentation unlocks instant, intelligent answers to all your technical questions, bridging the gap between complex resources and real-time solutions.
                    </p>
                    <div>
                        {isAuth ? (
                            <h1>File Upload</h1>
                        ) : (
                            <Link href="/sign-in">
                                <Button>
                                    Login to get started
                                    <LogIn />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
     );
}




