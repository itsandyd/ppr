import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

async function generateSoundSlugs() {
  try {
    // Get all sounds without slugs (empty string)
    const sounds = await db.sounds.findMany({
      where: {
        slug: ""
      }
    });

    console.log(`Found ${sounds.length} sounds without slugs`);

    for (const sound of sounds) {
      // Generate base slug from name
      let baseSlug = slugify(sound.name);
      let slug = baseSlug;
      let counter = 1;

      // Keep trying until we find a unique slug
      while (true) {
        const existing = await db.sounds.findUnique({
          where: { slug }
        });

        if (!existing) break;

        // If slug exists, append counter
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Update the sound with the unique slug
      await db.sounds.update({
        where: { id: sound.id },
        data: { slug }
      });

      console.log(`Updated sound "${sound.name}" with slug "${slug}"`);
    }

    console.log('Finished generating slugs');
  } catch (error) {
    console.error('Error generating slugs:', error);
  }
}

generateSoundSlugs(); 