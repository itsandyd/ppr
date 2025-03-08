import { PrismaClient } from '@prisma/client';
import { generateSongSlug, generatePlaylistSlug, ensureUniqueSlug } from '../lib/utils/slug-generator';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting script to fix missing slugs...');

  try {
    // Find all songs without slugs
    const songs = await prisma.$queryRaw`
      SELECT id, title, artist FROM Song WHERE slug IS NULL OR slug = '';
    `;
    console.log(`Found ${Array.isArray(songs) ? songs.length : 0} songs to update`);

    // Update songs with slugs
    for (const song of (Array.isArray(songs) ? songs : [])) {
      try {
        const baseSlug = generateSongSlug(song.title, song.artist);
        
        // Check if slug exists
        const slugExists = async (slug: string) => {
          const existing = await prisma.song.findFirst({
            where: { 
              slug,
              id: { not: song.id }
            }
          });
          return !!existing;
        };
        
        const uniqueSlug = await ensureUniqueSlug(baseSlug, slugExists);
        
        // Update the song with the new slug
        await prisma.$executeRaw`
          UPDATE Song SET slug = ${uniqueSlug} WHERE id = ${song.id};
        `;
        
        console.log(`Updated song: ${song.title} by ${song.artist} with slug: ${uniqueSlug}`);
      } catch (error) {
        console.error(`Error updating song ${song.id}:`, error);
      }
    }

    // Find all playlists without slugs
    const playlists = await prisma.$queryRaw`
      SELECT id, name FROM Playlist WHERE slug IS NULL OR slug = '';
    `;
    console.log(`Found ${Array.isArray(playlists) ? playlists.length : 0} playlists to update`);

    // Update playlists with slugs
    for (const playlist of (Array.isArray(playlists) ? playlists : [])) {
      try {
        const baseSlug = generatePlaylistSlug(playlist.name);
        
        // Check if slug exists
        const slugExists = async (slug: string) => {
          const existing = await prisma.playlist.findFirst({
            where: { 
              slug,
              id: { not: playlist.id }
            }
          });
          return !!existing;
        };
        
        const uniqueSlug = await ensureUniqueSlug(baseSlug, slugExists);
        
        // Update the playlist with the new slug
        await prisma.$executeRaw`
          UPDATE Playlist SET slug = ${uniqueSlug} WHERE id = ${playlist.id};
        `;
        
        console.log(`Updated playlist: ${playlist.name} with slug: ${uniqueSlug}`);
      } catch (error) {
        console.error(`Error updating playlist ${playlist.id}:`, error);
      }
    }

    // Add default values to the schema
    console.log('Adding default values to the schema...');
    await prisma.$executeRaw`
      ALTER TABLE Song MODIFY COLUMN slug VARCHAR(191) NOT NULL DEFAULT (UUID());
    `;
    await prisma.$executeRaw`
      ALTER TABLE Playlist MODIFY COLUMN slug VARCHAR(191) NOT NULL DEFAULT (UUID());
    `;

    console.log('Script completed successfully!');
  } catch (error) {
    console.error('Error during script execution:', error);
  }
}

main()
  .catch((e) => {
    console.error('Error during script execution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 