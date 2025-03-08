# Slug Implementation for Songs and Playlists

This document explains how to implement and use the slug functionality for Songs and Playlists.

## Overview

We've added a `slug` field to both the `Song` and `Playlist` models in the database schema. These slugs are generated based on:

- For Songs: A combination of the song title and artist
- For Playlists: The playlist name

The slugs are URL-friendly strings that can be used in routes, making them more readable and SEO-friendly.

## Implementation Steps

### 1. Schema Changes

The Prisma schema has been updated to include a required `slug` field for both models:

```prisma
model Song {
  id        String         @id @default(uuid())
  title     String
  artist    String         @default("Unknown Artist")
  slug      String         @unique
  // ... other fields
}

model Playlist {
  id        String         @id @default(uuid())
  name      String
  slug      String         @unique
  // ... other fields
}
```

### 2. Migration

To apply these changes to your database, run:

```bash
npx prisma migrate dev --name add-slugs-to-songs-and-playlists
```

### 3. Generating Slugs for Existing Data

After applying the migration, you need to generate slugs for existing songs and playlists. Run:

```bash
npx ts-node scripts/migrate-slugs.ts
```

This script will:

1. Find all songs and playlists
2. Generate appropriate slugs for each
3. Update the database records

### 4. Using Slug Generation in Your Code

For new songs and playlists, you should use the utility functions to automatically generate slugs:

```typescript
import { withSongSlug, withPlaylistSlug } from "@/lib/utils/auto-slug";

// When creating a new song
const songData = {
  title: "My New Song",
  artist: "Artist Name",
  // ... other fields
};

// Add a slug automatically
const dataWithSlug = await withSongSlug(songData);
const newSong = await prisma.song.create({
  data: dataWithSlug,
});

// When creating a new playlist
const playlistData = {
  name: "My Playlist",
  // ... other fields
};

// Add a slug automatically
const dataWithSlug = await withPlaylistSlug(playlistData);
const newPlaylist = await prisma.playlist.create({
  data: dataWithSlug,
});
```

### 5. Updating Existing Records

When updating a song or playlist that might change the title, artist, or name, you should regenerate the slug:

```typescript
// When updating a song
const songData = {
  title: "Updated Song Title",
  // ... other fields
};

// Regenerate the slug if title or artist changed
const dataWithSlug = await withSongSlug(songData, songId);
const updatedSong = await prisma.song.update({
  where: { id: songId },
  data: dataWithSlug,
});

// When updating a playlist
const playlistData = {
  name: "Updated Playlist Name",
  // ... other fields
};

// Regenerate the slug if name changed
const dataWithSlug = await withPlaylistSlug(playlistData, playlistId);
const updatedPlaylist = await prisma.playlist.update({
  where: { id: playlistId },
  data: dataWithSlug,
});
```

## Using Slugs in Routes

You can now use slugs in your routes for better SEO and readability:

```typescript
// Before
app.get("/songs/:id", (req, res) => {
  // Get song by ID
});

// After
app.get("/songs/:slug", (req, res) => {
  // Get song by slug
  const song = await prisma.song.findUnique({
    where: { slug: req.params.slug },
  });
});
```

## Utility Functions

The following utility functions are available:

- `generateSlug(text)`: Converts any text to a URL-friendly slug
- `generateSongSlug(title, artist)`: Generates a slug for a song
- `generatePlaylistSlug(name)`: Generates a slug for a playlist
- `ensureUniqueSlug(slug, existsFunction)`: Ensures a slug is unique
- `generateUniqueSongSlug(title, artist, currentId?)`: Generates a unique slug for a song
- `generateUniquePlaylistSlug(name, currentId?)`: Generates a unique slug for a playlist
- `withSongSlug(data, currentId?)`: Adds a slug to song data
- `withPlaylistSlug(data, currentId?)`: Adds a slug to playlist data
