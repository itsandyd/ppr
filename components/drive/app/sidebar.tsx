import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useModal } from '@/hooks/use-modal-store'
import { AlertCircle, Clock, Computer, Folder, HardDrive, Plus, Star, Trash } from 'lucide-react'
import React from 'react'
import { BsPeople } from 'react-icons/bs'
import { MdEmergency, MdStorage } from 'react-icons/md'

export default function StorageSideBar () {

    const totalStorage = 100; // total storage in GB
    const usedStorage = 48.1; // used storage in GB
  
    // calculate the percentage of storage used
    const storageUsedPercentage = (usedStorage / totalStorage) * 100;

    const { onOpen } = useModal();


  return (
    <div className="flex flex-col w-64 p-4">
<div className="flex items-center space-x-2 mb-6">
  <HardDrive className="h-6 w-6 text-blue-500" />
  <span className="font-bold text-lg">Drive</span>
</div>
<div className="flex flex-col space-y-2">
<Button 
  className="flex items-center space-x-2 bg-blue-500 text-white"
  onClick={() => onOpen("createServer")}
>
  <Plus className="h-4 w-4" />
  <span>New</span>
</Button>
  <Button variant="ghost" className="flex items-center space-x-2 justify-start">
<Folder className="h-4 w-4" />
<span>My Drive</span>

</Button>
<Button variant="ghost" className="flex items-center space-x-2 justify-start">
<Computer className="h-4 w-4" />
<span>Computers</span>
</Button>
<Button variant="ghost" className="flex items-center space-x-2 justify-start">
<BsPeople className="h-4 w-4" />
<span>Shared with me</span>
</Button>
<Button variant="ghost" className="flex items-center space-x-2 justify-start">
<Clock className="h-4 w-4" />
<span>Recent</span>
</Button>
<Button variant="ghost" className="flex items-center space-x-2 justify-start">
<Star className="h-4 w-4" />
<span>Starred</span>
</Button>
<Button variant="ghost" className="flex items-center space-x-2 justify-start">
<AlertCircle className="h-4 w-4" />
<span>Spam</span>
</Button>
<Button variant="ghost" className="flex items-center space-x-2 justify-start">
<Trash className="h-4 w-4" />
<span>Trash</span>
</Button>
<Button variant="ghost" className="flex items-center space-x-2 justify-start">
<MdStorage className="h-4 w-4" />
<span>Storage</span>
</Button>
<div>
  <Progress value={storageUsedPercentage} className="w-full bg-gray-200" />
  <div className="text-sm mt-4">
    <span>{usedStorage}GB of {totalStorage}GB used</span>
  </div>
</div>
  <Button className="mt-2 bg-blue-500 text-white">Get more storage</Button>
</div>
</div>
  )
}