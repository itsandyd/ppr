import { PrismaClient } from '@prisma/client';
import { generateSongSlug, generatePlaylistSlug, ensureUniqueSlug } from './slug-generator';

const prisma = new PrismaClient();

/**
 * Generates a unique slug for a song
 * @param title The song title
 * @param artist The song artist
 * @param currentId Optional current song ID (for updates)
 * @returns A unique slug
 */
export async function generateUniqueSongSlug(
  title: string, 
  artist: string,
  currentId?: string
): Promise<string> {
  const baseSlug = generateSongSlug(title, artist);
  
  const slugExists = async (slug: string) => {
    const where: any = { slug };
    
    // If updating an existing song, exclude it from the check
    if (currentId) {
      where.id = { not: currentId };
    }
    
    const existing = await prisma.song.findFirst({ where });
    return !!existing;
  };
  
  return ensureUniqueSlug(baseSlug, slugExists);
}

/**
 * Generates a unique slug for a playlist
 * @param name The playlist name
 * @param currentId Optional current playlist ID (for updates)
 * @returns A unique slug
 */
export async function generateUniquePlaylistSlug(
  name: string,
  currentId?: string
): Promise<string> {
  const baseSlug = generatePlaylistSlug(name);
  
  const slugExists = async (slug: string) => {
    const where: any = { slug };
    
    // If updating an existing playlist, exclude it from the check
    if (currentId) {
      where.id = { not: currentId };
    }
    
    const existing = await prisma.playlist.findFirst({ where });
    return !!existing;
  };
  
  return ensureUniqueSlug(baseSlug, slugExists);
}

/**
 * Middleware function to automatically generate slugs for songs before creation
 * @param data The song data
 * @returns The song data with a slug
 */
export async function withSongSlug(data: any, currentId?: string): Promise<any> {
  // If slug is already provided, use it
  if (data.slug) {
    return data;
  }
  
  // Generate a slug based on title and artist
  const slug = await generateUniqueSongSlug(
    data.title, 
    data.artist || 'Unknown Artist',
    currentId
  );
  
  return {
    ...data,
    slug
  };
}

/**
 * Middleware function to automatically generate slugs for playlists before creation
 * @param data The playlist data
 * @returns The playlist data with a slug
 */
export async function withPlaylistSlug(data: any, currentId?: string): Promise<any> {
  // If slug is already provided, use it
  if (data.slug) {
    return data;
  }
  
  // Generate a slug based on name
  const slug = await generateUniquePlaylistSlug(data.name, currentId);
  
  return {
    ...data,
    slug
  };
} 