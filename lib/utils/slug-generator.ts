/**
 * Utility functions for generating slugs
 */

/**
 * Generates a slug from a string by:
 * 1. Converting to lowercase
 * 2. Removing special characters
 * 3. Replacing spaces with hyphens
 * 4. Removing consecutive hyphens
 * 5. Trimming hyphens from start and end
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace consecutive hyphens with a single hyphen
    .trim()                   // Trim whitespace
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
}

/**
 * Generates a slug for a song by combining title and artist
 */
export function generateSongSlug(title: string, artist: string): string {
  const baseSlug = `${title}-${artist}`;
  return generateSlug(baseSlug);
}

/**
 * Generates a slug for a playlist from its name
 */
export function generatePlaylistSlug(name: string): string {
  return generateSlug(name);
}

/**
 * Ensures a slug is unique by appending a random string if needed
 * @param slug The base slug
 * @param exists A function that checks if the slug already exists
 * @returns A unique slug
 */
export async function ensureUniqueSlug(
  slug: string, 
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  // Check if the slug already exists
  const slugExists = await exists(slug);
  
  if (!slugExists) {
    return slug;
  }
  
  // If the slug exists, append a random string
  const randomString = Math.random().toString(36).substring(2, 7);
  const uniqueSlug = `${slug}-${randomString}`;
  
  // Recursively check if the new slug is unique
  return ensureUniqueSlug(uniqueSlug, exists);
} 