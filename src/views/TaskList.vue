<!-- File: src/views/TaskList.vue -->

<template>
  <div class="task-list-container">
    <header class="task-list-header">
      <h1>Task Library</h1>
      <div class="filter-controls">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search tasks..."
          />
        </div>
        
        <div class="filter-options">
          <select v-model="statusFilter">
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          
          <select v-model="sortBy">
            <option value="created_desc">Newest First</option>
            <option value="created_asc">Oldest First</option>
            <option value="gratitude_desc">Highest Gratitude</option>
            <option value="gratitude_asc">Lowest Gratitude</option>
            <option value="attention_desc">Most Attention</option>
            <option value="attention_asc">Least Attention</option>
          </select>
        </div>
      </div>
      
      <router-link to="/tasks/create" class="create-task-btn">
        Create New Task
      </router-link>
    </header>
    
    <div v-if="taskStore.loading" class="loading-tasks">
      <p>Loading tasks...</p>
    </div>
    
    <div v-else-if="filteredTasks.length === 0" class="no-tasks">
      <p v-if="searchQuery || statusFilter !== 'all'">
        No tasks match your current filters.
      </p>
      <p v-else>
        No tasks found. Create your first task to get started!
      </p>
    </div>
    
    <div v-else class="tasks-grid">
      <TaskCard 
        v-for="task in filteredTasks" 
        :key="task._id" 
        :task="task"
        @view="viewTask"
        @complete="completeTask"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '../stores/taskStore'
import TaskCard from '../components/TaskCard.vue'

const router = useRouter()
const taskStore = useTaskStore()

const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('created_desc')

const filteredTasks = computed(() => {
  // Start with all tasks
  let tasks = [...taskStore.tasks]
  
  // Apply status filter
  if (statusFilter.value !== 'all') {
    tasks = tasks.filter(task => task.status === statusFilter.value)
  }
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    tasks = tasks.filter(task => {
      return (
        task.title.toLowerCase().includes(query) ||
        (task.description?.toLowerCase().includes(query)) ||
        task.aliases.some(alias => alias.toLowerCase().includes(query))
      )
    })
  }
  
  // Apply sorting
  tasks.sort((a, b) => {
    switch (sortBy.value) {
      case 'created_asc':
        return a.created_at - b.created_at
      case 'created_desc':
        return b.created_at - a.created_at
      case 'gratitude_asc':
        return (a.gratitude || 0) - (b.gratitude || 0)
      case 'gratitude_desc':
        return (b.gratitude || 0) - (a.gratitude || 0)
      case 'attention_asc':
        return (a.attention_time || 0) - (b.attention_time || 0)
      case 'attention_desc':
        return (b.attention_time || 0) - (a.attention_time || 0)
      default:
        return b.created_at - a.created_at
    }
  })
  
  return tasks
})

const viewTask = (taskId) => {
  router.push(`/tasks/${taskId}`)
}

const completeTask = async (taskId) => {
  await taskStore.updateTaskStatus(taskId, 'Completed')
}

onMounted(async () => {
  // Refresh tasks when the component mounts
  await taskStore.fetchTasks()
})
</script>

<style>
.task-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.task-list-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.task-list-header h1 {
  margin: 0;
  color: #333;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  flex-grow: 1;
  margin: 0 24px;
}

.search-box {
  flex-grow: 1;
  max-width: 400px;
}

.search-box input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.filter-options {
  display: flex;
  gap: 12px;
}

.filter-options select {
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
}

.create-task-btn {
  padding: 10px 20px;
  background-color: #4a6fff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.create-task-btn:hover {
  background-color: #3a5fee;
}

.loading-tasks, .no-tasks {
  text-align: center;
  padding: 48px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .task-list-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .filter-controls {
    margin: 16px 0;
    flex-direction: column;
  }
  
  .search-box {
    max-width: none;
  }
  
  .create-task-btn {
    align-self: center;
  }
  
  .tasks-grid {
    grid-template-columns: 1fr;
  }
}
</style>
