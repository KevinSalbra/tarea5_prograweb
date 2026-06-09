<template>
  <div class="detail-layout">
    <Card class="library-card">
      <template #content>
        <div class="header-banner">
          <div>
            <h2 class="section-title">Detalle de editorial</h2>
            <p class="section-subtitle">Ficha de la editorial y libros publicados.</p>
          </div>
        </div>

        <div class="soft-divider"></div>

        <div class="detail-grid">
          <div class="field-row">
            <div class="field-label">Nombre:</div>
            <InputText v-model="draft.name" class="library-input" />
          </div>

          <div class="field-row">
            <div class="field-label">País:</div>
            <Dropdown
              v-model="draft.country"
              class="library-input"
              :options="countryOptions"
              placeholder="Seleccione"
            />
          </div>

          <div class="field-row">
            <div class="field-label">Año de fundación:</div>
            <InputText v-model="draft.foundedYear" class="library-input" type="number" />
          </div>

          <div class="field-row">
            <div class="field-label">Sitio web:</div>
            <InputText v-model="draft.website" class="library-input" />
          </div>

          <div class="field-row" style="grid-column: 1 / -1">
            <div class="field-label">Descripción:</div>
            <Textarea
              v-model="draft.description"
              class="library-input"
              autoResize
              rows="4"
            />
          </div>
        </div>

        <div class="field-inline-actions" style="justify-content: flex-end; margin-top: 0.9rem">
          <Button class="library-btn" label="Cancelar" @click="resetDraft" />
          <Button class="library-btn" label="OK" @click="saveDraft" />
        </div>
      </template>
    </Card>

    <Panel class="library-panel table-panel" header="Libros publicados por la editorial">
      <DataTable
        :value="publishedBooks"
        stripedRows
        responsiveLayout="scroll"
        :rows="5"
        :paginator="false"
      >
        <Column field="name" header="Libro" />
        <Column field="authorNames" header="Autor" />
        <Column field="year" header="Año" />
        <Column field="edition" header="Edición" />
      </DataTable>
    </Panel>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import Card from 'primevue/card';
import Panel from 'primevue/panel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { countryOptions } from '../data/mockData.js';

const props = defineProps({
  record: {
    type: Object,
    default: null
  },
  books: {
    type: Array,
    required: true
  },
  authors: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['save', 'cancel', 'toast']);

const draft = ref(blankEditorial());

function blankEditorial() {
  return {
    id: null,
    name: '',
    country: countryOptions[0],
    foundedYear: new Date().getFullYear(),
    website: '',
    description: ''
  };
}

function syncRecord(record) {
  draft.value = record ? JSON.parse(JSON.stringify(record)) : blankEditorial();
}

watch(
  () => props.record,
  (record) => syncRecord(record),
  { immediate: true, deep: true }
);

const publishedBooks = computed(() => {
  if (!props.record) {
    return [];
  }

  return props.books
    .filter((book) => book.editorialId === props.record.id)
    .map((book) => ({
      ...book,
      authorNames: (book.authorIds ?? [])
        .map((authorId) => props.authors.find((author) => author.id === authorId)?.name)
        .filter(Boolean)
        .join(', ')
    }));
});

function resetDraft() {
  syncRecord(props.record);
  emit('cancel');
}

function saveDraft() {
  emit('save', {
    ...draft.value,
    foundedYear: Number(draft.value.foundedYear) || new Date().getFullYear()
  });
  emit('toast', 'Editorial guardada correctamente.');
}
</script>
