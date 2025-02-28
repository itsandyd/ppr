# Clerk Social Authentication for Follow Gate

This document explains how to set up Clerk for social authentication in the Follow Gate feature.

## Overview

The Follow Gate feature has been upgraded to use Clerk for social authentication. This provides several benefits:

1. **Streamlined Authentication**: Uses the same auth system as the rest of the application
2. **Secure OAuth Flow**: Clerk handles the OAuth flow securely
3. **Multiple Platform Support**: Easy integration with Instagram, Twitter, Facebook, etc.
4. **Session Management**: Clerk manages user sessions

## Setup Instructions

### 1. Configure Social Connections in Clerk Dashboard

You'll need to enable and configure the social connections in your Clerk dashboard:

1. Log in to your [Clerk Dashboard](https://dashboard.clerk.dev/)
2. Go to **User & Authentication** > **Social Connections**
3. Enable the following social connections:
   - Facebook (for both Facebook and Instagram authentication)
   - Twitter
   - Google (for YouTube)
   - Spotify
   - Twitch
   - SoundCloud
4. For each platform, provide the appropriate OAuth credentials:
   - Client ID
   - Client Secret
   - Redirect URI (should be `https://your-domain.com/api/clerk/callback`)

### 2. Configure Environment Variables

Ensure your application has the necessary Clerk environment variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

### 3. Platform-Specific Requirements

#### Instagram (via Facebook)

- **Important**: Instagram authentication is handled through Facebook in Clerk
- Setup steps:
  1. Create a Facebook Developer account if you don't have one
  2. Create a Facebook App with the "Consumer" app type
  3. Add the "Instagram Basic Display" product to your app
  4. Configure your app to request these permissions:
     - `email`
     - `public_profile`
     - `instagram_basic`
     - `instagram_graph_user_profile`
  5. Use this Facebook app in your Clerk configuration
- Make sure your app is in Live mode, not Development mode
- Facebook may require App Review for some permissions

#### Twitter

- Requires the `tweet.read`, `users.read`, and `follows.read` scopes

#### YouTube (Google)

- Requires the `https://www.googleapis.com/auth/youtube.readonly` scope

#### Facebook

- Requires the `email` and `public_profile` permissions

#### Spotify

- Requires the `user-follow-read` scope

#### Twitch

- Requires the `user:read:follows` scope

### 4. Implementation Notes

Our implementation includes:

1. **ClerkSocialAuthGate Component**: Replaces the previous SocialAuthGate component
2. **API Routes**:

   - `/api/clerk/callback`: Handles OAuth callbacks
   - `/api/verify-social-action`: Verifies social actions (follow, like)
   - `/api/verify-social-action/status`: Gets verification status

3. **Verification Logic**:
   - The current implementation uses cookies to remember verified platforms
   - In a production environment, you should store this information in a database

## Verification Limitations

This implementation simplifies the verification process:

1. It only verifies that the user has authenticated with the platform
2. It does not make API calls to verify follows/likes (marked as TODOs in code)
3. Some platforms have API limitations for verifying actions (noted in code comments)

To implement full verification, you would need to use the platform-specific APIs with the OAuth tokens provided by Clerk.

## Security Considerations

1. Always use HTTPS in production
2. Store verification status in a database rather than cookies for production
3. Implement proper error handling and rate limiting
4. Consider adding additional user verification steps for high-value resources

## Getting Help

If you encounter issues:

1. Check the Clerk documentation: https://clerk.com/docs
2. Verify OAuth credentials in the Clerk dashboard
3. Check browser console and server logs for errors
