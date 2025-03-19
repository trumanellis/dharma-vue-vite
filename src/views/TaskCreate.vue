<!-- File: src/views/TaskCreate.vue -->

<template>
  <div class="task-create-container">
    <div class="back-navigation">
      <button @click="goBack" class="back-button">
        ← Back
      </button>
    </div>
    
    <TaskForm @submit="handleSubmit" @cancel="goBack" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useTaskStore } from '../stores/taskStore'
import TaskForm from '../components/TaskForm.vue'

const router = useRouter()
const taskStore = useTaskStore()

const goBack = () => {
  router.back()
}

const handleSubmit = async (taskData) => {
  try {
    const taskId = await taskStore.createTask(taskData)
    
    if (taskId) {
      // Navigate to the task detail page
      router.push(`/tasks/${taskId}`)
    }
  } catch (error) {
    console.error('Error creating task:', error)
  }
}
</script>

<style>
.task-create-container {
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
</style>
