"use client"

import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { CardContent, Card, CardTitle, CardHeader } from "@/components/ui/card"
import { UserButton, auth, useUser } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import { FaTruckLoading } from "react-icons/fa"
import { MdLocalDining } from "react-icons/md"
import { TbFidgetSpinner } from "react-icons/tb"

export const Profile = () => {

  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
       <Loader2 className="h-24 w-24 animate-spin"/>
    </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pt-6 px-4 lg:flex-row lg:gap-12 lg:px-6">
      <div className="w-full lg:w-1/3">
        <Card className="flex flex-col items-center text-center">
           <div className="mt-6 mb-6">
                <UserButton />
            </div>
          <CardContent>
            <h2 className="text-2xl font-bold">{user.fullName}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user.username}</p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{user.username}</p>
            {/* <p className="text-sm text-gray-500 dark:text-gray-400">+1 (123) 456-7890</p> */}
            <div className="mt-6 grid gap-2">
              <div className="flex items-center justify-center">
                {/* <UsersIcon className="h-5 w-5 mr-2" />
                <span>200 Followers</span> */}
              </div>
              <div className="flex items-center justify-center">
                {/* <UsersIcon className="h-5 w-5 mr-2" />
                <span>150 Following</span> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full lg:w-2/3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              <li className="py-4">
                <h3 className="text-lg font-medium">Posted a new article</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
              </li>
              <li className="py-4">
                <h3 className="text-lg font-medium">Liked a post</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">1 day ago</p>
              </li>
              <li className="py-4">
                <h3 className="text-lg font-medium">Started following Jane Doe</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">3 days ago</p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}