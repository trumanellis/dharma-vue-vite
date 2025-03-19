// File: src/router/index.js

import { createRouter, createWebHashHistory } from 'vue-router'

// Lazy load components for better performance
const Dashboard = () => import('../views/Dashboard.vue')
const TaskList = () => import('../views/TaskList.vue')
const TaskDetail = () => import('../views/TaskDetail.vue')
const TaskCreate = () => import('../views/TaskCreate.vue')
const Profile = () => import('../views/Profile.vue')
const Welcome = () => import('../views/Welcome.vue')

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/test',
    name: 'Test',
    component: { template: '<div>Test Route Works!</div>' }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: TaskList
  },
  {
    path: '/tasks/create',
    name: 'CreateTask',
    component: TaskCreate
  },
  {
    path: '/tasks/:id',
    name: 'TaskDetail',
    component: TaskDetail,
    props: true
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
