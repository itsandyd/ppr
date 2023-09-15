import { Server, Member, Profile } from '@prisma/client'
import { User } from 'lucide-react'
import { Server as NetServer, Socket } from 'net'
import { NextApiResponse } from 'next'
import { Server as SocketIOServer } from "socket.io"

// import { Listing, Reservation, User } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile })[]
}

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer
        }
    }
}

// export type SafeListing = Omit<Listing, "createdAt"> & {
//   createdAt: string;
// };

// export type SafeReservation = Omit<
//   Reservation, 
//   "createdAt" | "startDate" | "endDate" | "listing"
// > & {
//   createdAt: string;
//   startDate: string;
//   endDate: string;
//   listing: SafeListing;
// };

// export type SafeUser = Omit<
//   User,
//   "createdAt" | "updatedAt" | "emailVerified"
// > & {
//   createdAt: string;
//   updatedAt: string;
//   emailVerified: string | null;
// };