import { defineStore } from 'pinia';
import { ref, computed, type Ref } from 'vue';
import pb from '../services/pocketbase.ts';
import { useToast } from 'vue-toastification';

// Define the Page interface
export interface Page {
  id: string;
  collectionId: string;
  collectionName: string;
  title: string;
  content: string; // Now a string
  parent: string | null; // ID of parent page, or null
  owner: string; // ID of owner user
  created: string;
  updated: string;
  children?: Page[]; // For the tree structure
}

export const usePagesStore = defineStore('pages', () => {
  const pages: Ref<Page[]> = ref([]);
  const selectedPage: Ref<Page | null> = ref(null);
  const isLoading: Ref<boolean> = ref(false);
  const isCreating: Ref<boolean> = ref(false);
  const toast = useToast();

  async function fetchPages(): Promise<void> {
    isLoading.value = true;
    try {
      const records = await pb.collection('pages').getFullList<Page>({
        sort: '-created',
      });
      pages.value = records;
    } catch (error: any) {
      toast.error('Failed to fetch pages.');
      console.error('Failed to fetch pages:', error);
    } finally {
      isLoading.value = false;
    }
  }

  async function createPage(data: { title: string; content: string; owner: string; parent: string | null }): Promise<Page> {
    isCreating.value = true;
    try {
      const record = await pb.collection('pages').create<Page>(data);
      pages.value.unshift(record);
      selectPage(record.id);
      toast.success('New page created.');
      return record;
    } catch (error: any) {
      toast.error('Failed to create page.');
      console.error('Failed to create page:', error);
      throw error;
    } finally {
      isCreating.value = false;
    }
  }

  async function selectPage(id: string | null): Promise<void> {
    if (!id) {
      selectedPage.value = null;
      return;
    }
    try {
      const record = await pb.collection('pages').getOne<Page>(id);
      selectedPage.value = record;
    } catch (error: any) {
      toast.error('Failed to load page.');
      console.error('Failed to select page:', error);
      selectedPage.value = null;
    }
  }

  async function updateSelectedPageContent(content: string): Promise<void> {
    if (!selectedPage.value) return;
    try {
      const record = await pb.collection('pages').update<Page>(selectedPage.value.id, { content });
      selectedPage.value = record;
      const index = pages.value.findIndex(p => p.id === record.id);
      if (index !== -1) {
        pages.value[index] = record;
      }
    } catch (error: any) {
      toast.error('Failed to save content.');
      console.error('Failed to update page content:', error);
    }
  }
  
  async function updateSelectedPageTitle(title: string): Promise<void> {
    if (!selectedPage.value) return;
    try {
      const record = await pb.collection('pages').update<Page>(selectedPage.value.id, { title });
      selectedPage.value = record;
      const index = pages.value.findIndex(p => p.id === record.id);
      if (index !== -1) {
        pages.value[index] = record;
      }
    } catch (error: any) {
      toast.error('Failed to save title.');
      console.error('Failed to update page title:', error);
    }
  }

  async function deletePage(pageId: string): Promise<void> {
    if (!pageId) return;
    const pageToDelete = pages.value.find(p => p.id === pageId);
    if (!pageToDelete) return;

    const children = pages.value.filter(p => p.parent === pageId);
    const updates = children.map(child => {
        return pb.collection('pages').update<Page>(child.id, { parent: null });
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
    } catch (error: any) {
      toast.error('Failed to delete page.');
      console.error('Failed to delete page:', error);
      throw error;
    }
  }

  const pageTree = computed<Page[]>(() => {
    const pagesCopy: Page[] = JSON.parse(JSON.stringify(pages.value));
    const pageMap: { [key: string]: Page } = pagesCopy.reduce((acc: Record<string, Page>, page) => {
      acc[page.id] = page;
      page.children = [];
      return acc;
    }, {});

    const tree: Page[] = [];
    pagesCopy.forEach(page => {
      if (page.parent && pageMap[page.parent]) {
        pageMap[page.parent].children!.push(page); // Use non-null assertion as children is initialized
      } else {
        tree.push(page);
      }
    });
    return tree;
  });

  async function updatePageParent(pageId: string, newParentId: string | null): Promise<void> {
    try {
      const record = await pb.collection('pages').update<Page>(pageId, { parent: newParentId });
      const index = pages.value.findIndex(p => p.id === pageId);
      if (index !== -1) {
        pages.value[index].parent = newParentId;
      }
    } catch (error: any) {
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
