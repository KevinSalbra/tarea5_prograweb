<template>
  <Card class="library-card">
    <template #content>
      <div class="header-banner">
        <div>
          <h2 class="section-title">Detalle de libro</h2>
          <p class="section-subtitle">Información editable y relaciones del registro seleccionado.</p>
        </div>
      </div>

      <div class="soft-divider"></div>

      <div class="detail-layout">
        <div class="detail-grid single-column">
          <div class="field-row">
            <div class="field-label">Nombre:</div>
            <InputText v-model="draft.name" class="library-input" />
          </div>

          <div class="field-row">
            <div class="field-label">ISBN:</div>
            <InputText v-model="draft.isbn" class="library-input" />
          </div>

          <div class="field-row">
            <div class="field-label">Año:</div>
            <InputText v-model="draft.year" class="library-input" type="number" />
          </div>

          <div class="field-row">
            <div class="field-label">Edición:</div>
            <InputText v-model="draft.edition" class="library-input" />
          </div>

          <div class="field-row">
            <div class="field-label">Editorial:</div>
            <div class="field-inline-actions">
              <Dropdown
                v-model="draft.editorialId"
                class="library-input"
                :options="editorials"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione"
                style="min-width: 18rem"
              />
              <Button
                class="library-btn"
                label="Cambiar editorial"
                @click="cycleEditorial"
              />
            </div>
          </div>

          <div class="field-row">
            <div class="field-label">Autores:</div>
            <div class="detail-layout">
              <div class="field-inline-actions">
                <Dropdown
                  v-model="selectedAuthorToAdd"
                  class="library-input"
                  :options="availableAuthors"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Autor disponible"
                  style="min-width: 18rem"
                />
                <Button class="library-btn" label="Agregar autor" @click="addAuthor" />
                <Button class="library-btn" label="Eliminar autor" @click="removeAuthor" />
              </div>
              <Listbox
                v-model="selectedAssignedAuthorId"
                class="entity-listbox"
                :options="assignedAuthors"
                optionLabel="name"
                optionValue="id"
                style="max-width: 22rem"
                scrollHeight="7rem"
              />
            </div>
          </div>
        </div>

        <div class="field-inline-actions" style="justify-content: flex-end; padding-top: 0.6rem">
          <Button class="library-btn" label="Cancelar" @click="resetDraft" />
          <Button class="library-btn" label="OK" @click="saveDraft" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Listbox from 'primevue/listbox';

const props = defineProps({
  record: {
    type: Object,
    default: null
  },
  authors: {
    type: Array,
    required: true
  },
  editorials: {
    type: Array,
    required: true
  },
  classifications: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['save', 'cancel', 'toast']);

const draft = ref(blankBook());
const selectedAssignedAuthorId = ref(null);
const selectedAuthorToAdd = ref(null);

function blankBook() {
  return {
    id: null,
    name: '',
    isbn: '',
    year: new Date().getFullYear(),
    edition: '1ra',
    editorialId: props.editorials[0]?.id ?? null,
    authorIds: props.authors[0]?.id ? [props.authors[0].id] : [],
    classificationId: props.classifications[0]?.id ?? null
  };
}

function syncRecord(record) {
  const source = record ? JSON.parse(JSON.stringify(record)) : blankBook();
  source.authorIds = Array.isArray(source.authorIds) ? source.authorIds : [];
  draft.value = source;
  selectedAssignedAuthorId.value = source.authorIds[0] ?? null;
  const fallbackAuthor = props.authors.find((author) => !source.authorIds.includes(author.id));
  selectedAuthorToAdd.value = fallbackAuthor?.id ?? null;
}

watch(
  () => props.record,
  (record) => {
    syncRecord(record);
  },
  { immediate: true, deep: true }
);

const assignedAuthors = computed(() =>
  props.authors.filter((author) => draft.value.authorIds.includes(author.id))
);

const availableAuthors = computed(() =>
  props.authors.filter((author) => !draft.value.authorIds.includes(author.id))
);

watch(assignedAuthors, (authors) => {
  if (!authors.length) {
    selectedAssignedAuthorId.value = null;
    return;
  }

  if (!authors.some((author) => author.id === selectedAssignedAuthorId.value)) {
    selectedAssignedAuthorId.value = authors[0].id;
  }
});

watch(availableAuthors, (authors) => {
  selectedAuthorToAdd.value = authors[0]?.id ?? null;
});

function cycleEditorial() {
  if (!props.editorials.length) {
    return;
  }

  const currentIndex = props.editorials.findIndex((editorial) => editorial.id === draft.value.editorialId);
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % props.editorials.length : 0;
  draft.value.editorialId = props.editorials[nextIndex].id;
  emit('toast', 'Editorial cambiada en el formulario.');
}

function addAuthor() {
  if (selectedAuthorToAdd.value == null) {
    emit('toast', 'No hay autores disponibles para agregar.');
    return;
  }

  if (!draft.value.authorIds.includes(selectedAuthorToAdd.value)) {
    draft.value.authorIds.push(selectedAuthorToAdd.value);
    selectedAssignedAuthorId.value = selectedAuthorToAdd.value;
    emit('toast', 'Autor agregado al libro.');
  }
}

function removeAuthor() {
  if (selectedAssignedAuthorId.value == null) {
    emit('toast', 'Seleccione un autor de la lista.');
    return;
  }

  draft.value.authorIds = draft.value.authorIds.filter((id) => id !== selectedAssignedAuthorId.value);
  selectedAssignedAuthorId.value = draft.value.authorIds[0] ?? null;
  emit('toast', 'Autor eliminado del libro.');
}

function resetDraft() {
  syncRecord(props.record);
  emit('cancel');
}

function saveDraft() {
  emit('save', {
    ...draft.value,
    year: Number(draft.value.year) || new Date().getFullYear(),
    editorialId: draft.value.editorialId ?? null,
    classificationId: draft.value.classificationId ?? null,
    authorIds: [...draft.value.authorIds]
  });
  emit('toast', 'Libro guardado correctamente.');
}
</script>
