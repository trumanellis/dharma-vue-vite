// File: src/models/UserProfile.js

/**
 * Creates a new user profile
 * 
 * @param {Object} profileData User profile data
 * @param {string} profileData.id Unique identifier (typically from OrbitDB identity)
 * @param {string} profileData.name Display name
 * @returns {Object} New user profile
 */
export const createUserProfile = (profileData) => {
  return {
    _id: profileData.id, // Use OrbitDB identity ID as the primary key
    name: profileData.name || 'Anonymous',
    aliases: profileData.aliases || [],
    profile_data: profileData.profile_data || {
      bio: '',
      avatar: '',
    },
    attention_switch_events: [],
    total_gratitude: 0,
    created_at: Date.now(),
    updated_at: Date.now()
  }
}

/**
 * Records an attention switch event for a user
 * 
 * @param {Object} profile The user profile
 * @param {string} taskId The ID of the task involved
 * @param {string} eventType Either 'Start' or 'Stop'
 * @returns {Object} Updated profile with the new attention event
 */
export const recordAttentionEvent = (profile, taskId, eventType) => {
  if (!['Start', 'Stop'].includes(eventType)) {
    throw new Error('Event type must be either "Start" or "Stop"')
  }
  
  const updatedProfile = { ...profile }
  
  // Add the new attention event
  const newEvent = {
    task_id: taskId,
    timestamp: Date.now(),
    event_type: eventType
  }
  
  updatedProfile.attention_switch_events = [
    ...(updatedProfile.attention_switch_events || []),
    newEvent
  ]
  
  updatedProfile.updated_at = Date.now()
  return updatedProfile
}

/**
 * Adds gratitude to a user's total
 * 
 * @param {Object} profile The user profile
 * @param {number} amount Amount of gratitude to add
 * @returns {Object} Updated profile with increased gratitude
 */
export const addGratitude = (profile, amount) => {
  if (typeof amount !== 'number' || amount <= 0) {
    throw new Error('Gratitude amount must be a positive number')
  }
  
  return {
    ...profile,
    total_gratitude: (profile.total_gratitude || 0) + amount,
    updated_at: Date.now()
  }
}

/**
 * Updates a user's profile information
 * 
 * @param {Object} profile The current profile
 * @param {Object} updates The updates to apply
 * @returns {Object} Updated profile
 */
export const updateProfileInfo = (profile, updates) => {
  // Only allow updating certain fields
  const allowedUpdates = ['name', 'aliases', 'profile_data']
  
  const sanitizedUpdates = Object.keys(updates)
    .filter(key => allowedUpdates.includes(key))
    .reduce((obj, key) => {
      obj[key] = updates[key]
      return obj
    }, {})
  
  return {
    ...profile,
    ...sanitizedUpdates,
    updated_at: Date.now()
  }
}

/**
 * Formats the total gratitude into a human-readable string
 * 
 * @param {number} minutes Total gratitude in minutes
 * @returns {string} Formatted gratitude string (e.g., "1h 30m")
 */
export const formatGratitude = (minutes) => {
  if (!minutes || minutes <= 0) return '0m'
  
  const days = Math.floor(minutes / (24 * 60))
  const hours = Math.floor((minutes % (24 * 60)) / 60)
  const remainingMinutes = Math.floor(minutes % 60)
  
  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (remainingMinutes > 0) parts.push(`${remainingMinutes}m`)
  
  return parts.join(' ')
}
