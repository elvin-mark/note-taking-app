<template>
  <li class="flex items-center justify-between p-2 rounded-md hover:bg-gray-200">
    <div class="flex items-center">
      <input
        type="checkbox"
        :checked="task.completed"
        @change="toggleComplete"
        class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
      <span :class="{ 'line-through text-gray-500': task.completed }" class="ml-3">{{ task.title }}</span>
    </div>
    <button @click="handleDelete" class="text-gray-400 hover:text-red-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
      </svg>
    </button>
  </li>
</template>

<script setup lang="ts">
import { useTasksStore } from '../stores/tasks.ts';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const tasksStore = useTasksStore();

const toggleComplete = () => {
  tasksStore.updateTask(props.task.id, { completed: !props.task.completed });
};

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this task?')) {
    tasksStore.deleteTask(props.task.id);
  }
};
</script>
