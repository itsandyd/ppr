
import Link from "next/link";
import Container from "./ui/container";
import MainNav from "./main-nav";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Navbar = () => {
    return (
        <div className="border-b">
            <Container>
                <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center"> 
                <Button variant="ghost" className="rounded-full mr-2">
                <Link href="/">
                    <ArrowLeft className="text-zinc-500 h-6 w-6" />
                </Link>
            </Button>
                    <Link href="/sounds" className="ml-4 flex lg:ml-0 gap-x-2">
                        <p className="font-bold text-xl">Sounds</p>
                    </Link>
                    <MainNav data={[]}/>
                </div>
            </Container>
        </div>
    )
}

export default Navbar;