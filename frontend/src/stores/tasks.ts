import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import pb from '../services/pocketbase.ts';
import { useAuthStore } from './auth.ts';
import { useToast } from 'vue-toastification';

// Define the Task interface
interface Task {
  id: string;
  collectionId: string;
  collectionName: string;
  title: string;
  completed: boolean;
  page: string; // ID of parent page
  owner: string; // ID of owner user
  created: string;
  updated: string;
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks: Ref<Task[]> = ref([]);
  const isLoading: Ref<boolean> = ref(false);
  const isCreating: Ref<boolean> = ref(false);
  const toast = useToast();

  async function fetchTasks(pageId: string): Promise<void> {
    if (!pageId) {
      tasks.value = [];
      return;
    }
    isLoading.value = true;
    try {
      const records = await pb.collection('tasks').getFullList<Task>({
        filter: `page = "${pageId}"`,
        sort: '-created',
      });
      tasks.value = records;
    } catch (error: any) {
      toast.error('Failed to fetch tasks.');
      console.error('Failed to fetch tasks:', error);
      tasks.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function createTask(pageId: string, title: string): Promise<Task> {
    isCreating.value = true;
    const authStore = useAuthStore();
    if (!authStore.user || !authStore.user.id) {
        toast.error("You must be logged in to create tasks.");
        isCreating.value = false;
        throw new Error("User not authenticated or user ID is missing.");
    }
    try {
      const record = await pb.collection('tasks').create<Task>({
        title,
        page: pageId,
        owner: authStore.user.id,
        completed: false,
      });
      tasks.value.unshift(record);
      return record;
    } catch (error: any) {
      toast.error('Failed to create task.');
      console.error('Failed to create task:', error);
      throw error;
    } finally {
      isCreating.value = false;
    }
  }

  async function updateTask(taskId: string, data: Partial<Task>): Promise<Task> {
    try {
      const record = await pb.collection('tasks').update<Task>(taskId, data);
      const index = tasks.value.findIndex(t => t.id === taskId);
      if (index !== -1) {
        tasks.value[index] = { ...tasks.value[index], ...record };
      }
      return record;
    } catch (error: any) {
      toast.error('Failed to update task.');
      console.error('Failed to update task:', error);
      throw error;
    }
  }

  async function deleteTask(taskId: string): Promise<void> {
    try {
      await pb.collection('tasks').delete(taskId);
      tasks.value = tasks.value.filter(t => t.id !== taskId);
      toast.success('Task deleted.');
    } catch (error: any) {
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
