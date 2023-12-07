"use client"

import StorageSideBar from "@/components/drive/app/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { UserButton } from "@clerk/nextjs";
import { Clock, Computer, DoorClosed, File, FileIcon, Folder, FolderArchive, Grid, HardDrive, List, MoreVertical, Plus, Star, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { BsExclamation, BsPeople } from "react-icons/bs";
import { MdEmergency, MdStorage } from "react-icons/md";

interface Activity {
  action: string;
  item: string;
  time: string;
}

interface Document {
  id: number;
  title: string;
  description: string;
  image: string;
  activity: Activity[];
  modifiedDate: string; // Add this line
  createdDate: string; // Add this line
}

export default function Drive() {

  const totalStorage = 100; // total storage in GB
  const usedStorage = 48.1; // used storage in GB

  // calculate the percentage of storage used
  const storageUsedPercentage = (usedStorage / totalStorage) * 100;

  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  const documents = [
    {
      id: 1,
      title: "Test 1",
      description: "You modified in the past year",
      image: "/placeholder.svg",
      createdDate: "01-01-2022",
      modifiedDate: "02-02-2022",
      activity: [
        { action: "You uploaded", item: "report1.docx", time: "2 hours ago" },
        { action: "You deleted", item: "draft1.txt", time: "3 days ago" },
        { action: "You created", item: "Budget Plan Folder", time: "1 week ago" },
      ],
    },
    {
      id: 2,
      title: "Project Alpha",
      description: "Contains all files related to Project Alpha.",
      image: "/placeholder.svg",
      createdDate: "03-01-2022", // Example date
      modifiedDate: "04-02-2022", // Example date
      activity: [
        { action: "You uploaded", item: "alpha-report.docx", time: "1 day ago" },
        { action: "You shared", item: "project-alpha-presentation.ppt", time: "4 days ago" },
        { action: "You commented", item: "alpha-plan.pdf", time: "2 weeks ago" },
      ],
    },
    {
      id: 3,
      title: "Budget Reports",
      description: "Annual and quarterly budget reports.",
      image: "/placeholder.svg",
      createdDate: "05-01-2022", // Example date
      modifiedDate: "06-02-2022", // Example date
      activity: [
        { action: "You revised", item: "Q1-budget-report.xlsx", time: "5 hours ago" },
        { action: "You moved", item: "annual-budget-2021.pdf", time: "1 week ago" },
        { action: "You archived", item: "Q4-budget-report-2020.xlsx", time: "2 weeks ago" },
      ],
    },
    {
      id: 4,
      title: "Team Meetings",
      description: "Meeting minutes and presentation slides.",
      image: "/placeholder.svg",
      createdDate: "07-01-2022", // Example date
      modifiedDate: "08-02-2022", // Example date
      activity: [
        { action: "You updated", item: "meeting-notes.docx", time: "1 day ago" },
        { action: "You shared", item: "presentation-slides.pptx", time: "5 days ago" },
        { action: "You created", item: "meeting-schedule.xlsx", time: "2 weeks ago" },
      ],
    },
    {
      id: 5,
      title: "Client Proposals",
      description: "Proposals and pitches for potential clients.",
      image: "/placeholder.svg",
      createdDate: "09-01-2022", // Example date
      modifiedDate: "10-02-2022", // Example date
      activity: [
        { action: "You edited", item: "proposal-template.docx", time: "3 hours ago" },
        { action: "You sent", item: "client-pitch.pptx", time: "2 days ago" },
        { action: "You brainstormed", item: "ideas.txt", time: "1 week ago" },
      ],
    },
    {
      id: 6,
      title: "Research Documents",
      description: "Research papers and related documents.",
      image: "/placeholder.svg",
      createdDate: "11-01-2022", // Example date
      modifiedDate: "12-02-2022", // Example date
      activity: [
        { action: "You uploaded", item: "research-paper.pdf", time: "4 hours ago" },
        { action: "You reviewed", item: "study-notes.docx", time: "6 days ago" },
        { action: "You organized", item: "data-spreadsheets.xlsx", time: "3 weeks ago" },
      ],
    },
    {
      id: 7,
      title: "Human Resources",
      description: "Employee records and HR policies.",
      image: "/placeholder.svg",
      createdDate: "13-01-2022", // Example date
      modifiedDate: "14-02-2022", // Example date
      activity: [
        { action: "You updated", item: "employee-handbook.pdf", time: "5 hours ago" },
        { action: "You added", item: "new-hire-info.docx", time: "3 days ago" },
        { action: "You archived", item: "old-policies.pdf", time: "2 weeks ago" },
      ],
    },
    {
      id: 8,
      title: "Marketing Materials",
      description: "Marketing and promotional materials.",
      image: "/placeholder.svg",
      createdDate: "15-01-2022", // Example date
      modifiedDate: "16-02-2022", // Example date
      activity: [
        { action: "You designed", item: "new-flyer.png", time: "1 day ago" },
        { action: "You reviewed", item: "marketing-strategy.docx", time: "4 days ago" },
        { action: "You brainstormed", item: "campaign-ideas.txt", time: "1 week ago" },
      ],
    },
    {
      id: 9,
      title: "Software Development",
      description: "Source code, documentation, and related files.",
      image: "/placeholder.svg",
      createdDate: "17-01-2022", // Example date
      modifiedDate: "18-02-2022", // Example date
      activity: [
        { action: "You committed", item: "feature-code.js", time: "2 hours ago" },
        { action: "You merged", item: "dev-branch", time: "1 day ago" },
        { action: "You opened", item: "bug-report.txt", time: "3 days ago" },
      ],
    },
    {
      id: 10,
      title: "Training Materials",
      description: "Training guides and instructional materials.",
      image: "/placeholder.svg",
      createdDate: "19-01-2022", // Example date
      modifiedDate: "20-02-2022", // Example date
      activity: [
        { action: "You updated", item: "training-module.pdf", time: "4 hours ago" },
        { action: "You created", item: "workshop-schedule.docx", time: "2 days ago" },
        { action: "You reviewed", item: "instructional-videos", time: "1 week ago" },
      ],
    },
    {
      id: 11,
      title: "Personal",
      description: "Personal documents and files.",
      image: "/placeholder.svg",
      createdDate: "21-01-2022", // Example date
      modifiedDate: "22-02-2022", // Example date
      activity: [
        { action: "You organized", item: "personal-letters.docx", time: "1 hour ago" },
        { action: "You backed up", item: "photos-archive", time: "5 days ago" },
        { action: "You deleted", item: "old-emails.txt", time: "2 weeks ago" },
      ],
    }, 
    // Add more documents here...
  ];
  

return (
<div className="flex h-screen">
<div className="hidden lg:block">
 <StorageSideBar />
 </div>
  <div className="flex-1 overflow-auto">
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Drive</h1>
        <div className="flex space-x-2">
          <Grid className="h-6 w-6" />
          <List className="h-6 w-6" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {documents.map((doc) => (
          <Card
            key={doc.id}
            className="w-full"
            onClick={() => setSelectedDoc(doc)}
          >
            <CardContent>
              <Image
                alt={doc.title}
                className="aspect-[2/1] mb-2"
                height="100"
                src={doc.image}
                width="200"
              />
              <h3 className="text-lg font-medium mb-1">{doc.title}</h3>
              <p className="text-sm text-gray-500">{doc.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Folders</h2>
        <div className="grid grid-cols-3 gap-4">
          <Button className="flex items-center space-x-2">
            <Folder className="h-6 w-6 text-blue-500" />
            <span>Honey Remix Remake</span>
            <MoreVertical className="h-4 w-4 ml-auto" />
          </Button>
          <Button className="flex items-center space-x-2">
            <Folder className="h-6 w-6 text-blue-500" />
            <span>Laptop Downloads</span>
            <MoreVertical className="h-4 w-4 ml-auto" />
          </Button>
          <Button className="flex items-center space-x-2">
            <Folder className="h-6 w-6 text-blue-500" />
            <span># Funeral Pictures</span>
            <MoreVertical className="h-4 w-4 ml-auto" />
          </Button>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Files</h2>
        <div className="grid grid-cols-3 gap-4">
          <Card className="w-full">
            <CardContent>
              <Image
                alt="Document thumbnail"
                className="aspect-[2/1] mb-2"
                height="100"
                src="/placeholder.svg"
                width="200"
              />
              <h3 className="text-lg font-medium mb-1">PausePlayRepeat Payments</h3>
              <p className="text-sm text-gray-500">You modified in the past year</p>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent>
              <Image
                alt="Document thumbnail"
                className="aspect-[2/1] mb-2"
                height="100"
                src="/placeholder.svg"
                width="200"
              />
              <h3 className="text-lg font-medium mb-1">Dragonflight Raid Planning</h3>
              <p className="text-sm text-gray-500">You opened</p>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent>
              <Image
                alt="Document thumbnail"
                className="aspect-[2/1] mb-2"
                height="100"
                src="/placeholder.svg"
                width="200"
              />
              <h3 className="text-lg font-medium mb-1">Untitled spreadsheet</h3>
              <p className="text-sm text-gray-500">You opened</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
  <div className="w-64 bg-gray-50 p-4 hidden lg:block">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-lg font-bold">My Drive</h2>
    <UserButton />
  </div>
  <Tabs defaultValue="Details" className="flex flex-col space-y-4">
    <TabsList className="flex items-center justify-between">
      <TabsTrigger value="Details">Details</TabsTrigger>
      <TabsTrigger value="Activity">Activity</TabsTrigger>
    </TabsList>
    <TabsContent value="Details">
      {selectedDoc && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <FileIcon className="h-24 w-24 text-gray-400" />
          <div className="text-center text-sm text-gray-500">
            <h4 className="font-bold">Access Settings</h4>
            <Button className="mt-2 bg-blue-500 text-white">Manage Access</Button>
            <h4 className="font-bold mt-4">Folder Details</h4>
            <p>Type: Folder</p>
            <p>Location: My Drive</p>
            <p>Owner: You</p>
            <p>Modified: {selectedDoc.modifiedDate}</p>
            <p>Created: {selectedDoc.createdDate}</p>
            <h4 className="font-bold mt-4">Download Permissions</h4>
            <p>Anyone with the link can download</p>
            <h4 className="font-bold mt-4">Description</h4>
            <Textarea
              className="w-full h-20 p-2 rounded border border-gray-400 text-black"
              placeholder="Add a description"
              value={selectedDoc.description}
            />
          </div>
          </div>
      )}
    </TabsContent>
    <TabsContent value="Activity">
  <div className="flex flex-col items-start justify-center space-y-4">
    <h4 className="font-bold">Older</h4>
    <div className="pl-4">
      {/* <p className="text-sm text-gray-500">
        <FolderArchive className="h-4 w-4 inline-block mr-1" />
        Laptop Downloads
      </p> */}
      <ul className="list-disc list-inside pl-4">
      {selectedDoc?.activity.map((activity: Activity, index: number) => (
        <li key={index} className="text-sm text-gray-500">
          <span className="font-medium">{activity.action}</span>
          <span className="font-medium">{activity.item}</span>- {activity.time}
        </li>
      ))}
      </ul>
    </div>
    <Button variant="default">Show all</Button>
  </div>
</TabsContent>
  </Tabs>
</div>
</div>
)
};

