'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScheduleManagement from './ScheduleManagement';
import ListingsManagement from './ListingsManagement';
import ResourcesManagement from './ResourcesManagement';
import { User } from "@clerk/nextjs/server";

interface CoachDashboardProps {
  currentUser: User;
}

const CoachDashboard: React.FC<CoachDashboardProps> = ({
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <div className="bg-neutral-900 rounded-xl p-6 shadow-md">
      <Tabs defaultValue="schedule" onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-8 border-0 p-0 overflow-hidden">
          <TabsTrigger 
            value="schedule" 
            className={`py-4 rounded-none border-0 ${
              activeTab === 'schedule' 
                ? 'bg-[#0f0f0f] text-white' 
                : 'bg-[#2a2a2a] text-neutral-400 hover:text-white'
            }`}
          >
            Schedule
          </TabsTrigger>
          <TabsTrigger 
            value="listings" 
            className={`py-4 rounded-none border-0 ${
              activeTab === 'listings' 
                ? 'bg-[#0f0f0f] text-white' 
                : 'bg-[#2a2a2a] text-neutral-400 hover:text-white'
            }`}
          >
            Listings
          </TabsTrigger>
          <TabsTrigger 
            value="resources" 
            className={`py-4 rounded-none border-0 ${
              activeTab === 'resources' 
                ? 'bg-[#0f0f0f] text-white' 
                : 'bg-[#2a2a2a] text-neutral-400 hover:text-white'
            }`}
          >
            Resources
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="mt-6">
          <ScheduleManagement currentUser={currentUser} />
        </TabsContent>
        
        <TabsContent value="listings" className="mt-6">
          <ListingsManagement currentUser={currentUser} />
        </TabsContent>
        
        <TabsContent value="resources" className="mt-6">
          <ResourcesManagement currentUser={currentUser} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoachDashboard; 