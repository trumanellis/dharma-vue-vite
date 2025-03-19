<!-- File: src/components/TaskCard.vue -->

<template>
  <div class="task-card" :class="statusClass">
    <div class="task-header">
      <h3>{{ task?.title || 'Untitled Task' }}</h3>
      <div class="task-badges">
        <span class="status-badge">{{ task?.status || 'Pending' }}</span>
        <span class="gratitude-badge">{{ formattedGratitude }}</span>
      </div>
    </div>
    
    <div class="task-description">
      {{ truncatedDescription }}
    </div>
    
    <div class="task-meta">
      <div class="attention-time">
        <span class="label">Attention:</span>
        <span class="value">{{ formattedAttentionTime }}</span>
      </div>
      <div class="created-date">
        <span class="label">Created:</span>
        <span class="value">{{ formattedDate }}</span>
      </div>
    </div>
    
    <div class="task-actions">
      <button 
        v-if="task?.status !== 'Completed'" 
        class="start-button"
        :class="{ active: isActiveTask }"
        @click="toggleAttention"
      >
        {{ isActiveTask ? 'Stop' : 'Start' }}
      </button>
      
      <button class="view-button" @click="$emit('view', task?._id)">
        View
      </button>
      
      <button 
        v-if="task?.status !== 'Completed'" 
        class="complete-button"
        @click="$emit('complete', task?._id)"
      >
        Complete
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import { formatAttentionTime, formatGratitude } from '../models/Task'
import { format } from 'date-fns'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view', 'complete'])

const taskStore = useTaskStore()

const isActiveTask = computed(() => {
  return taskStore.activeTaskId === props.task._id && taskStore.attentionRecording
})

const statusClass = computed(() => {
  if (!props.task || !props.task.status) return 'status-pending';
  return `status-${props.task.status.toLowerCase()}`;
})

const truncatedDescription = computed(() => {
  if (!props.task.description) return ''
  return props.task.description.length > 100
    ? props.task.description.substring(0, 100) + '...'
    : props.task.description
})

const formattedAttentionTime = computed(() => {
  return formatAttentionTime(props.task?.attention_time || 0);
})

const formattedGratitude = computed(() => {
  return formatGratitude(props.task?.gratitude || 0);
})

const formattedDate = computed(() => {
  if (!props.task?.created_at) return 'Unknown date';
  return format(new Date(props.task.created_at), 'MMM d, yyyy');
})

const toggleAttention = async () => {
  if (isActiveTask.value) {
    await taskStore.stopTaskAttention()
  } else {
    await taskStore.startTaskAttention(props.task._id)
  }
}
</script>

<style>
.task-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.task-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.task-badges {
  display: flex;
  gap: 8px;
}

.status-badge, .gratitude-badge {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
}

.status-badge {
  background-color: #e0e0e0;
}

.gratitude-badge {
  background-color: #f0f4ff;
  color: #4a6fff;
}

.task-description {
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 16px;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 16px;
}

.attention-time, .created-date {
  display: flex;
  gap: 4px;
}

.label {
  font-weight: 500;
}

.task-actions {
  display: flex;
  gap: 8px;
}

.task-actions button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.start-button {
  background-color: #4caf50;
  color: white;
}

.start-button.active {
  background-color: #f44336;
}

.view-button {
  background-color: #2196f3;
  color: white;
}

.complete-button {
  background-color: #673ab7;
  color: white;
}

/* Status-specific styles */
.status-pending {
  border-left: 4px solid #ff9800;
}

.status-inprogress {
  border-left: 4px solid #2196f3;
}

.status-completed {
  border-left: 4px solid #4caf50;
  opacity: 0.8;
}
</style>
