'use client';

import { useState, useEffect } from 'react';
import { User } from "@clerk/nextjs/server";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/coaching/Button';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import Image from 'next/image';

interface ListingsManagementProps {
  currentUser: User;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  imageSrc: string;
  category: string;
}

const ListingsManagement: React.FC<ListingsManagementProps> = ({
  currentUser
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);

  // Mock listings for demonstration
  const mockListings: Listing[] = [
    {
      id: '1',
      title: 'Music Production Coaching',
      description: 'Learn advanced music production techniques',
      price: 50,
      imageSrc: '/images/coaching-placeholder.jpg',
      category: 'Music Production'
    },
    {
      id: '2',
      title: 'Mixing Masterclass',
      description: 'Master the art of professional mixing',
      price: 75,
      imageSrc: '/images/coaching-placeholder.jpg',
      category: 'Mixing'
    }
  ];

  useEffect(() => {
    // In a real app, you would fetch the coach's listings from the server
    // For this demo, we'll use the mock data
    setListings(mockListings);
  }, []);

  const handleCreateListing = () => {
    router.push('/coaching/create-listing');
  };

  const handleEditListing = (listingId: string) => {
    router.push(`/coaching/edit-listing/${listingId}`);
  };

  const handleDeleteListing = async (listingId: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setIsLoading(true);
      
      try {
        // Here you would make an API call to delete the listing
        // For demo purposes, we'll just simulate it client-side
        await new Promise(resolve => setTimeout(resolve, 1000));
        setListings(prevListings => prevListings.filter(listing => listing.id !== listingId));
        
        toast.success('Listing deleted successfully');
      } catch (error) {
        toast.error('Failed to delete listing');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Your Listings</h2>
        <Button 
          small
          label="Create New Listing"
          onClick={handleCreateListing}
          disabled={isLoading}
          icon={AiOutlinePlus}
        />
      </div>

      {listings.length === 0 ? (
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <p className="text-neutral-400 mb-4">You don&apos;t have any listings yet</p>
            <Button 
              label="Create Your First Listing"
              onClick={handleCreateListing}
              disabled={isLoading}
              icon={AiOutlinePlus}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {listings.map((listing) => (
            <Card key={listing.id} className="bg-neutral-800 border-neutral-700 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-1/3 md:max-w-[200px]">
                  <Image
                    fill
                    src={listing.imageSrc}
                    alt={listing.title}
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{listing.title}</h3>
                      <p className="text-neutral-300 text-sm mt-1">Category: {listing.category}</p>
                    </div>
                    <div className="text-lg font-bold text-white">
                      ${listing.price} <span className="text-sm font-normal text-neutral-400">/ hour</span>
                    </div>
                  </div>
                  <p className="mt-4 text-neutral-400">{listing.description}</p>
                  <div className="mt-6 flex space-x-3">
                    <Button 
                      small
                      label="Edit"
                      onClick={() => handleEditListing(listing.id)}
                      disabled={isLoading}
                      icon={AiOutlineEdit}
                    />
                    <Button 
                      small
                      label="Delete"
                      onClick={() => handleDeleteListing(listing.id)}
                      disabled={isLoading}
                      outline
                      icon={AiOutlineDelete}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingsManagement; 