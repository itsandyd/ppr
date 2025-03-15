'use client';

import { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
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

  const tabs = [
    { id: 'schedule', label: 'Schedule' },
    { id: 'listings', label: 'Listings' },
    { id: 'resources', label: 'Resources' }
  ];

  return (
    <div className="bg-neutral-900 rounded-xl p-6 shadow-md">
      <div className="w-full">
        {/* Custom Tab Navigation */}
        <div className="grid grid-cols-3 mb-8 bg-[#2a2a2a] rounded-md overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-12 outline-none transition-colors ${
                activeTab === tab.id 
                  ? 'bg-[#0f0f0f] text-white font-medium' 
                  : 'bg-transparent text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'schedule' && <ScheduleManagement currentUser={currentUser} />}
          {activeTab === 'listings' && <ListingsManagement currentUser={currentUser} />}
          {activeTab === 'resources' && <ResourcesManagement currentUser={currentUser} />}
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard; 