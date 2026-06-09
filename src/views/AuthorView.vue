<template>
  <div class="detail-layout">
    <Card class="library-card">
      <template #content>
        <div class="header-banner">
          <div>
            <h2 class="section-title">Detalle de autor</h2>
            <p class="section-subtitle">Datos biograficos y relacion de libros publicados.</p>
          </div>
        </div>

        <div class="soft-divider"></div>

        <div class="detail-grid">
          <div class="field-row">
            <div class="field-label">Nombre:</div>
            <InputText v-model="draft.name" class="library-input" />
          </div>

          <div class="field-row">
            <div class="field-label">Ocupación:</div>
            <InputText v-model="draft.occupation" class="library-input" />
          </div>

          <div class="field-row">
            <div class="field-label">Nacionalidad:</div>
            <Dropdown
              v-model="draft.nationality"
              class="library-input"
              :options="nationalities"
              placeholder="Seleccione"
            />
          </div>

          <div class="field-row">
            <div class="field-label">Género:</div>
            <Dropdown
              v-model="draft.gender"
              class="library-input"
              :options="genders"
              placeholder="Seleccione"
            />
          </div>

          <div class="field-row">
            <div class="field-label">Seudónimo:</div>
            <InputText v-model="draft.pseudonym" class="library-input" />
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
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { genderOptions as genders, nationalityOptions as nationalities } from '../data/mockData.js';

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

const draft = ref(blankAuthor());

function blankAuthor() {
  return {
    id: null,
    name: '',
    occupation: '',
    nationality: nationalities[0],
    gender: genders[0],
    pseudonym: ''
  };
}

function syncRecord(record) {
  draft.value = record ? JSON.parse(JSON.stringify(record)) : blankAuthor();
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
    .filter((book) => Array.isArray(book.authorIds) && book.authorIds.includes(props.record.id))
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
  emit('toast', 'Autor guardado correctamente.');
}
</script>

