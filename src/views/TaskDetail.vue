.task-metadata {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.task-metadata h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #555;
  font-size: 1.1rem;
}

.metadata-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metadata-label {
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
}

.metadata-value {
  color: #333;
}

.priority-high {
  color: #f44336;
  font-weight: 500;
}

.priority-medium {
  color: #ff9800;
  font-weight: 500;
}

.priority-low {
  color: #4caf50;
  font-weight: 500;
}

.description-text {
  white-space: pre-line;
  line-height: 1.6;
}const formatParticipants = (participants) => {
  if (!participants) return 'None';
  
  return participants.map(p => {
    if (p === 'user1') return 'Amara Lee';
    if (p === 'user2') return 'Rohan Patel';
    return p.charAt(0).toUpperCase() + p.slice(1); // Capitalize
  }).join(', ');
}<!-- File: src/views/TaskDetail.vue -->

<template>
  <div class="task-detail-container">
    <div class="back-navigation">
      <button @click="goBack" class="back-button">
        ← Back to Tasks
      </button>
    </div>
    
    <div v-if="loading" class="loading-task">
      Loading task details...
    </div>
    
    <div v-else-if="!task" class="task-not-found">
      Task not found.
    </div>
    
    <div v-else class="task-detail-content">
      <header class="task-header">
        <h1>{{ task.title }}</h1>
        <div class="task-status" :class="statusClass">
          {{ task.status }}
        </div>
      </header>
      
      <div class="task-aliases" v-if="task.aliases && task.aliases.length > 0">
        <h3>Also Known As:</h3>
        <div class="aliases-list">
          <span v-for="alias in task.aliases" :key="alias" class="alias-tag">
            {{ alias }}
          </span>
        </div>
      </div>
      
      <div class="task-meta">
        <div class="meta-item">
          <span class="label">Created:</span>
          <span class="value">{{ formatDate(task.created_at) }}</span>
        </div>
        <div class="meta-item">
          <span class="label">Last Updated:</span>
          <span class="value">{{ formatDate(task.updated_at) }}</span>
        </div>
        <div class="meta-item">
          <span class="label">Attention Time:</span>
          <span class="value">{{ formattedAttentionTime }}</span>
        </div>
        <div class="meta-item">
          <span class="label">Gratitude:</span>
          <span class="value">{{ formattedGratitude }}</span>
        </div>
      </div>
      
      <div class="task-description">
        <h3>Description</h3>
        <p v-if="task.description" class="description-text">{{ task.description }}</p>
        <p v-else class="no-description">No description provided.</p>
      </div>
      
      <div class="task-metadata" v-if="task.category || task.priority || task.location">
        <h3>Details</h3>
        <div class="metadata-grid">
          <div class="metadata-item" v-if="task.category">
            <span class="metadata-label">Category:</span>
            <span class="metadata-value">{{ task.category }}</span>
          </div>
          <div class="metadata-item" v-if="task.priority">
            <span class="metadata-label">Priority:</span>
            <span class="metadata-value" :class="'priority-' + task.priority?.toLowerCase()">{{ task.priority }}</span>
          </div>
          <div class="metadata-item" v-if="task.location">
            <span class="metadata-label">Location:</span>
            <span class="metadata-value">{{ task.location }}</span>
          </div>
          <div class="metadata-item" v-if="task.participants">
            <span class="metadata-label">Participants:</span>
            <span class="metadata-value">{{ formatParticipants(task.participants) }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="sourceTask" class="source-task">
        <h3>Source Task</h3>
        <div class="source-task-card" @click="navigateToSource">
          <div class="source-title">{{ sourceTask.title }}</div>
          <div class="source-meta">
            <span class="source-status" :class="getStatusClass(sourceTask.status)">
              {{ sourceTask.status }}
            </span>
            <span class="source-gratitude">
              {{ formatGratitude(sourceTask.gratitude || 0) }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="task-actions">
        <div class="action-buttons">
          <button 
            v-if="task.status !== 'Completed'" 
            class="attention-button"
            :class="{ active: isActiveTask }"
            @click="toggleAttention"
          >
            {{ isActiveTask ? 'Stop Attention' : 'Start Attention' }}
          </button>
          
          <button 
            v-if="task.status !== 'Completed'" 
            class="complete-button"
            @click="completeTask"
          >
            Mark as Completed
          </button>
          
          <button 
            class="add-gratitude-button"
            @click="showGratitudeModal = true"
          >
            Add Gratitude
          </button>
        </div>
        
        <div class="stewardship-section">
          <h3>Current Steward</h3>
          <div class="steward-info">
            <span class="steward-id">{{ shortenId(task.author_id) }}</span>
            <button 
              v-if="canTransferStewardship" 
              class="transfer-button"
              @click="showTransferModal = true"
            >
              Transfer Stewardship
            </button>
          </div>
        </div>
        
        <div v-if="task.stewardship_transfers.length > 0" class="stewardship-history">
          <h3>Stewardship History</h3>
          <ul class="transfers-list">
            <li v-for="(transfer, index) in task.stewardship_transfers" :key="index" class="transfer-item">
              <div class="transfer-details">
                <span class="transfer-from">{{ shortenId(transfer.previous_steward_id) }}</span>
                <span class="transfer-arrow">→</span>
                <span class="transfer-to">{{ shortenId(transfer.new_steward_id) }}</span>
              </div>
              <div class="transfer-date">
                {{ formatDate(transfer.timestamp) }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div v-if="task.attention_switch_events && task.attention_switch_events.length > 0" class="attention-history">
        <h3>Attention History</h3>
        <ul class="events-list">
          <li v-for="(event, index) in sortedAttentionEvents" :key="index" class="event-item">
            <div class="event-type" :class="{ 'event-start': event.event_type === 'Start', 'event-stop': event.event_type === 'Stop' }">
              {{ event.event_type }}
            </div>
            <div class="event-date">
              {{ formatDate(event.timestamp) }}
            </div>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Modal for adding gratitude -->
    <div v-if="showGratitudeModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Add Gratitude</h3>
        <p>How much gratitude would you like to add to this task?</p>
        <div class="gratitude-input">
          <input 
            type="number" 
            v-model.number="gratitudeAmount" 
            min="1" 
            max="100"
          />
          <span class="gratitude-unit">minutes</span>
        </div>
        <div class="modal-actions">
          <button class="cancel-button" @click="showGratitudeModal = false">
            Cancel
          </button>
          <button class="confirm-button" @click="addGratitude">
            Add Gratitude
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal for transferring stewardship -->
    <div v-if="showTransferModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Transfer Stewardship</h3>
        <p>Enter the ID of the new steward:</p>
        <div class="steward-input">
          <input 
            type="text" 
            v-model="newStewardId" 
            placeholder="Steward ID"
          />
        </div>
        <div class="modal-actions">
          <button class="cancel-button" @click="showTransferModal = false">
            Cancel
          </button>
          <button class="confirm-button" @click="transferStewardship">
            Transfer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '../stores/taskStore'
import { useUserStore } from '../stores/userStore'
import { formatAttentionTime, formatGratitude } from '../models/Task'
import { format } from 'date-fns'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const userStore = useUserStore()

const loading = ref(true)
const showGratitudeModal = ref(false)
const showTransferModal = ref(false)
const gratitudeAmount = ref(10)
const newStewardId = ref('')

const task = computed(() => {
  return taskStore.getTaskById(route.params.id)
})

const isActiveTask = computed(() => {
  return taskStore.activeTaskId === task.value?._id && taskStore.attentionRecording
})

const statusClass = computed(() => {
  return task.value ? `status-${task.value.status.toLowerCase()}` : ''
})

const sourceTask = computed(() => {
  if (!task.value?.source_id) return null
  return taskStore.getTaskById(task.value.source_id)
})

const formattedAttentionTime = computed(() => {
  return formatAttentionTime(task.value?.attention_time || 0)
})

const formattedGratitude = computed(() => {
  return formatGratitude(task.value?.gratitude || 0)
})

const sortedAttentionEvents = computed(() => {
  if (!task.value?.attention_switch_events) return []
  
  return [...task.value.attention_switch_events]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10) // Show only the most recent 10 events
})

const canTransferStewardship = computed(() => {
  // Check if the current user is the author of the task
  return task.value?.author_id === userStore.userId
})

const goBack = () => {
  router.back()
}

const formatDate = (timestamp) => {
  return format(new Date(timestamp), 'MMM d, yyyy h:mm a')
}

const getStatusClass = (status) => {
  return `status-${status.toLowerCase()}`
}

const shortenId = (id) => {
  if (!id) return 'Unknown'
  
  // Shorten ID for display (first 6 and last 4 chars)
  return id.length > 12
    ? `${id.substring(0, 6)}...${id.substring(id.length - 4)}`
    : id
}

const navigateToSource = () => {
  if (sourceTask.value) {
    router.push(`/tasks/${sourceTask.value._id}`)
  }
}

const toggleAttention = async () => {
  if (isActiveTask.value) {
    await taskStore.stopTaskAttention()
  } else {
    await taskStore.startTaskAttention(task.value._id)
  }
}

const completeTask = async () => {
  if (task.value) {
    await taskStore.updateTaskStatus(task.value._id, 'Completed')
    
    // Add gratitude for completing the task
    await userStore.addGratitude(10)
  }
}

const addGratitude = async () => {
  if (task.value && gratitudeAmount.value > 0) {
    await taskStore.addGratitude(task.value._id, gratitudeAmount.value)
    showGratitudeModal.value = false
  }
}

const transferStewardship = async () => {
  if (task.value && newStewardId.value) {
    await taskStore.transferStewardship(task.value._id, newStewardId.value)
    showTransferModal.value = false
  }
}

onMounted(async () => {
  loading.value = true
  
  // Ensure tasks are loaded
  await taskStore.fetchTasks()
  
  loading.value = false
})
</script>

<style>
.task-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.back-navigation {
  margin-bottom: 24px;
}

.back-button {
  background: none;
  border: none;
  color: #4a6fff;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
}

.back-button:hover {
  text-decoration: underline;
}

.loading-task, .task-not-found {
  text-align: center;
  padding: 48px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-detail-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 32px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #eee;
  padding-bottom: 24px;
}

.task-header h1 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
}

.task-status {
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-pending {
  background-color: #fff8e1;
  color: #ff9800;
}

.status-inprogress {
  background-color: #e3f2fd;
  color: #2196f3;
}

.status-completed {
  background-color: #e8f5e9;
  color: #4caf50;
}

.task-aliases {
  margin-bottom: 24px;
}

.task-aliases h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #555;
  font-size: 1.1rem;
}

.aliases-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.alias-tag {
  background-color: #f5f5f5;
  color: #555;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
}

.task-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.meta-item .label {
  color: #777;
  font-size: 0.9rem;
}

.meta-item .value {
  color: #333;
  font-weight: 500;
  font-size: 1rem;
}

.task-description {
  margin-bottom: 24px;
}

.task-description h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #555;
  font-size: 1.1rem;
}

