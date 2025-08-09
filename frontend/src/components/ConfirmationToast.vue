<template>
  <div class="p-2">
    <p class="mb-2">{{ message }}</p>
    <div class="flex justify-end gap-2">
      <button @click="cancel" class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
        Cancel
      </button>
      <button @click="confirm" class="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700">
        Confirm
      </button>
    </div>
  </div>
</template>

<script setup >
import { inject } from 'vue';

defineProps({
  message: {
    type: String,
    required: true,
  },
});

const closeToast = inject('closeToast');

const confirm = () => {
  closeToast(true); // Pass true to indicate confirmation
};

const cancel = () => {
  closeToast(false); // Pass false to indicate cancellation
};
</script>
