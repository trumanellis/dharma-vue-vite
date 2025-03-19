.user-aliases {
  font-style: italic;
  color: #666;
  margin-bottom: 8px;
}

.user-bio {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.user-bio h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #333;
}

.user-bio p {
  line-height: 1.6;
  color: #444;
}

.user-details {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.detail-item {
  margin-bottom: 12px;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
}

.detail-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}<!-- File: src/views/Profile.vue -->

<template>
  <div class="profile-container">
    <h1>User Profile</h1>
    
    <div v-if="userStore.loading" class="loading-profile">
      Loading profile...
    </div>
    
    <div v-else class="profile-content">
      <div class="profile-header">
        <div class="profile-avatar">
          {{ userInitial }}
        </div>
        
        <div class="profile-info">
          <h2>{{ userStore.userName }}</h2>
          <div class="user-aliases" v-if="userStore.currentUser?.aliases?.length">
            {{ userStore.currentUser.aliases.join(' • ') }}
          </div>
          <div class="user-id">
            ID: {{ shortenedId }}
          </div>
          <div class="gratitude-total">
            Total Gratitude: {{ formattedGratitude }}
          </div>
        </div>
      </div>
      
      <div class="user-bio" v-if="userStore.currentUser?.profile_data?.bio">
        <h3>About</h3>
        <p>{{ userStore.currentUser.profile_data.bio }}</p>
      </div>
      
      <div class="user-details" v-if="userStore.currentUser?.profile_data">
        <div class="detail-item" v-if="userStore.currentUser.profile_data.location">
          <strong>Location:</strong> {{ userStore.currentUser.profile_data.location }}
        </div>
        
        <div class="detail-item" v-if="userStore.currentUser.profile_data.practices?.length">
          <strong>Practices:</strong> {{ userStore.currentUser.profile_data.practices.join(', ') }}
        </div>
        
        <div class="detail-item" v-if="userStore.currentUser.profile_data.temples?.length">
          <strong>Temples:</strong> {{ userStore.currentUser.profile_data.temples.join(', ') }}
        </div>
      </div>
      
      <div class="profile-form">
        <h3>Edit Profile</h3>
        
        <div class="form-group">
          <label for="name">Display Name</label>
          <input 
            type="text" 
            id="name" 
            v-model="formData.name" 
            placeholder="Your display name"
          />
        </div>
        
        <div class="form-group">
          <label for="aliases">Aliases (comma separated)</label>
          <input 
            type="text" 
            id="aliases" 
            v-model="aliasesInput" 
            placeholder="Alternative names"
          />
        </div>
        
        <div class="form-group">
          <label for="bio">Bio</label>
          <textarea 
            id="bio" 
            v-model="formData.profile_data.bio" 
            placeholder="Tell us about yourself..."
            rows="4"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button 
            class="update-button" 
            @click="updateProfile"
            :disabled="updating"
          >
            {{ updating ? 'Updating...' : 'Update Profile' }}
          </button>
        </div>
      </div>
      
      <div class="connection-info">
        <h3>Connection Information</h3>
        <div class="info-item">
          <span class="label">OrbitDB Identity:</span>
          <span class="value code">{{ userStore.orbitdbId }}</span>
        </div>
        <div class="info-item">
          <span class="label">Connection Status:</span>
          <span class="value">
            <span class="status-dot" :class="{ 'connected': true }"></span>
            Connected
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { formatGratitude } from '../models/UserProfile'

const userStore = useUserStore()
const updating = ref(false)

const formData = ref({
  name: '',
  aliases: [],
  profile_data: {
    bio: '',
    avatar: ''
  }
})

const aliasesInput = ref('')

const userInitial = computed(() => {
  return userStore.userName.charAt(0).toUpperCase()
})

const formattedGratitude = computed(() => {
  return formatGratitude(userStore.totalGratitude)
})

const shortenedId = computed(() => {
  if (!userStore.userId) return ''
  const id = userStore.userId
  return id.length > 16 ? `${id.substring(0, 8)}...${id.substring(id.length - 8)}` : id
})

const updateProfile = async () => {
  try {
    updating.value = true
    
    // Parse aliases from comma-separated input
    formData.value.aliases = aliasesInput.value
      .split(',')
      .map(alias => alias.trim())
      .filter(alias => alias.length > 0)
    
    await userStore.updateProfile(formData.value)
    updating.value = false
  } catch (error) {
    console.error('Error updating profile:', error)
    updating.value = false
  }
}

onMounted(async () => {
  // Ensure user is initialized
  if (!userStore.currentUser) {
    await userStore.initUser()
  }
  
  // Populate form with current user data
  formData.value.name = userStore.currentUser?.name || ''
  formData.value.aliases = userStore.currentUser?.aliases || []
  formData.value.profile_data = {
    ...userStore.currentUser?.profile_data || { bio: '', avatar: '' }
  }
  
  // Set aliases input
  aliasesInput.value = formData.value.aliases.join(', ')
})
</script>

<style>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.profile-container h1 {
  margin-bottom: 24px;
  color: #333;
}

.loading-profile {
  text-align: center;
  padding: 48px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #4a6fff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 500;
}

.profile-info h2 {
  margin: 0 0 8px 0;
  color: #333;
}

.user-id {
  font-family: monospace;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.gratitude-total {
  color: #4a6fff;
  font-weight: 500;
}

.profile-form {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-form h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-actions {
  margin-top: 24px;
}

.update-button {
  background-color: #4a6fff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.update-button:hover:not(:disabled) {
  background-color: #3a5fee;
}

.update-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.connection-info {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.connection-info h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  font-weight: 500;
  color: #555;
}

.info-item .value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item .code {
  font-family: monospace;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  word-break: break-all;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #f44336;
}

.status-dot.connected {
  background-color: #4caf50;
}
</style>
