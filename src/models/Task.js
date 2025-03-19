// File: src/models/Task.js

// Task statuses
export const TASK_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed'
}

/**
 * Creates a new Dharma Task
 * 
 * @param {Object} taskData Task data
 * @param {string} taskData.title The task's title
 * @param {string} taskData.description Detailed information about the task
 * @param {string} taskData.author_id The public key of the agent who created the task
 * @param {string|null} taskData.source_id ID of the source task (for lineage tracking)
 * @returns {Object} New task object
 */
export const createTask = (taskData) => {
  return {
    _id: crypto.randomUUID(), // Generate a unique ID
    title: taskData.title,
    description: taskData.description || '',
    author_id: taskData.author_id,
    source_id: taskData.source_id || null,
    status: TASK_STATUS.PENDING,
    attention_time: 0, // Total attention time in seconds
    attention_switch_events: [], // Record of attention switches
    stewardship_transfers: [], // Record of stewardship changes
    gratitude: 0, // Initial gratitude tokens
    aliases: taskData.aliases || [], // Alternative names
    created_at: Date.now(),
    updated_at: Date.now()
  }
}

/**
 * Records an attention switch event
 * 
 * @param {Object} task The task to update
 * @param {string} eventType Either 'Start' or 'Stop'
 * @returns {Object} Updated task with the new attention event
 */
export const recordAttentionEvent = (task, eventType) => {
  if (!['Start', 'Stop'].includes(eventType)) {
    throw new Error('Event type must be either "Start" or "Stop"')
  }
  
  const updatedTask = { ...task }
  
  // Add the new attention event
  const newEvent = {
    timestamp: Date.now(),
    event_type: eventType
  }
  
  updatedTask.attention_switch_events = [
    ...(updatedTask.attention_switch_events || []),
    newEvent
  ]
  
  // Calculate attention time if this is a 'Stop' event
  if (eventType === 'Stop') {
    const events = updatedTask.attention_switch_events
    // Find the most recent 'Start' event
    const startIndex = events.slice(0, -1).findLastIndex(e => e.event_type === 'Start')
    
    if (startIndex !== -1) {
      const startTime = events[startIndex].timestamp
      const stopTime = newEvent.timestamp
      const sessionTime = Math.floor((stopTime - startTime) / 1000) // Duration in seconds
      
      updatedTask.attention_time = (updatedTask.attention_time || 0) + sessionTime
    }
  }
  
  updatedTask.updated_at = Date.now()
  return updatedTask
}

/**
 * Transfers stewardship of a task to a new user
 * 
 * @param {Object} task The task to transfer
 * @param {string} newStewardId ID of the new steward
 * @returns {Object} Updated task with the stewardship transfer recorded
 */
export const transferStewardship = (task, newStewardId) => {
  if (!newStewardId) {
    throw new Error('New steward ID is required')
  }
  
  const updatedTask = { ...task }
  
  // Record the stewardship transfer
  const transferEvent = {
    previous_steward_id: task.author_id,
    new_steward_id: newStewardId,
    timestamp: Date.now()
  }
  
  updatedTask.stewardship_transfers = [
    ...(updatedTask.stewardship_transfers || []),
    transferEvent
  ]
  
  // Update the author to the new steward
  updatedTask.author_id = newStewardId
  updatedTask.updated_at = Date.now()
  
  return updatedTask
}

/**
 * Updates the status of a task
 * 
 * @param {Object} task The task to update
 * @param {string} newStatus The new status (from TASK_STATUS)
 * @returns {Object} Updated task with the new status
 */
export const updateTaskStatus = (task, newStatus) => {
  if (!Object.values(TASK_STATUS).includes(newStatus)) {
    throw new Error(`Invalid status. Must be one of: ${Object.values(TASK_STATUS).join(', ')}`)
  }
  
  return {
    ...task,
    status: newStatus,
    updated_at: Date.now()
  }
}

/**
 * Adds gratitude to a task
 * 
 * @param {Object} task The task to update
 * @param {number} amount Amount of gratitude to add
 * @returns {Object} Updated task with increased gratitude
 */
export const addGratitude = (task, amount) => {
  if (typeof amount !== 'number' || amount <= 0) {
    throw new Error('Gratitude amount must be a positive number')
  }
  
  return {
    ...task,
    gratitude: (task.gratitude || 0) + amount,
    updated_at: Date.now()
  }
}

/**
 * Formats attention time into a human-readable string
 * 
 * @param {number} seconds Total attention time in seconds
 * @returns {string} Formatted time string (e.g., "1h 30m")
 */
export const formatAttentionTime = (seconds) => {
  if (!seconds || seconds <= 0) return '0m'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  const parts = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (remainingSeconds > 0 && hours === 0 && minutes === 0) parts.push(`${remainingSeconds}s`)
  
  return parts.join(' ')
}

/**
 * Formats gratitude into a human-readable string
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
