// File: src/stores/userStore.js

import { defineStore } from 'pinia'
import { initOrbitDB, getUserProfile, updateUserProfile, getAllUserProfiles } from '../services/orbitdb'
import * as UserModel from '../models/UserProfile'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    orbitdbId: null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => {
      return !!state.currentUser
    },
    
    userName: (state) => {
      return state.currentUser?.name || 'Anonymous'
    },
    
    totalGratitude: (state) => {
      return state.currentUser?.total_gratitude || 0
    },
    
    userId: (state) => {
      return state.currentUser?._id || state.orbitdbId
    }
  },
  
  actions: {
    async initUser() {
      try {
        this.loading = true;
        console.log('Starting OrbitDB initialization in user store...');
        const { orbitdb } = await initOrbitDB();
        
        // Store the OrbitDB identity ID
        this.orbitdbId = orbitdb.identity.id;
        console.log('OrbitDB ID set:', this.orbitdbId);
        
        // Get all users first to ensure the database is populated
        console.log('Retrieving all user profiles...');
        const allProfiles = await getAllUserProfiles();
        console.log(`Found ${allProfiles.length} user profiles`);
        
        // For simplicity in development, always use user1
        // In a production app, you'd use orbitdb.identity.id to find the user's profile
        const defaultUserId = 'user1';
        
        // Check if user profile exists
        console.log('Checking for existing user profile...');
        let userProfile = null;
        
        try {
          userProfile = await getUserProfile(defaultUserId);
          console.log('User profile query result:', userProfile ? 'Found' : 'Not found');
        } catch (err) {
          console.error('Error fetching user profile:', err);
          // Continue with null profile
        }
        
        if (!userProfile) {
          console.log('No user profile found, creating new profile...');
          // Create a new user profile based on mockUsers[0] from orbitdb service
          userProfile = UserModel.createUserProfile({
            id: defaultUserId,
            name: 'Amara Lee',
            aliases: ['Forest Guardian', 'Water Protector']
          });
          
          // Save the new profile
          console.log('Saving new user profile...');
          try {
            await updateUserProfile(userProfile);
            console.log('New user profile saved.');
          } catch (err) {
            console.error('Error saving new user profile:', err);
            // Continue with the profile in memory even if save fails
          }
        } else {
          console.log('Existing user profile found:', userProfile.name);
        }
        
        this.currentUser = userProfile;
        this.loading = false;
        console.log('User initialization completed successfully');
        return true;
      } catch (error) {
        console.error('Error in initUser:', error);
        this.error = error.message;
        this.loading = false;
        
        // Create a default user profile for the UI to work with
        this.currentUser = UserModel.createUserProfile({
          id: 'user1',
          name: 'Offline User',
        });
        
        throw error; // Re-throw to let caller handle it
      }
    },
    
    async updateProfile(updates) {
      try {
        this.loading = true
        
        const updatedProfile = UserModel.updateProfileInfo(this.currentUser, updates)
        await updateUserProfile(updatedProfile)
        
        // Update local state
        this.currentUser = updatedProfile
        this.loading = false
        return true
      } catch (error) {
        this.error = error.message
        this.loading = false
        return false
      }
    },
    
    async addGratitude(amount) {
      try {
        if (!this.currentUser) throw new Error('User not initialized')
        
        const updatedProfile = UserModel.addGratitude(this.currentUser, amount)
        await updateUserProfile(updatedProfile)
        
        // Update local state
        this.currentUser = updatedProfile
        return true
      } catch (error) {
        this.error = error.message
        return false
      }
    },
    
    async recordTaskAttention(taskId, eventType) {
      try {
        if (!this.currentUser) throw new Error('User not initialized')
        if (!['Start', 'Stop'].includes(eventType)) {
          throw new Error('Event type must be either "Start" or "Stop"')
        }
        
        const updatedProfile = UserModel.recordAttentionEvent(
          this.currentUser, 
          taskId, 
          eventType
        )
        
        await updateUserProfile(updatedProfile)
        
        // Update local state
        this.currentUser = updatedProfile
        return true
      } catch (error) {
        this.error = error.message
        return false
      }
    }
  }
})
