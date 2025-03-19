<!-- File: src/components/TaskForm.vue -->

<template>
  <form @submit.prevent="handleSubmit" class="task-form">
    <h2>{{ editMode ? 'Edit Task' : 'Create New Dharma Task' }}</h2>
    
    <div class="form-group">
      <label for="title">Title</label>
      <input 
        type="text" 
        id="title" 
        v-model="form.title" 
        placeholder="Enter task title"
        required
      />
    </div>
    
    <div class="form-group">
      <label for="description">Description</label>
      <textarea 
        id="description" 
        v-model="form.description" 
        placeholder="Describe the task in detail..."
        rows="4"
      ></textarea>
    </div>
    
    <div class="form-group">
      <label for="aliases">Aliases (comma separated)</label>
      <input 
        type="text" 
        id="aliases" 
        v-model="aliasesInput" 
        placeholder="Alternative names for this task"
      />
    </div>
    
    <div class="form-group">
      <label for="source-task">Source Task (optional)</label>
      <select id="source-task" v-model="form.source_id">
        <option value="">None (Root Task)</option>
        <option v-for="task in availableTasks" :key="task._id" :value="task._id">
          {{ task.title }}
        </option>
      </select>
      <small>Select a parent task to establish lineage</small>
    </div>
    
    <div class="form-actions">
      <button type="button" class="cancel-button" @click="$emit('cancel')">
        Cancel
      </button>
      <button type="submit" class="submit-button">
        {{ editMode ? 'Update Task' : 'Create Task' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import { useUserStore } from '../stores/userStore'

const props = defineProps({
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const taskStore = useTaskStore()
const userStore = useUserStore()

const editMode = computed(() => !!props.task)

const form = ref({
  title: '',
  description: '',
  aliases: [],
  source_id: '',
  author_id: ''
})

const aliasesInput = ref('')

onMounted(() => {
  // Set author ID from user store
  form.value.author_id = userStore.userId
  
  // If editing, populate form with task data
  if (props.task) {
    form.value.title = props.task.title
    form.value.description = props.task.description
    form.value.source_id = props.task.source_id
    form.value.aliases = [...props.task.aliases]
    aliasesInput.value = props.task.aliases.join(', ')
  }
})

const availableTasks = computed(() => {
  const tasks = taskStore.tasks.filter(task => {
    // Don't show the current task (if editing)
    if (props.task && task._id === props.task._id) return false
    
    // Don't show tasks that already have this task as their source
    // to prevent circular dependencies
    if (props.task && task.source_id === props.task._id) return false
    
    return true
  })
  
  return tasks
})

const handleSubmit = async () => {
  // Parse aliases from comma-separated input
  form.value.aliases = aliasesInput.value
    .split(',')
    .map(alias => alias.trim())
    .filter(alias => alias.length > 0)
  
  // If editing, keep the same ID
  const taskData = {
    ...form.value
  }
  
  if (props.task) {
    taskData._id = props.task._id
  }
  
  emit('submit', taskData)
}
</script>

<style>
.task-form {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
}

.task-form h2 {
  color: #333;
  margin-top: 0;
  margin-bottom: 24px;
  text-align: center;
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
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group small {
  display: block;
  color: #777;
  font-size: 0.8rem;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-button,
.submit-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #555;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.submit-button {
  background-color: #4a6fff;
  color: white;
}

.submit-button:hover {
  background-color: #3a5fee;
}
</style>