.task-description p {
  color: #333;
  line-height: 1.6;
  white-space: pre-line;
}

.no-description {
  color: #777;
  font-style: italic;
}

.source-task {
  margin-bottom: 24px;
}

.source-task h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #555;
  font-size: 1.1rem;
}

.source-task-card {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.source-task-card:hover {
  background-color: #eee;
}

.source-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.source-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.source-status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.source-gratitude {
  color: #4a6fff;
}

.task-actions {
  margin-bottom: 24px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.action-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.attention-button {
  background-color: #4caf50;
  color: white;
}

.attention-button.active {
  background-color: #f44336;
}

.complete-button {
  background-color: #673ab7;
  color: white;
}

.add-gratitude-button {
  background-color: #4a6fff;
  color: white;
}

.stewardship-section {
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.stewardship-section h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #555;
  font-size: 1.1rem;
}

.steward-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.steward-id {
  font-family: monospace;
  background-color: #eee;
  padding: 4px 8px;
  border-radius: 4px;
}

.transfer-button {
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
}

.stewardship-history {
  margin-bottom: 24px;
}

.stewardship-history h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #555;
  font-size: 1.1rem;
}

.transfers-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.transfer-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.transfer-details {
  display: flex;
  align-items: center;
  gap: 8px;
}

.transfer-from, .transfer-to {
  font-family: monospace;
}

.transfer-arrow {
  color: #777;
}

.transfer-date {
  color: #777;
  font-size: 0.9rem;
}

.attention-history h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #555;
  font-size: 1.1rem;
}

.events-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.event-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.event-type {
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
}

.event-start {
  background-color: #e8f5e9;
  color: #4caf50;
}

.event-stop {
  background-color: #ffebee;
  color: #f44336;
}

.event-date {
  color: #777;
  font-size: 0.9rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
}

.gratitude-input, .steward-input {
  margin: 24px 0;
  display: flex;
  align-items: center;
}

.gratitude-input input, .steward-input input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.gratitude-unit {
  margin-left: 8px;
  color: #777;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #555;
}

.confirm-button {
  background-color: #4a6fff;
  color: white;
}
</style>
