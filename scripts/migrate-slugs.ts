import { PrismaClient } from '@prisma/client';
import { generateSongSlug, generatePlaylistSlug, ensureUniqueSlug } from '../lib/utils/slug-generator';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration to add slugs to songs and playlists...');

  // First, run the Prisma migration to add the slug fields
  console.log('Running Prisma migration...');
  // Note: You should run this manually: npx prisma migrate dev --name add-slugs-to-songs-and-playlists

  try {
    // Get all songs without slugs - this will work after the migration is applied
    const songs = await prisma.song.findMany();
    console.log(`Found ${songs.length} songs to update`);

    // Update songs with slugs
    for (const song of songs) {
      try {
        const baseSlug = generateSongSlug(song.title, song.artist);
        
        // Check if slug exists
        const slugExists = async (slug: string) => {
          const existing = await prisma.song.findFirst({
            where: { 
              slug,
              id: { not: song.id } // Exclude current song
            }
          });
          return !!existing;
        };
        
        const uniqueSlug = await ensureUniqueSlug(baseSlug, slugExists);
        
        await prisma.song.update({
          where: { id: song.id },
          data: { slug: uniqueSlug }
        });
        
        console.log(`Updated song: ${song.title} by ${song.artist} with slug: ${uniqueSlug}`);
      } catch (error) {
        console.error(`Error updating song ${song.id}:`, error);
      }
    }

    // Get all playlists with null slugs
    const playlists = await prisma.playlist.findMany({
      where: {
        OR: [
          { slug: { equals: "" } },
          { slug: { equals: undefined } }
        ]
      }
    });
    console.log(`Found ${playlists.length} playlists to update`);

    // Update playlists with slugs
    for (const playlist of playlists) {
      try {
        const baseSlug = generatePlaylistSlug(playlist.name);
        
        // Check if slug exists
        const slugExists = async (slug: string) => {
          const existing = await prisma.playlist.findFirst({
            where: { 
              slug,
              id: { not: playlist.id } // Exclude current playlist
            }
          });
          return !!existing;
        };
        
        const uniqueSlug = await ensureUniqueSlug(baseSlug, slugExists);
        
        await prisma.playlist.update({
          where: { id: playlist.id },
          data: { slug: uniqueSlug }
        });
        
        console.log(`Updated playlist: ${playlist.name} with slug: ${uniqueSlug}`);
      } catch (error) {
        console.error(`Error updating playlist ${playlist.id}:`, error);
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

main()
  .catch((e) => {
    console.error('Error during migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 