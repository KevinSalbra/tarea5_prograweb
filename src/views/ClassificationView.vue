<template>
  <div class="detail-layout">
    <Card class="library-card">
      <template #content>
        <div class="header-banner">
          <div>
            <h2 class="section-title">Detalle de clasificación</h2>
            <p class="section-subtitle">Categoría bibliografica y libros relacionados.</p>
          </div>
        </div>

        <div class="soft-divider"></div>

        <div class="detail-grid single-column">
          <div class="field-row">
            <div class="field-label">Nombre:</div>
            <InputText v-model="draft.name" class="library-input" />
          </div>

          <div class="field-row">
            <div class="field-label">Descripción:</div>
            <Textarea
              v-model="draft.description"
              class="library-input"
              autoResize
              rows="5"
            />
          </div>
        </div>

        <div class="field-inline-actions" style="justify-content: flex-end; margin-top: 0.9rem">
          <Button class="library-btn" label="Cancelar" @click="resetDraft" />
          <Button class="library-btn" label="OK" @click="saveDraft" />
        </div>
      </template>
    </Card>

    <Panel class="library-panel table-panel" header="Libros asociados">
      <DataTable
        :value="associatedBooks"
        stripedRows
        responsiveLayout="scroll"
        :rows="5"
        :paginator="false"
      >
        <Column field="name" header="Libro" />
        <Column field="editorialName" header="Editorial" />
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
import Button from 'primevue/button';

const props = defineProps({
  record: {
    type: Object,
    default: null
  },
  books: {
    type: Array,
    required: true
  },
  editorials: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['save', 'cancel', 'toast']);

const draft = ref(blankClassification());

function blankClassification() {
  return {
    id: null,
    name: '',
    description: ''
  };
}

function syncRecord(record) {
  draft.value = record ? JSON.parse(JSON.stringify(record)) : blankClassification();
}

watch(
  () => props.record,
  (record) => syncRecord(record),
  { immediate: true, deep: true }
);

const associatedBooks = computed(() => {
  if (!props.record) {
    return [];
  }

  return props.books
    .filter((book) => book.classificationId === props.record.id)
    .map((book) => ({
      ...book,
      editorialName: props.editorials.find((editorial) => editorial.id === book.editorialId)?.name ?? 'Sin editorial'
    }));
});

function resetDraft() {
  syncRecord(props.record);
  emit('cancel');
}

function saveDraft() {
  emit('save', { ...draft.value });
  emit('toast', 'Clasificacion guardada correctamente.');
}
</script>
