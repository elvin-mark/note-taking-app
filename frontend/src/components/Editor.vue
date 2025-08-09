<template>
  <div class="grid grid-cols-2 gap-4 border rounded-lg shadow-md" style="height: calc(100vh - 200px);">
    <!-- Markdown Editor Pane -->
    <div class="editor-pane">
      <Codemirror
        v-model="localContent"
        placeholder="Write your Markdown here..."
        :style="{ height: '100%' }"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
        @change="handleChange"
      />
    </div>
    <!-- Preview Pane -->
    <div class="preview-pane p-4 overflow-y-auto prose" v-html="renderedMarkdown"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Ref } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { marked } from 'marked';

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

const renderedMarkdown = computed<string>(() => {
  return marked.parse(localContent.value) as string;
});

const handleChange = (value: string): void => {
  emit('update:modelValue', value);
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
.preview-pane h1, .preview-pane h2, .preview-pane h3 {
  font-weight: bold;
}
/* Add more prose styles for better preview */
.prose {
	color: #374151;
	max-width: 65ch;
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
