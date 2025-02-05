"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MdSnooze } from 'react-icons/md';
import Link from 'next/link';
import { MusicNavbar } from "@/components/music/music-navbar";

export default function SpotifyDashboardPage() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className="h-full">
      <MusicNavbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Music</h1>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Fan Visits</CardTitle>
            </CardHeader>
            <CardContent>0</CardContent>
            <CardFooter>+0 in last 7 Days</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Fans Added</CardTitle>
            </CardHeader>
            <CardContent>0</CardContent>
            <CardFooter>+0 in last 7 Days</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Fan Emails Captured</CardTitle>
            </CardHeader>
            <CardContent>0</CardContent>
            <CardFooter>+0 in last 7 Days</CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="ad-campaigns">
          <TabsList>
            <TabsTrigger value="ad-campaigns">Ad Campaigns</TabsTrigger>
            <TabsTrigger value="smart-links">Smart Links</TabsTrigger>
            <TabsTrigger value="download-gates">Download Gates</TabsTrigger>
            <TabsTrigger value="link-gates">Link Gates</TabsTrigger>
            <TabsTrigger value="loud-links">Loud Links</TabsTrigger>
          </TabsList>
          <TabsContent value="ad-campaigns">
            <div className="mt-4">
              <Button variant="default">
                <Link href="/spotify/ads">
                  <span className="mr-2">+</span> Get started here
                </Link>
              </Button>
              <p className="mt-2">Step 1: Create your first ad campaign</p>
            </div>
          </TabsContent>
          <TabsContent value="smart-links">
            <div className="flex flex-col items-center justify-center">
              <MdSnooze />
              <p className="text-center">
                Its pretty quiet here... You havent created any smart links yet.{" "}
                <Link href="/" className="text-blue-500 underline">
                  Click here
                </Link>{" "}
                to add your first smart link.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="download-gates">
            <div className="flex flex-col items-center justify-center">
              <MdSnooze />
              <p className="text-center">
                Its pretty quiet here... You havent created any download gates yet.{" "}
                <Link href="/path/to/create-smart-link" className="text-blue-500 underline">
                  Click here
                </Link>{" "}
                to create your first download gate.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="link-gates">
            <div className="flex flex-col items-center justify-center">
              <MdSnooze />
              <p className="text-center">
                Its pretty quiet here... You havent created any link gates yet.{" "}
                <Link href="/path/to/create-smart-link" className="text-blue-500 underline">
                  Click here
                </Link>{" "}
                to add your first link gate
              </p>
            </div>
          </TabsContent>
          <TabsContent value="loud-links">
            <div className="flex flex-col items-center justify-center">
              <MdSnooze />
              <p className="text-center">
                Its pretty quiet here... You havent created any loud links yet.{" "}
                <Link href="/path/to/create-smart-link" className="text-blue-500 underline">
                  Click here
                </Link>{" "}
                to add your first loud link.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}