import { PrismaClient } from '@prisma/client';
import { generateSongSlug, generatePlaylistSlug, ensureUniqueSlug } from '../../lib/utils/slug-generator';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration to add slugs to songs and playlists...');

  // Get all songs without slugs
  const songs = await prisma.song.findMany();
  console.log(`Found ${songs.length} songs to update`);

  // Get all playlists without slugs
  const playlists = await prisma.playlist.findMany({
    where: {
      OR: [
        { slug: { equals: "" } },
        { slug: { equals: undefined } }
      ]
    }
  });
  console.log(`Found ${playlists.length} playlists to update`);

  // Update songs with slugs
  for (const song of songs) {
    const baseSlug = generateSongSlug(song.title, song.artist);
    
    // Check if slug exists
    const slugExists = async (slug: string) => {
      const existing = await prisma.song.findUnique({
        where: { slug }
      });
      return !!existing;
    };
    
    const uniqueSlug = await ensureUniqueSlug(baseSlug, slugExists);
    
    await prisma.song.update({
      where: { id: song.id },
      data: { slug: uniqueSlug }
    });
    
    console.log(`Updated song: ${song.title} by ${song.artist} with slug: ${uniqueSlug}`);
  }

  // Update playlists with slugs
  for (const playlist of playlists) {
    const baseSlug = generatePlaylistSlug(playlist.name);
    
    // Check if slug exists
    const slugExists = async (slug: string) => {
      const existing = await prisma.playlist.findUnique({
        where: { slug }
      });
      return !!existing;
    };
    
    const uniqueSlug = await ensureUniqueSlug(baseSlug, slugExists);
    
    await prisma.playlist.update({
      where: { id: playlist.id },
      data: { slug: uniqueSlug }
    });
    
    console.log(`Updated playlist: ${playlist.name} with slug: ${uniqueSlug}`);
  }

  console.log('Migration completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 