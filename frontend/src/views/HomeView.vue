<template>
  <div class="flex">
    <Sidebar />
    <main class="flex-1 p-8 bg-gray-100 overflow-y-auto h-screen">
      <div v-if="pagesStore.selectedPage">
        <input
          v-model="title"
          @blur="updateTitle"
          class="w-full text-4xl font-bold bg-transparent focus:outline-none mb-4"
          placeholder="Untitled Page"
        />
        <Editor v-model="content" @update:modelValue="updateContent" />
        <TaskList :page-id="pagesStore.selectedPage.id" />
      </div>
      <div v-else class="flex flex-col items-center justify-center h-full text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h1 class="text-3xl font-bold mb-2">Welcome to your Note-Taking App!</h1>
        <p class="text-lg">Select a page from the sidebar to start editing, or create a new one.</p>
        <p class="text-sm mt-1">Use the "New Page" button on the left to get started.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { usePagesStore } from '../stores/pages.ts';
import Sidebar from '../components/Sidebar.vue';
import Editor from '../components/Editor.vue';
import TaskList from '../components/TaskList.vue';
import { debounce } from 'lodash-es';


const pagesStore = usePagesStore();
const title = ref('');
const content = ref(''); // Changed to string

watch(() => pagesStore.selectedPage, (newPage) => {
  if (newPage) {
    title.value = newPage.title;
    content.value = newPage.content || ''; // Changed to empty string
  } else {
    title.value = '';
    content.value = ''; // Changed to empty string
  }
}, { immediate: true });

const updateTitle = () => {
  if (pagesStore.selectedPage && title.value !== pagesStore.selectedPage.title) {
    pagesStore.updateSelectedPageTitle(title.value);
  }
};

const updateContent = debounce((newContent: any) => {
  pagesStore.updateSelectedPageContent(newContent);
}, 500); // Debounce updates to avoid excessive API calls

</script>
