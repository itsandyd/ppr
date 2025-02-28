# Social Media OAuth Integration Guide

This guide explains how to set up real OAuth integrations with various social media platforms for the Follow Gate feature.

## Overview

The Follow Gate feature allows resource creators to require users to follow, like, or subscribe to their social media accounts before accessing resources. This implementation uses real OAuth authentication flows to verify these actions.

## Prerequisites

1. Developer accounts for each platform you want to integrate with
2. A publicly accessible URL for your application (for development, you can use a service like ngrok)

## Setting Up Social Media Applications

### Instagram

1. Go to the [Facebook Developer Portal](https://developers.facebook.com/)
2. Create a new app (choose "Consumer" type)
3. Add the Instagram Basic Display product
4. Configure your app's settings:
   - Add your app's Privacy Policy URL
   - Add your app's Terms of Service URL
   - Set your app status to "Live"
5. In the Instagram Basic Display settings:
   - Add your OAuth Redirect URL: `https://your-domain.com/api/auth/callback/instagram`
   - Request the `user_profile` and `user_media` permissions
6. Note your Instagram App ID and App Secret

### Twitter

1. Go to the [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new project and app
3. Go to the app settings and configure:
   - Enable OAuth 2.0
   - Set the redirect URL: `https://your-domain.com/api/auth/callback/twitter`
   - Request the `tweet.read`, `users.read`, and `follows.read` scopes
4. Note your OAuth 2.0 Client ID and Client Secret

### Spotify

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Create a new app
3. Set the redirect URI: `https://your-domain.com/api/auth/callback/spotify`
4. Note your Client ID and Client Secret

### YouTube/Google

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the YouTube Data API v3
4. Configure the OAuth consent screen
5. Create OAuth 2.0 credentials:
   - Set the redirect URI: `https://your-domain.com/api/auth/callback/google`
   - Request the `https://www.googleapis.com/auth/youtube.readonly` scope
6. Note your Client ID and Client Secret

### Facebook

1. Go to the [Facebook Developer Portal](https://developers.facebook.com/)
2. Create a new app (choose "Consumer" type)
3. Add the Facebook Login product
4. Configure your app's settings:
   - Add your OAuth Redirect URL: `https://your-domain.com/api/auth/callback/facebook`
   - Request the `email` and `public_profile` permissions
5. Note your App ID and App Secret

### Twitch

1. Go to the [Twitch Developer Console](https://dev.twitch.tv/console)
2. Create a new application
3. Set the OAuth Redirect URL: `https://your-domain.com/api/auth/callback/twitch`
4. Note your Client ID and Client Secret

### SoundCloud

1. Go to the [SoundCloud Developer Portal](https://developers.soundcloud.com/)
2. Create a new app
3. Set the redirect URI: `https://your-domain.com/api/auth/callback/soundcloud`
4. Note your Client ID and Client Secret

## Environment Configuration

1. Copy the `.env.local.example` file to `.env.local`
2. Fill in the credentials for each platform:

```
# Instagram/Facebook
NEXT_PUBLIC_INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Twitter
NEXT_PUBLIC_TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# YouTube/Google
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Spotify
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Twitch
NEXT_PUBLIC_TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret

# SoundCloud
NEXT_PUBLIC_SOUNDCLOUD_CLIENT_ID=your_soundcloud_client_id
SOUNDCLOUD_CLIENT_SECRET=your_soundcloud_client_secret

# Application URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Implementation Notes

### Action Verification

The current implementation verifies that the user has authenticated with the platform but uses mock verification for the actual follow/like actions. This is because:

1. Some platforms limit API access for checking follower relationships
2. For platforms like Instagram, business/creator accounts are required to verify follows
3. Some actions like "likes" may require additional permissions or API endpoints

To implement full verification, you'll need to:

1. Request appropriate additional permissions from each platform
2. Update the callback handlers to call the specific API endpoints for verification
3. For Instagram follows, the account being followed needs to be a Business or Creator account connected to your app

### Security Considerations

1. Always use HTTPS in production
2. Implement CSRF protection with the state parameter (already included)
3. Store sensitive keys as environment variables
4. Consider implementing a proper PKCE flow for more security
5. Add rate limiting to prevent abuse

## Testing the Integration

1. Create a resource with Follow Gate requirements
2. Test the flow as a user
3. Check the server logs to see the authentication responses
4. Verify that cookies are set correctly to remember completed requirements
