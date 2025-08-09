<template>
  <div>
    <div class="flex items-center justify-between p-2 rounded-md hover:bg-gray-700 group">
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
      v-if="page.children"
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

<script>
// Using options API to be able to name the component for recursion
import { usePagesStore } from '../stores/pages';
import draggable from 'vuedraggable-es';
import { useToast } from 'vue-toastification';
import ConfirmationToast from './ConfirmationToast.vue';

export default {
  name: 'PageTreeItem',
  props: {
    page: {
      type: Object,
      required: true,
    },
  },
  components: {
    draggable,
  },
  setup(props) {
    const pagesStore = usePagesStore();
    const toast = useToast();

    const selectPage = (id) => {
      pagesStore.selectPage(id);
    };

    const handleDelete = (id) => {
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

    const onDragChange = (event) => {
        if (event.added) {
            const movedPage = event.added.element;
            const newParentId = props.page.id;
            pagesStore.updatePageParent(movedPage.id, newParentId);
        }
    };

    return {
      pagesStore,
      selectPage,
      handleDelete,
      onDragChange,
    };
  },
};
</script>
