<template>
  <div>
    <div class="flex items-center justify-between p-2 rounded-md hover:bg-gray-700 group">
      <button v-if="page.children && page.children.length > 0" @click="toggleCollapse" class="mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" :class="{'transform rotate-90': !isCollapsed}">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
      <a href="#" @click.prevent="selectPage(page.id)" class="flex-grow" :class="{ 'font-bold': pagesStore.selectedPage?.id === page.id }">
        {{ page.title || 'Untitled' }}
      </a>
      <button @click.stop="handleDelete(page.id)" class="hidden group-hover:block text-gray-400 hover:text-red-500 ml-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    <!-- The nested draggable will be here, managed by the component itself -->
    <draggable
      v-if="page.children && !isCollapsed"
      :list="page.children"
      item-key="id"
      group="pages"
      class="ml-4"
      @change="onDragChange"
    >
      <template #item="{ element }">
        <PageTreeItem :page="element" />
      </template>
    </draggable>
  </div>
</template>

<script lang="ts">
// Using options API to be able to name the component for recursion
import { usePagesStore } from '../stores/pages.ts'; // Updated import
import draggable from 'vuedraggable-es';
import { useToast } from 'vue-toastification';
import type { Page } from '../stores/pages.ts'; // Import Page type
import type { PropType } from 'vue'; // Import PropType
import ConfirmationToast from './ConfirmationToast.vue';
import { ref } from 'vue';

export default {
  name: 'PageTreeItem',
  props: {
    page: {
      type: Object as PropType<Page>, // Type annotation for prop
      required: true,
    },
  },
  components: {
    draggable,
  },
  setup(props: { page: Page }) { // Type annotation for props
    const pagesStore = usePagesStore();
    const toast = useToast();
    const isCollapsed = ref(true);

    const selectPage = (id: string): void => {
      pagesStore.selectPage(id);
    };

    const handleDelete = (id: string): void => {
      const toastId = toast.warning(
        {
          component: ConfirmationToast,
          props: {
            message: `Delete "${props.page.title}"? Its children will be moved to the top level.`,
          },
          listeners: {
            cancel: () => {
              toast.dismiss(toastId);
            },
            confirm: () => {
              toast.dismiss(toastId);
              pagesStore.deletePage(id);
            }
          }
        }
      );
    };

    const onDragChange = (event: { added?: { element: Page; newIndex: number; }; removed?: { element: Page; oldIndex: number; }; }): void => {
        if (event.added) {
            const movedPage: Page = event.added.element;
            const newParentId: string | null = props.page.id; // Parent is the current page
            pagesStore.updatePageParent(movedPage.id, newParentId);
        }
    };

    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value;
    };

    return {
      pagesStore,
      selectPage,
      handleDelete,
      onDragChange,
      isCollapsed,
      toggleCollapse,
    };
  },
};
</script>
