import axios from 'axios';

// Discord API base URL
const DISCORD_API = 'https://discord.com/api/v10';

// Your Discord server configuration
// These will come from environment variables
const DISCORD_SERVER_ID = process.env.DISCORD_SERVER_ID;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const COACHING_CATEGORY_ID = process.env.DISCORD_COACHING_CATEGORY_ID;

// Role IDs
const COACHING_CLIENT_ROLE_ID = process.env.DISCORD_COACHING_CLIENT_ROLE_ID;

interface DiscordMember {
  user: {
    id: string;
    username: string;
    discriminator: string;
    global_name?: string;
  };
  roles: string[];
}

/**
 * Check if a user with the given Discord ID is a member of our Discord server
 */
export async function verifyDiscordMember(discordId: string): Promise<{ isValid: boolean; }> {
  try {
    // Check if they're in our server using bot token
    const memberResponse = await axios.get(
      `${DISCORD_API}/guilds/${DISCORD_SERVER_ID}/members/${discordId}`,
      {
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      }
    );

    return { isValid: memberResponse.status === 200 };
  } catch (error) {
    console.error('Error verifying Discord member:', error);
    return { isValid: false };
  }
}

/**
 * Assign the coaching client role to a user
 */
export async function assignCoachingRole(discordId: string): Promise<boolean> {
  try {
    await axios.put(
      `${DISCORD_API}/guilds/${DISCORD_SERVER_ID}/members/${discordId}/roles/${COACHING_CLIENT_ROLE_ID}`,
      {},
      {
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return true;
  } catch (error) {
    console.error('Error assigning coaching role:', error);
    return false;
  }
}

/**
 * Create a private coaching channel for a specific session
 */
export async function createCoachingChannel(
  clientDiscordId: string, 
  coachDiscordId: string, 
  sessionId: string,
  sessionDate: Date
): Promise<{ success: boolean; channelId?: string }> {
  try {
    // Format the channel name
    const formattedDate = sessionDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const channelName = `coaching-${formattedDate}-${sessionId.substring(0, 6)}`;
    
    // Create a private channel in the coaching category
    const channelResponse = await axios.post(
      `${DISCORD_API}/guilds/${DISCORD_SERVER_ID}/channels`,
      {
        name: channelName,
        type: 0, // Text channel
        parent_id: COACHING_CATEGORY_ID,
        permission_overwrites: [
          // Default permissions - deny access to everyone
          {
            id: DISCORD_SERVER_ID, // @everyone role
            type: 0, // role
            deny: '1024', // VIEW_CHANNEL
          },
          // Allow the client
          {
            id: clientDiscordId,
            type: 1, // member
            allow: '1024', // VIEW_CHANNEL
          },
          // Allow the coach
          {
            id: coachDiscordId,
            type: 1, // member
            allow: '1024', // VIEW_CHANNEL
          },
        ],
      },
      {
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return { 
      success: true, 
      channelId: channelResponse.data.id 
    };
  } catch (error) {
    console.error('Error creating coaching channel:', error);
    return { success: false };
  }
}

/**
 * Schedule deletion of channel permissions for a user after their session ends
 */
export async function scheduleChannelAccess(
  channelId: string,
  discordId: string,
  endTime: Date
): Promise<boolean> {
  // Calculate the delay until the session ends
  const now = new Date();
  const delay = endTime.getTime() - now.getTime();
  
  // Schedule the permission removal
  setTimeout(async () => {
    try {
      // Remove user's permission by setting permissions to deny view
      await axios.put(
        `${DISCORD_API}/channels/${channelId}/permissions/${discordId}`,
        {
          type: 1, // member
          deny: '1024', // VIEW_CHANNEL
          allow: '0',
        },
        {
          headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log(`Removed access for user ${discordId} to channel ${channelId}`);
    } catch (error) {
      console.error('Error removing channel access:', error);
    }
  }, delay);
  
  return true;
}

/**
 * Add a coach message to a channel with session details
 */
export async function sendSessionWelcomeMessage(
  channelId: string,
  coachName: string,
  sessionTime: Date,
  duration: number = 60
): Promise<boolean> {
  try {
    const formattedTime = sessionTime.toLocaleTimeString('en-US', {
      hour: '2-digit', 
      minute: '2-digit',
      timeZoneName: 'short'
    });
    
    const message = `
# Welcome to your coaching session!

👨‍🏫 **Coach**: ${coachName}
🕒 **Time**: ${formattedTime}
⏱️ **Duration**: ${duration} minutes

Your coach will meet you here at the scheduled time. This channel will remain accessible for 15 minutes after your session ends.

Please have your questions ready and any materials you'd like to discuss!
    `;
    
    await axios.post(
      `${DISCORD_API}/channels/${channelId}/messages`,
      {
        content: message,
      },
      {
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return true;
  } catch (error) {
    console.error('Error sending welcome message:', error);
    return false;
  }
} 