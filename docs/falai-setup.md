# Setting Up Fal.ai for Video Generation

This document explains how to set up Fal.ai's FFmpeg API for video generation in the course platform.

## Getting an API Key

1. Create an account at [Fal.ai](https://fal.ai/)
2. Go to your account settings and navigate to the API Keys section
3. Generate a new API key
4. Copy the API key and add it to your `.env` file as `FAL_API_KEY`

## How It Works

The platform uses Fal.ai's FFmpeg API to:

1. Take the audio generated from Eleven Labs (from chapter text)
2. Combine it with the course cover image
3. Create a professional-looking video for the course chapter

## API Request Structure

The API request to Fal.ai follows this structure:

```json
{
  "input": {
    "tracks": [
      {
        "id": "image-track",
        "type": "video",
        "keyframes": [
          {
            "timestamp": 0,
            "duration": 10000, // 10 seconds
            "url": "https://your-image-url.jpg"
          }
        ]
      },
      {
        "id": "audio-track",
        "type": "audio",
        "keyframes": [
          {
            "timestamp": 0,
            "duration": 10000, // 10 seconds
            "url": "https://your-audio-url.mp3"
          }
        ]
      }
    ]
  }
}
```

## Response Structure

The API response from Fal.ai includes:

```json
{
  "video_url": "https://fal.ai/generated-video.mp4",
  "thumbnail_url": "https://fal.ai/generated-thumbnail.jpg"
}
```

## Usage Limits

Check the Fal.ai pricing page for current usage limits based on your subscription plan.
