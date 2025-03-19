<!-- File: src/views/Welcome.vue -->

<template>
  <div class="welcome-container">
    <div class="welcome-card">
      <h1>Welcome to the Dharma Task Manager</h1>
      <p class="subtitle">A Distributed Peer-to-Peer Gratitude Economy</p>
      
      <div class="hero-image">
        <!-- Placeholder for a logo or illustration -->
        <div class="lotus-icon">☸️</div>
      </div>
      
      <p class="description">
        The Dharma Task Manager is a spiritual technology for the AI Age. 
        Track your tasks, collect tokens of gratitude, and participate in a 
        regenerative economy where value is measured by contribution.
      </p>
      
      <div class="status-indicator" v-if="loading">
        <p>Connecting to the decentralized network...</p>
        <div class="loading-progress">
          <div class="loading-step" :class="{ active: loadingStep >= 1, completed: loadingStep > 1 }">
            Initializing IPFS
          </div>
          <div class="loading-step" :class="{ active: loadingStep >= 2, completed: loadingStep > 2 }">
            Creating OrbitDB instance
          </div>
          <div class="loading-step" :class="{ active: loadingStep >= 3, completed: loadingStep > 3 }">
            Opening databases
          </div>
          <div class="loading-step" :class="{ active: loadingStep >= 4, completed: loadingStep === 4 }">
            Loading data
          </div>
        </div>
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <!-- Skip option for debugging -->
        <button @click="skipLoading" class="skip-button">Skip Loading (Debug)</button>
      </div>
      
      <div class="action-buttons" v-else>
        <!-- Main navigation link -->
        <router-link to="/dashboard" class="enter-button">
          Enter the Dharma Flow
        </router-link>
        
        <div class="connection-status">
          <span class="connection-dot" :class="{ connected: isConnected }"></span>
          <span>{{ connectionStatus }}</span>
        </div>
        
        <div class="mock-data-notice" v-if="usingMockData">
          Running in offline mode with sample data
        </div>
      </div>
      
      <div class="quote">
        <p>"Alignment with Dharma occurs when selfless service meets joyful purpose."</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '../stores/taskStore'
import { useUserStore } from '../stores/userStore'
import { formatGratitude } from '../models/UserProfile'

const router = useRouter()
const taskStore = useTaskStore()
const userStore = useUserStore()

const loading = ref(true)
const isConnected = ref(false)
const usingMockData = ref(false)
const loadingStep = ref(0)

const connectionStatus = computed(() => {
  return isConnected.value 
    ? `Connected as ${userStore.userName}`
    : 'Disconnected'
})

const skipLoading = () => {
  console.log('Skipping loading process');
  loading.value = false;
  isConnected.value = true;
}

const navigateToDashboard = () => {
  console.log('Navigating to dashboard...');
  router.push('/dashboard').catch(err => {
    console.error('Navigation error:', err);
  });
}

onMounted(async () => {
  try {
    // Setup listener for loading steps
    window.addEventListener('orbitdb-loading-step', (e) => {
      loadingStep.value = e.detail.step;
    });
    
    // Initialize the OrbitDB connection with better error handling
    console.log('Starting user initialization...');
    loadingStep.value = 1;
    
    // Try to initialize user with real OrbitDB, but don't throw on failure
    try {
      await userStore.initUser();
      console.log('User initialization complete');
      loadingStep.value = 4;
    } catch (error) {
      console.error('User initialization failed, but will continue with mock data:', error);
      usingMockData.value = true;
    }
    
    console.log('Starting database initialization...');
    try {
      await taskStore.initDatabase();
      console.log('Database initialization complete');
    } catch (error) {
      console.error('Database initialization failed, but will continue with mock data:', error);
      usingMockData.value = true;
    }
    
    // Force update loading state regardless of errors
    isConnected.value = true;
    loading.value = false;
    console.log('Connection successful, loading complete');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    // Important: We still need to set loading to false even if there's an error
    loading.value = false;
    usingMockData.value = true;
    
    // Show error but let user proceed
    console.warn('There was an issue connecting to the database. The application will run in offline mode with sample data.');
  }
})
</script>

<style>
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.welcome-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 700px;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 2.2rem;
}

.subtitle {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.hero-image {
  margin: 30px 0;
  display: flex;
  justify-content: center;
}

.lotus-icon {
  font-size: 6rem;
}

.description {
  color: #555;
  line-height: 1.6;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.status-indicator {
  margin: 30px 0;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.loading-dots span {
  width: 12px;
  height: 12px;
  background-color: #4a6fff;
  border-radius: 50%;
  display: inline-block;
  animation: loading 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loading {
  0%, 80%, 100% { 
    transform: scale(0);
  }
  40% { 
    transform: scale(1.0);
  }
}

.loading-progress {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 300px;
  margin: 20px auto;
}

.loading-step {
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #888;
  position: relative;
  transition: all 0.3s ease;
}

.loading-step.active {
  background-color: #e3f2fd;
  color: #2196f3;
  font-weight: 500;
}

.loading-step.completed {
  background-color: #e8f5e9;
  color: #4caf50;
}

.loading-step.active::before,
.loading-step.completed::before {
  content: "";
  position: absolute;
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.loading-step.active::before {
  background-color: #2196f3;
}

.loading-step.completed::before {
  background-color: #4caf50;
}

.action-buttons {
  margin: 30px 0;
}

.enter-button {
  background-color: #4a6fff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 28px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: inline-block;
  text-decoration: none;
}

.enter-button:hover {
  background-color: #3a5fee;
}

.connection-status {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #666;
}

.connection-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #f44336;
  display: inline-block;
}

.connection-dot.connected {
  background-color: #4caf50;
}

.mock-data-notice {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #fff3cd;
  color: #856404;
  border-radius: 4px;
  font-size: 0.9rem;
  display: inline-block;
}

.quote {
  margin-top: 40px;
  font-style: italic;
  color: #777;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.skip-button {
  margin-top: 16px;
  background-color: #888;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.8rem;
  cursor: pointer;
}

.skip-button:hover {
  background-color: #777;
}

.enter-link {
  display: block;
  margin-top: 10px;
  color: #3a5fee;
  text-decoration: underline;
  cursor: pointer;
}
</style>
