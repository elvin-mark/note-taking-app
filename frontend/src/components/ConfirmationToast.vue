<template>
  <div class="p-2">
    <p class="mb-2">{{ message }}</p>
    <div class="flex justify-end gap-2">
      <button @click="$emit('cancel')" class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
        Cancel
      </button>
      <button @click="$emit('confirm')" class="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700">
        Confirm
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string;
}

defineProps<Props>();

// Define emitted events
defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>
