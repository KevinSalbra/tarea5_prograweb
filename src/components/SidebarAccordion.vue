<template>
  <Accordion v-model:activeIndex="activeIndex" class="library-accordion">
    <AccordionTab
      v-for="section in sections"
      :key="section.key"
      :header="section.label"
    >
      <div class="section-grid">
        <div class="section-actions">
          <Button
            class="library-btn"
            label="Nuevo"
            icon="pi pi-plus"
            size="small"
            @click="emit('new-item', section.key)"
          />
          <Button
            class="library-btn"
            label="Borrar"
            icon="pi pi-trash"
            severity="danger"
            size="small"
            @click="emit('delete-item', section.key)"
          />
        </div>

        <Listbox
          class="section-listbox entity-listbox"
          :options="section.items"
          :optionLabel="section.optionLabel"
          optionValue="id"
          :modelValue="selectedIds[section.key] ?? null"
          :dataKey="section.dataKey"
          scrollHeight="18rem"
          :style="{ minHeight: '16rem' }"
          @update:modelValue="(value) => emit('select-item', section.key, value)"
        />
      </div>
    </AccordionTab>
  </Accordion>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Listbox from 'primevue/listbox';
import Button from 'primevue/button';

const props = defineProps({
  activeSection: {
    type: String,
    required: true
  },
  sections: {
    type: Array,
    required: true
  },
  selectedIds: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:activeSection', 'select-item', 'new-item', 'delete-item']);

const activeIndex = ref(0);

const sectionIndex = computed(() =>
  props.sections.findIndex((section) => section.key === props.activeSection)
);

watch(
  sectionIndex,
  (index) => {
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
