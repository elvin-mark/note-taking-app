<template>
  <div class="mt-8">
    <h3 class="text-xl font-bold mb-4">Tasks</h3>
    <form @submit.prevent="handleAddTask" class="flex items-center mb-4">
      <input
        v-model="newTaskTitle"
        type="text"
        placeholder="Add a new task..."
        class="flex-grow px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
      <button
        type="submit"
        :disabled="tasksStore.isCreating"
        class="px-4 py-2 ml-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <svg v-if="tasksStore.isCreating" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-if="tasksStore.isCreating">Adding...</span>
        <span v-else>Add</span>
      </button>
    </form>
    <div v-if="tasksStore.isLoading" class="text-center text-gray-500">
      Loading tasks...
    </div>
    <ul v-else>
      <TaskItem v-for="task in tasksStore.tasks" :key="task.id" :task="task" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTasksStore } from '../stores/tasks.ts';
import TaskItem from './TaskItem.vue';
import { useToast } from 'vue-toastification';

const props = defineProps({
  pageId: {
    type: String,
    required: true,
  },
});

const tasksStore = useTasksStore();
const newTaskTitle = ref('');
const toast = useToast();

watch(() => props.pageId, (newPageId) => {
  tasksStore.fetchTasks(newPageId);
}, { immediate: true });

const handleAddTask = async () => {
  if (!newTaskTitle.value.trim()) return;
  try {
    await tasksStore.createTask(props.pageId, newTaskTitle.value);
    newTaskTitle.value = '';
  } catch (error) {
    // The error is already toasted in the store, no need to toast again here.
  }
};
</script>
