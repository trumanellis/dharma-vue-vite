// File: src/stores/taskStore.js

import { defineStore } from 'pinia'
import { initOrbitDB, getTasks, addTask, updateTask, deleteTask } from '../services/orbitdb'
import * as TaskModel from '../models/Task'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
    activeTaskId: null,
    attentionRecording: false
  }),
  
  getters: {
    getTaskById: (state) => (id) => {
      return state.tasks.find(task => task._id === id)
    },
    
    pendingTasks: (state) => {
      return state.tasks.filter(task => task.status === TaskModel.TASK_STATUS.PENDING)
    },
    
    inProgressTasks: (state) => {
      return state.tasks.filter(task => task.status === TaskModel.TASK_STATUS.IN_PROGRESS)
    },
    
    completedTasks: (state) => {
      return state.tasks.filter(task => task.status === TaskModel.TASK_STATUS.COMPLETED)
    },
    
    totalGratitude: (state) => {
      return state.tasks.reduce((total, task) => total + (task.gratitude || 0), 0)
    },
    
    activeTask: (state) => {
      if (!state.activeTaskId) return null
      return state.tasks.find(task => task._id === state.activeTaskId)
    }
  },
  
  actions: {
    async initDatabase() {
      try {
        this.loading = true
        await initOrbitDB()
        await this.fetchTasks()
        this.loading = false
      } catch (error) {
        this.error = error.message
        this.loading = false
      }
    },
    
    async fetchTasks() {
      try {
        this.loading = true
        const result = await getTasks()
        // Only include non-deleted tasks
        this.tasks = result.filter(task => !task._deleted)
        this.loading = false
      } catch (error) {
        this.error = error.message
        this.loading = false
      }
    },
    
    async createTask(taskData) {
      try {
        this.loading = true
        const newTask = TaskModel.createTask(taskData)
        await addTask(newTask)
        await this.fetchTasks()
        this.loading = false
        return newTask._id
      } catch (error) {
        this.error = error.message
        this.loading = false
        return null
      }
    },
    
    async updateTaskStatus(taskId, newStatus) {
      try {
        const task = this.getTaskById(taskId)
        if (!task) throw new Error('Task not found')
        
        const updatedTask = TaskModel.updateTaskStatus(task, newStatus)
        await updateTask(updatedTask)
        await this.fetchTasks()
        return true
      } catch (error) {
        this.error = error.message
        return false
      }
    },
    
    async addGratitude(taskId, amount) {
      try {
        const task = this.getTaskById(taskId)
        if (!task) throw new Error('Task not found')
        
        const updatedTask = TaskModel.addGratitude(task, amount)
        await updateTask(updatedTask)
        await this.fetchTasks()
        return true
      } catch (error) {
        this.error = error.message
        return false
      }
    },
    
    async deleteTask(taskId) {
      try {
        await deleteTask(taskId)
        await this.fetchTasks()
        return true
      } catch (error) {
        this.error = error.message
        return false
      }
    },
    
    async startTaskAttention(taskId) {
      try {
        if (this.attentionRecording) {
          // Stop current recording first
          await this.stopTaskAttention()
        }
        
        const task = this.getTaskById(taskId)
        if (!task) throw new Error('Task not found')
        
        // Update task status to InProgress if not already
        if (task.status !== TaskModel.TASK_STATUS.IN_PROGRESS) {
          await this.updateTaskStatus(taskId, TaskModel.TASK_STATUS.IN_PROGRESS)
        }
        
        // Record start attention event
        const updatedTask = TaskModel.recordAttentionEvent(task, 'Start')
        await updateTask(updatedTask)
        
        // Set active task
        this.activeTaskId = taskId
        this.attentionRecording = true
        
        await this.fetchTasks()
        return true
      } catch (error) {
        this.error = error.message
        return false
      }
    },
    
    async stopTaskAttention() {
      try {
        if (!this.activeTaskId || !this.attentionRecording) return false
        
        const task = this.getTaskById(this.activeTaskId)
        if (!task) throw new Error('Task not found')
        
        // Record stop attention event
        const updatedTask = TaskModel.recordAttentionEvent(task, 'Stop')
        await updateTask(updatedTask)
        
        // Reset active task
        this.activeTaskId = null
        this.attentionRecording = false
        
        await this.fetchTasks()
        return true
      } catch (error) {
        this.error = error.message
        return false
      }
    },
    
    async transferStewardship(taskId, newStewardId) {
      try {
        const task = this.getTaskById(taskId)
        if (!task) throw new Error('Task not found')
        
        const updatedTask = TaskModel.transferStewardship(task, newStewardId)
        await updateTask(updatedTask)
        await this.fetchTasks()
        return true
      } catch (error) {
        this.error = error.message
        return false
      }
    }
  }
})
