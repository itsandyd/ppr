'use client';

import { useState, useEffect } from 'react';
import { User } from "@clerk/nextjs/server";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  createdAt: string;
}

const ListingsManagement: React.FC<ListingsManagementProps> = ({
  currentUser
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('/api/coaching/listings');
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
        toast.error('Failed to load your listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
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
        await axios.delete(`/api/coaching/listings/${listingId}`);
        setListings(prevListings => prevListings.filter(listing => listing.id !== listingId));
        toast.success('Listing deleted successfully');
        router.refresh();
      } catch (error) {
        console.error('Error deleting listing:', error);
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
          size="sm"
          onClick={handleCreateListing}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <AiOutlinePlus size={16} />
          Create New Listing
        </Button>
      </div>

      {isLoading ? (
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="flex items-center justify-center p-12">
            <p className="text-neutral-400">Loading your listings...</p>
          </CardContent>
        </Card>
      ) : listings.length === 0 ? (
        <Card className="bg-neutral-800 border-neutral-700">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <p className="text-neutral-400 mb-4">You don&apos;t have any listings yet</p>
            <Button 
              onClick={handleCreateListing}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <AiOutlinePlus size={16} />
              Create Your First Listing
            </Button>
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
                    src={listing.imageSrc || '/images/coaching-placeholder.jpg'}
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
                      size="sm"
                      onClick={() => handleEditListing(listing.id)}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <AiOutlineEdit size={16} />
                      Edit
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteListing(listing.id)}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <AiOutlineDelete size={16} />
                      Delete
                    </Button>
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