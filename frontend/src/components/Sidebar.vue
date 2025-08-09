<template>
  <div class="flex flex-col w-64 h-screen p-4 text-white bg-gray-800">
    <div class="mb-8">
      <h2 class="text-lg font-bold">My Notes</h2>
    </div>
    <nav class="flex-1 mb-8 overflow-y-auto">
      <div v-if="pagesStore.isLoading" class="text-center text-gray-400">
        Loading pages...
      </div>
      <draggable
        v-else
        :list="pagesStore.pageTree"
        item-key="id"
        group="pages"
        @change="onDragChange"
      >
        <template #item="{ element }">
          <PageTreeItem :page="element as Page" />
        </template>
      </draggable>
    </nav>
    <button
      @click="handleNewPage"
      :disabled="pagesStore.isCreating"
      class="w-full px-4 py-2 mb-4 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
    >
      <svg v-if="pagesStore.isCreating" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span v-if="pagesStore.isCreating">Creating...</span>
      <span v-else>New Page</span>
    </button>
    <button @click="handleLogout" class="w-full px-4 py-2 font-medium text-left text-gray-400 rounded-md hover:bg-gray-700 hover:text-white">
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.ts';
import { usePagesStore } from '../stores/pages.ts'; // Updated import
import { useToast } from 'vue-toastification';
import draggable from 'vuedraggable-es';
import PageTreeItem from './PageTreeItem.vue';
import type { Page } from '../stores/pages.ts'; // Import Page type

const authStore = useAuthStore();
const pagesStore = usePagesStore();
const router = useRouter();
const toast = useToast();

onMounted(() => {
  pagesStore.fetchPages();
});

const handleNewPage = async (): Promise<void> => {
  if (!authStore.user || !authStore.user.id) {
    toast.error('Could not create page: User is not properly logged in.');
    return;
  }
  try {
    await pagesStore.createPage({
      title: 'Untitled',
      content: '', // content is now text
      owner: authStore.user.id,
      parent: null,
    });
  } catch (error: any) {
    toast.error('Could not create new page.');
  }
};

const handleLogout = (): void => {
  authStore.logout();
  pagesStore.selectPage(null);
  router.push('/login');
};

const onDragChange = (event: { added?: { element: Page; newIndex: number; }; removed?: { element: Page; oldIndex: number; }; }): void => {
    if (event.added) {
        const movedPage: Page = event.added.element;
        // A page added to the root level has its parent set to null
        pagesStore.updatePageParent(movedPage.id, null);
    }
};
</script>
