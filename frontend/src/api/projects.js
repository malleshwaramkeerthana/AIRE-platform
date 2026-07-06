import api from './client'

export const createProject = (data) => api.post('/api/v1/projects', data)

export const listProjects = (search) =>
  api.get('/api/v1/projects', { params: search ? { search } : {} })

export const getProjectWorkspace = (projectId) =>
  api.get(`/api/v1/projects/${projectId}`)

export const regenerateProject = (projectId) =>
  api.post(`/api/v1/projects/${projectId}/regenerate`)

export const getProjectHistory = (projectId) =>
  api.get(`/api/v1/projects/${projectId}/history`)

export const deleteProject = (projectId) =>
  api.delete(`/api/v1/projects/${projectId}`)

export const exportProjectPdf = (projectId) =>
  api.get(`/api/v1/projects/${projectId}/export/pdf`, { responseType: 'blob' })
