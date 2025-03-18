# Setting Up Eleven Labs for Video Generation

This document explains how to set up Eleven Labs for generating videos with AI voiceover in the course platform.

## Getting an API Key

1. Create an account at [Eleven Labs](https://elevenlabs.io/)
2. Go to your profile settings and navigate to the API section
3. Generate a new API key
4. Copy the API key and add it to your `.env` file as `ELEVEN_LABS_API_KEY`

## Finding Voice IDs

1. Go to the [Eleven Labs Voice Library](https://elevenlabs.io/voice-library)
2. Browse available voices or create your own custom voice
3. When you find a voice you like, click on it to view details
4. Copy the Voice ID from the URL or details page
5. Add the Voice ID to your `.env` file as `ELEVEN_LABS_VOICE_ID`

## Implementation Details

The platform uses Eleven Labs to:

1. Convert chapter text content to speech audio
2. Combine the audio with the course cover image to create a video
3. Store the resulting video for use in the course chapter

The process is handled through two API endpoints:

- `/api/elevenlabs` - Converts text to speech
- `/api/video-generator` - Combines audio with cover image to create a video

## Usage Limits

Note that Eleven Labs has usage limits based on your subscription plan:

- Free tier: Limited character count per month
- Paid tiers: Higher character limits and priority processing

Make sure to check your usage in the Eleven Labs dashboard.
