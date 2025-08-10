<template>
  <div>
    <div class="flex justify-end mb-2">
      <button @click="togglePreview" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
        {{ showPreviewOnly ? 'Show Editor' : 'Show Preview' }}
      </button>
    </div>
    <div 
      class="grid gap-4 border rounded-lg shadow-md" 
      :class="{'grid-cols-1': showPreviewOnly, 'grid-cols-2': !showPreviewOnly}" 
      style="height: calc(100vh - 200px);"
    >
      <!-- Markdown Editor Pane -->
      <div v-if="!showPreviewOnly" class="editor-pane">
        <Codemirror
          v-model="localContent"
          placeholder="Write your Markdown here..."
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="extensions"
          @change="handleChange"
        />
      </div>
      <!-- Preview Pane -->
      <div 
        class="preview-pane p-4 overflow-y-auto prose" 
        :class="{'col-span-2': showPreviewOnly}" 
        v-html="renderedMarkdown"
      ></div>
    </div>
    <button @click="copyContent" class="top-2 right-2 bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-1 px-3 rounded z-10">
      Copy
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Ref } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { marked } from 'marked';
import { useToast } from 'vue-toastification';

interface Props {
  modelValue: string;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const emit = defineEmits<Emits>();

const localContent: Ref<string> = ref(props.modelValue);
const extensions = [markdown()];
const toast = useToast();
const showPreviewOnly = ref(true);

const renderedMarkdown = computed<string>(() => {
  return marked.parse(localContent.value) as string;
});

const handleChange = (value: string): void => {
  emit('update:modelValue', value);
};

const copyContent = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(localContent.value);
    toast.success("Content copied to clipboard!");
  } catch (err) {
    console.error('Failed to copy content: ', err);
    toast.error("Failed to copy content.");
  }
};

const togglePreview = (): void => {
  showPreviewOnly.value = !showPreviewOnly.value;
};

watch(() => props.modelValue, (newValue: string) => {
  if (newValue !== localContent.value) {
    localContent.value = newValue;
  }
});
</script>

<style>
.editor-pane .cm-editor {
  height: 100%;
  outline: none;
}
.editor-pane .cm-scroller {
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
}
.preview-pane h1, .preview-pane h2, .preview-pane h3 {
  font-weight: bold;
}
/* Add more prose styles for better preview */
.prose {
	color: #374151;
}
.prose :where(code):not(:where([class~="not-prose"] *)) {
	color: #1f2937;
	border-radius: 0.25rem;
	padding-top: 0.25em;
	padding-bottom: 0.25em;
	padding-left: 0.5em;
	padding-right: 0.5em;
	background-color: #e5e7eb;
}
</style>
