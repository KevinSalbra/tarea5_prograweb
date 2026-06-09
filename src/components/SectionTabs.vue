<template>
  <TabMenu v-model:activeIndex="activeIndex" :model="tabItems" class="section-tabs" />
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import TabMenu from 'primevue/tabmenu';

const props = defineProps({
  activeSection: {
    type: String,
    required: true
  },
  sections: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:activeSection']);

const activeIndex = ref(0);

const tabItems = computed(() =>
  props.sections.map((section) => ({
    label: section.label
  }))
);

watch(
  () => props.activeSection,
  (sectionKey) => {
    const index = props.sections.findIndex((section) => section.key === sectionKey);
    activeIndex.value = index >= 0 ? index : 0;
  },
  { immediate: true }
);

watch(activeIndex, (index) => {
  const section = props.sections[index];
  if (section) {
    emit('update:activeSection', section.key);
  }
});
</script>

