import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import pb from '../services/pocketbase';
import { useToast } from 'vue-toastification';

export const usePagesStore = defineStore('pages', () => {
  const pages = ref([]);
  const selectedPage = ref(null);
  const isLoading = ref(false);
  const isCreating = ref(false);
  const toast = useToast();

  async function fetchPages() {
    isLoading.value = true;
    try {
      const records = await pb.collection('pages').getFullList({
        sort: '-created',
      });
      pages.value = records;
    } catch (error) {
      toast.error('Failed to fetch pages.');
      console.error('Failed to fetch pages:', error);
    } finally {
      isLoading.value = false;
    }
  }

  async function createPage(data) {
    isCreating.value = true;
    try {
      const record = await pb.collection('pages').create(data);
      pages.value.unshift(record);
      selectPage(record.id);
      toast.success('New page created.');
      return record;
    } catch (error) {
      toast.error('Failed to create page.');
      console.error('Failed to create page:', error);
      throw error;
    } finally {
      isCreating.value = false;
    }
  }

  async function selectPage(id) {
    if (!id) {
      selectedPage.value = null;
      return;
    }
    try {
      const record = await pb.collection('pages').getOne(id);
      selectedPage.value = record;
    } catch (error) {
      toast.error('Failed to load page.');
      console.error('Failed to select page:', error);
      selectedPage.value = null;
    }
  }

  async function updateSelectedPageContent(content) {
    if (!selectedPage.value) return;
    try {
      const record = await pb.collection('pages').update(selectedPage.value.id, { content });
      selectedPage.value = record;
      const index = pages.value.findIndex(p => p.id === record.id);
      if (index !== -1) {
        pages.value[index] = record;
      }
    } catch (error) {
      toast.error('Failed to save content.');
      console.error('Failed to update page content:', error);
    }
  }
  
  async function updateSelectedPageTitle(title) {
    if (!selectedPage.value) return;
    try {
      const record = await pb.collection('pages').update(selectedPage.value.id, { title });
      selectedPage.value = record;
      const index = pages.value.findIndex(p => p.id === record.id);
      if (index !== -1) {
        pages.value[index] = record;
      }
    } catch (error) {
      toast.error('Failed to save title.');
      console.error('Failed to update page title:', error);
    }
  }

  async function deletePage(pageId) {
    if (!pageId) return;
    const pageToDelete = pages.value.find(p => p.id === pageId);
    if (!pageToDelete) return;

    const children = pages.value.filter(p => p.parent === pageId);
    const updates = children.map(child => {
        return pb.collection('pages').update(child.id, { parent: null });
    });

    try {
      await Promise.all(updates);
      await pb.collection('pages').delete(pageId);
      pages.value = pages.value.filter(p => p.id !== pageId);
      children.forEach(child => {
          const index = pages.value.findIndex(p => p.id === child.id);
          if (index !== -1) {
              pages.value[index].parent = null;
          }
      });
      if (selectedPage.value && selectedPage.value.id === pageId) {
        selectedPage.value = null;
      }
      toast.success(`Page "${pageToDelete.title}" deleted.`);
    } catch (error) {
      toast.error('Failed to delete page.');
      console.error('Failed to delete page:', error);
      throw error;
    }
  }

  const pageTree = computed(() => {
    const pagesCopy = JSON.parse(JSON.stringify(pages.value));
    const pageMap = pagesCopy.reduce((acc, page) => {
      acc[page.id] = page;
      page.children = [];
      return acc;
    }, {});

    const tree = [];
    pagesCopy.forEach(page => {
      if (page.parent && pageMap[page.parent]) {
        pageMap[page.parent].children.push(page);
      } else {
        tree.push(page);
      }
    });
    return tree;
  });

  async function updatePageParent(pageId, newParentId) {
    try {
      const record = await pb.collection('pages').update(pageId, { parent: newParentId });
      const index = pages.value.findIndex(p => p.id === pageId);
      if (index !== -1) {
        pages.value[index].parent = newParentId;
      }
    } catch (error) {
      toast.error('Failed to move page.');
      console.error('Failed to update page parent:', error);
      throw error;
    }
  }

  return {
    pages,
    selectedPage,
    isLoading,
    isCreating,
    pageTree,
    fetchPages,
    createPage,
    selectPage,
    updateSelectedPageContent,
    updateSelectedPageTitle,
    deletePage,
    updatePageParent,
  };
});
