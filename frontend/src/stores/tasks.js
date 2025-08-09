import { defineStore } from 'pinia';
import { ref } from 'vue';
import pb from '../services/pocketbase';
import { useAuthStore } from './auth';
import { useToast } from 'vue-toastification';

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([]);
  const isLoading = ref(false);
  const isCreating = ref(false);
  const toast = useToast();

  async function fetchTasks(pageId) {
    if (!pageId) {
      tasks.value = [];
      return;
    }
    isLoading.value = true;
    try {
      const records = await pb.collection('tasks').getFullList({
        filter: `page = "${pageId}"`,
        sort: '-created',
      });
      tasks.value = records;
    } catch (error) {
      toast.error('Failed to fetch tasks.');
      console.error('Failed to fetch tasks:', error);
      tasks.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function createTask(pageId, title) {
    isCreating.value = true;
    const authStore = useAuthStore();
    if (!authStore.user || !authStore.user.id) {
        toast.error("You must be logged in to create tasks.");
        isCreating.value = false;
        throw new Error("User not authenticated or user ID is missing.");
    }
    try {
      const record = await pb.collection('tasks').create({
        title,
        page: pageId,
        owner: authStore.user.id,
        completed: false,
      });
      tasks.value.unshift(record);
      return record;
    } catch (error) {
      toast.error('Failed to create task.');
      console.error('Failed to create task:', error);
      throw error;
    } finally {
      isCreating.value = false;
    }
  }

  async function updateTask(taskId, data) {
    try {
      const record = await pb.collection('tasks').update(taskId, data);
      const index = tasks.value.findIndex(t => t.id === taskId);
      if (index !== -1) {
        tasks.value[index] = { ...tasks.value[index], ...record };
      }
      return record;
    } catch (error) {
      toast.error('Failed to update task.');
      console.error('Failed to update task:', error);
      throw error;
    }
  }

  async function deleteTask(taskId) {
    try {
      await pb.collection('tasks').delete(taskId);
      tasks.value = tasks.value.filter(t => t.id !== taskId);
      toast.success('Task deleted.');
    } catch (error) {
      toast.error('Failed to delete task.');
      console.error('Failed to delete task:', error);
      throw error;
    }
  }

  return {
    tasks,
    isLoading,
    isCreating,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
});
