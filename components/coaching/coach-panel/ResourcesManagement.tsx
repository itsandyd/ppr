'use client';

import { useState, useEffect } from 'react';
import { User } from "@clerk/nextjs/server";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Button from '@/components/coaching/Button';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineCloudDownload, AiOutlineLink } from 'react-icons/ai';
import { BsFileEarmark, BsFileEarmarkPdf, BsFileEarmarkZip, BsFileEarmarkMusic } from 'react-icons/bs';

interface ResourcesManagementProps {
  currentUser: User;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  fileName: string;
  downloads: number;
  requiresLeadGen: boolean;
}

const ResourcesManagement: React.FC<ResourcesManagementProps> = ({
  currentUser
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);

  // Mock resources for demonstration
  const mockResources: Resource[] = [
    {
      id: '1',
      title: 'Mixing Template',
      description: 'Professional mixing template for Logic Pro X',
      type: 'template',
      fileName: 'pro-mixing-template.zip',
      downloads: 124,
      requiresLeadGen: true
    },
    {
      id: '2',
      title: 'Music Theory Guide',
      description: 'Comprehensive guide to essential music theory',
      type: 'pdf',
      fileName: 'music-theory-essentials.pdf',
      downloads: 87,
      requiresLeadGen: false
    },
    {
      id: '3',
      title: 'Vocal Processing Chain',
      description: 'My vocal processing presets for professional results',
      type: 'preset',
      fileName: 'vocal-presets.zip',
      downloads: 56,
      requiresLeadGen: true
    }
  ];

  useEffect(() => {
    // In a real app, you would fetch the coach's resources from the server
    // For this demo, we'll use the mock data
    setResources(mockResources);
  }, []);

  const handleCreateResource = () => {
    // Navigate to resource creation page or open modal
    toast.success('This would open a resource creation form');
  };

  const handleEditResource = (resourceId: string) => {
    // Navigate to resource edit page or open modal
    toast.success(`Edit resource ${resourceId}`);
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      setIsLoading(true);
      
      try {
        // Here you would make an API call to delete the resource
        // For demo purposes, we'll just simulate it client-side
        await new Promise(resolve => setTimeout(resolve, 1000));
        setResources(prevResources => prevResources.filter(resource => resource.id !== resourceId));
        
        toast.success('Resource deleted successfully');
      } catch (error) {
        toast.error('Failed to delete resource');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return BsFileEarmarkPdf;
      case 'template':
      case 'preset':
        return BsFileEarmarkZip;
      case 'audio':
        return BsFileEarmarkMusic;
      default:
        return BsFileEarmark;
    }
  };

  const copyResourceLink = (resourceId: string) => {
    const link = `https://yourapp.com/resources/${resourceId}`;
    navigator.clipboard.writeText(link);
    toast.success('Resource link copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Your Resources</h2>
        <Button 
          small
          label="Upload New Resource"
          onClick={handleCreateResource}
          disabled={isLoading}
          icon={AiOutlinePlus}
        />
      </div>

      {resources.length === 0 ? (
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <p className="text-neutral-400 mb-4">You don&apos;t have any resources yet</p>
            <Button 
              label="Upload Your First Resource"
              onClick={handleCreateResource}
              disabled={isLoading}
              icon={AiOutlinePlus}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => {
            const ResourceIcon = getResourceIcon(resource.type);
            return (
              <Card key={resource.id} className="bg-neutral-800 border-neutral-700 flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-900/20 rounded-md">
                        <ResourceIcon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white">{resource.title}</CardTitle>
                        <CardDescription className="text-neutral-400 text-xs mt-1">
                          {resource.fileName}
                        </CardDescription>
                      </div>
                    </div>
                    {resource.requiresLeadGen && (
                      <div className="bg-green-900/20 text-green-500 text-xs px-2 py-1 rounded-full">
                        Lead Gen
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <p className="text-sm text-neutral-300">{resource.description}</p>
                  <div className="mt-3 text-xs text-neutral-400 flex items-center">
                    <AiOutlineCloudDownload className="mr-1" />
                    <span>{resource.downloads} downloads</span>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t border-neutral-700 pt-4 flex justify-between">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditResource(resource.id)}
                      className="p-2 bg-neutral-700 rounded-md hover:bg-neutral-600 transition"
                      title="Edit resource"
                    >
                      <AiOutlineEdit className="w-4 h-4 text-neutral-300" />
                    </button>
                    <button 
                      onClick={() => handleDeleteResource(resource.id)}
                      className="p-2 bg-neutral-700 rounded-md hover:bg-neutral-600 transition"
                      title="Delete resource"
                    >
                      <AiOutlineDelete className="w-4 h-4 text-neutral-300" />
                    </button>
                  </div>
                  <button 
                    onClick={() => copyResourceLink(resource.id)}
                    className="p-2 bg-blue-900/20 rounded-md hover:bg-blue-800/30 transition flex items-center text-xs text-blue-400"
                    title="Copy resource link"
                  >
                    <AiOutlineLink className="w-4 h-4 mr-1" />
                    <span>Copy Link</span>
                  </button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResourcesManagement; 