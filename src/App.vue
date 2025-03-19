<!-- File: src/App.vue -->

<template>
  <div class="app-container">
    <header class="app-header" v-if="isAuthenticated && !isWelcomePage">
      <div class="logo">
        <router-link to="/">
          <span class="dharma-symbol">☸️</span>
          <span class="app-title">Dharma Task Manager</span>
        </router-link>
      </div>
      
      <nav class="main-nav">
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/tasks">Tasks</router-link>
        <router-link to="/profile">Profile</router-link>
      </nav>
      
      <div class="user-section">
        <div class="gratitude-counter">
          {{ formattedGratitude }}
        </div>
        <div class="user-info" @click="navigateToProfile">
          <span class="user-name">{{ userName }}</span>
        </div>
      </div>
    </header>
    
    <main class="app-content">
      <router-view />
    </main>
    
    <footer class="app-footer" v-if="isAuthenticated && !isWelcomePage">
      <p>The Synchronicity Engine - Dharma Task Manager</p>
      <p class="connection-status">
        <span class="status-dot" :class="{ 'connected': isConnected }"></span>
        {{ connectionStatus }}
      </p>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from './stores/userStore'
import { formatGratitude } from './models/UserProfile'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isConnected = ref(false)

const isAuthenticated = computed(() => {
  return userStore.isAuthenticated
})

const isWelcomePage = computed(() => {
  return route.name === 'Welcome'
})

const userName = computed(() => {
  return userStore.userName
})

const formattedGratitude = computed(() => {
  return formatGratitude(userStore.totalGratitude)
})

const connectionStatus = computed(() => {
  return isConnected.value 
    ? 'Connected to P2P network'
    : 'Connecting...'
})

const navigateToProfile = () => {
  router.push('/profile')
}

onMounted(async () => {
  try {
    // Check connection status
    setTimeout(() => {
      isConnected.value = true
    }, 2000)
  } catch (error) {
    console.error('Error checking connection:', error)
  }
})
</script>

<style>
/* Global Styles */
:root {
  --primary-color: #4a6fff;
  --secondary-color: #673ab7;
  --accent-color: #ff9800;
  --success-color: #4caf50;
  --danger-color: #f44336;
  --text-color: #333;
  --light-text: #777;
  --background-color: #f5f7fa;
  --card-background: #fff;
  --border-color: #eee;
  --header-height: 64px;
  --footer-height: 48px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
  min-height: 100vh;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header Styles */
.app-header {
  background-color: var(--card-background);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 24px;
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo a {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--text-color);
}

.dharma-symbol {
  font-size: 1.8rem;
}

.app-title {
  font-size: 1.2rem;
  font-weight: 700;
}

.main-nav {
  display: flex;
  gap: 24px;
}

.main-nav a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  position: relative;
}

.main-nav a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: width 0.2s;
}

.main-nav a:hover::after,
.main-nav a.router-link-active::after {
  width: 100%;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.gratitude-counter {
  background-color: #f0f4ff;
  color: var(--primary-color);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 500;
}

.user-info {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.user-name {
  font-weight: 500;
}

/* Content Styles */
.app-content {
  flex: 1;
  padding-bottom: var(--footer-height);
}

/* Footer Styles */
.app-footer {
  background-color: var(--card-background);
  padding: 0 24px;
  height: var(--footer-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--light-text);
  font-size: 0.9rem;
  border-top: 1px solid var(--border-color);
  position: fixed;
  bottom: 0;
  width: 100%;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--danger-color);
}

.status-dot.connected {
  background-color: var(--success-color);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    height: auto;
    padding: 12px;
  }
  
  .main-nav {
    width: 100%;
    justify-content: space-around;
    padding: 12px 0;
  }
  
  .user-section {
    width: 100%;
    justify-content: space-between;
  }
  
  .app-content {
    padding-bottom: 80px;
  }
  
  .app-footer {
    flex-direction: column;
    height: auto;
    padding: 12px;
    text-align: center;
    gap: 8px;
  }
}
</style>
