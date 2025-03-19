<!-- File: src/views/Dashboard.vue -->

<template>
  <div class="dashboard-container">
    <h1>Dashboard Working!</h1>
    <p>The router navigation is functioning correctly. The full dashboard will appear here.</p>
    
    <div class="dashboard-actions">
      <button class="action-button" @click="goToTasks">View All Tasks</button>
      <button class="action-button" @click="createTask">Create a Task</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToTasks = () => {
  router.push('/tasks');
};

const createTask = () => {
  router.push('/tasks/create');
};
</script>

<style>
.dashboard-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.dashboard-actions {
  margin-top: 30px;
  display: flex;
  gap: 20px;
  justify-content: center;
}

.action-button {
  padding: 10px 20px;
  background-color: #4a6fff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.action-button:hover {
  background-color: #3a5fee;
}
</style>
