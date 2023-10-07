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

export interface Billboard {
    id: string;
    label: string;
    imageUrl: string;
  };

export interface Category {
    id: string,
    name: string,
    billboard: Billboard
}

export interface Product {
    id: string,
    category: Category,
    name: string,
    description: string,
    price: number,
    isFeatured: boolean,
    images: Image[];
}

export interface Image {
    id: string;
    url: string;
}

import Stripe from 'stripe';

export interface Song {
    id: string;
    user_id: string;
    author: string;
    title: string;
    song_path: string;
    image_path: string;
}

export interface UserDetails {
    id: string;
    first_name: string;
    last_name: string; 
    full_name?: string;
    avatar_url?: string;
    billing_address?: Stripe.Address;
    payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
};

// export interface Product {
//     id: string;
//     active?: boolean;
//     name?: string;
//     description?: string;
//     image?: string;
//     metadata?: Stripe.Metadata;
// }

export interface Price {
    id: string;
    product_id?: string;
    active?: boolean;
    description?: string;
    unit_amount?: number;
    currency?: string;
    type?: Stripe.Price.Type;
    interval?: Stripe.Price.Recurring.Interval;
    interval_count?: number;
    trial_period_days?: number;
    metadata?: Stripe.Metadata;
    products?: Product;
}

export interface Subscription {
    id: string;
    user_id: string;
    status?: Stripe.Subscription.Status;
    metadata?: Stripe.Metadata;
    price_id?: string;
    quantity?: number;
    cancel_at_period_end?: boolean;
    created: string;
    current_period_start: string;
    current_period_end: string;
    end_at?: string;
    cancel_at?: string;
    canceled_at?: string;
    trial_start?: string;
    trial_end?: string;
    prices?: Price;
}