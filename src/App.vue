<template>
  <div class="library-shell">
    <div class="library-frame">
      <header class="library-topbar">
        Sistema de Biblioteca
      </header>

      <div class="library-body">
        <aside class="library-sidebar">
          <SidebarAccordion
            :activeSection="activeSection"
            :sections="sidebarSections"
            :selectedIds="selectedIds"
            @update:activeSection="setActiveSection"
            @select-item="selectItem"
            @new-item="createItem"
            @delete-item="deleteItem"
          />
        </aside>

        <main class="library-content">
          <SectionTabs
            :activeSection="activeSection"
            :sections="sectionTabs"
            @update:activeSection="setActiveSection"
          />

          <Transition name="fade" mode="out-in">
            <BookView
              v-if="activeSection === 'books'"
              :key="'books'"
              :record="selectedBook"
              :authors="state.authors"
              :editorials="state.editorials"
              :classifications="state.classifications"
              @save="saveBook"
              @cancel="toastInfo('Edicion de libro cancelada.')"
              @toast="toastInfo"
            />

            <AuthorView
              v-else-if="activeSection === 'authors'"
              :key="'authors'"
              :record="selectedAuthor"
              :books="state.books"
              :editorials="state.editorials"
              @save="saveAuthor"
              @cancel="toastInfo('Edicion de autor cancelada.')"
              @toast="toastInfo"
            />

            <EditorialView
              v-else-if="activeSection === 'editorials'"
              :key="'editorials'"
              :record="selectedEditorial"
              :books="state.books"
              :authors="state.authors"
              @save="saveEditorial"
              @cancel="toastInfo('Edicion de editorial cancelada.')"
              @toast="toastInfo"
            />

            <ClassificationView
              v-else
              :key="'classifications'"
              :record="selectedClassification"
              :books="state.books"
              :editorials="state.editorials"
              @save="saveClassification"
              @cancel="toastInfo('Edicion de clasificacion cancelada.')"
              @toast="toastInfo"
            />
          </Transition>
        </main>
      </div>

      <div class="library-footer">
        <div class="footer-spacer"></div>
      </div>
    </div>

    <Toast />
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

import SidebarAccordion from './components/SidebarAccordion.vue';
import SectionTabs from './components/SectionTabs.vue';
import BookView from './views/BookView.vue';
import AuthorView from './views/AuthorView.vue';
import EditorialView from './views/EditorialView.vue';
import ClassificationView from './views/ClassificationView.vue';
import {
  createBlankAuthor,
  createBlankBook,
  createBlankClassification,
  createBlankEditorial,
  createLibrarySeed
} from './data/mockData.js';

const toast = useToast();

const state = reactive(createLibrarySeed());
const activeSection = ref('books');
const selectedIds = reactive({
  authors: state.authors[0]?.id ?? null,
  books: state.books[0]?.id ?? null,
  editorials: state.editorials[0]?.id ?? null,
  classifications: state.classifications[0]?.id ?? null
});

const sectionTabs = [
  { key: 'authors', label: 'Autor' },
  { key: 'books', label: 'Libro' },
  { key: 'editorials', label: 'Editorial' },
  { key: 'classifications', label: 'Clasificación' }
];

const sidebarSections = computed(() => [
  {
    key: 'authors',
    label: 'Autores',
    items: state.authors,
    optionLabel: 'name',
    dataKey: 'id'
  },
  {
    key: 'books',
    label: 'Libros',
    items: state.books,
    optionLabel: 'name',
    dataKey: 'id'
  },
  {
    key: 'editorials',
    label: 'Editoriales',
    items: state.editorials,
    optionLabel: 'name',
    dataKey: 'id'
  },
  {
    key: 'classifications',
    label: 'Clasificación',
    items: state.classifications,
    optionLabel: 'name',
    dataKey: 'id'
  }
]);

const selectedBook = computed(() => state.books.find((item) => item.id === selectedIds.books) ?? null);
const selectedAuthor = computed(() => state.authors.find((item) => item.id === selectedIds.authors) ?? null);
const selectedEditorial = computed(() => state.editorials.find((item) => item.id === selectedIds.editorials) ?? null);
const selectedClassification = computed(
  () => state.classifications.find((item) => item.id === selectedIds.classifications) ?? null
);

function setActiveSection(section) {
  activeSection.value = section;
}

function selectItem(section, itemId) {
  selectedIds[section] = itemId;
  activeSection.value = section;
}

function nextId(collection) {
  return collection.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

function createItem(section) {
  if (section === 'books') {
    const item = createBlankBook(nextId(state.books), state.editorials, state.authors, state.classifications);
    state.books.push(item);
    selectedIds.books = item.id;
  } else if (section === 'authors') {
    const item = createBlankAuthor(nextId(state.authors));
    state.authors.push(item);
    selectedIds.authors = item.id;
  } else if (section === 'editorials') {
    const item = createBlankEditorial(nextId(state.editorials));
    state.editorials.push(item);
    selectedIds.editorials = item.id;
  } else if (section === 'classifications') {
    const item = createBlankClassification(nextId(state.classifications));
    state.classifications.push(item);
    selectedIds.classifications = item.id;
  }

  activeSection.value = section;
  toastInfo('Registro nuevo creado.');
}

function deleteItem(section) {
  if (section === 'books') {
    const index = state.books.findIndex((item) => item.id === selectedIds.books);
    if (index >= 0) {
      state.books.splice(index, 1);
      selectedIds.books = state.books[0]?.id ?? null;
      toastInfo('Libro eliminado.');
    }
    return;
  }

  if (section === 'authors') {
    const index = state.authors.findIndex((item) => item.id === selectedIds.authors);
    if (index >= 0) {
      const removedId = state.authors[index].id;
      state.authors.splice(index, 1);
      state.books.forEach((book) => {
        book.authorIds = (book.authorIds ?? []).filter((authorId) => authorId !== removedId);
      });
      selectedIds.authors = state.authors[0]?.id ?? null;
      toastInfo('Autor eliminado.');
    }
    return;
  }

  if (section === 'editorials') {
    const index = state.editorials.findIndex((item) => item.id === selectedIds.editorials);
    if (index >= 0) {
      const removedId = state.editorials[index].id;
      state.editorials.splice(index, 1);
      const fallbackId = state.editorials[0]?.id ?? null;
      state.books.forEach((book) => {
        if (book.editorialId === removedId) {
          book.editorialId = fallbackId;
        }
      });
      selectedIds.editorials = state.editorials[0]?.id ?? null;
      toastInfo('Editorial eliminada.');
    }
    return;
  }

  if (section === 'classifications') {
    const index = state.classifications.findIndex((item) => item.id === selectedIds.classifications);
    if (index >= 0) {
      const removedId = state.classifications[index].id;
      state.classifications.splice(index, 1);
      const fallbackId = state.classifications[0]?.id ?? null;
      state.books.forEach((book) => {
        if (book.classificationId === removedId) {
          book.classificationId = fallbackId;
        }
      });
      selectedIds.classifications = state.classifications[0]?.id ?? null;
      toastInfo('Clasificacion eliminada.');
    }
  }
}

function saveBook(payload) {
  const index = state.books.findIndex((item) => item.id === payload.id);
  const normalized = {
    ...payload,
    year: Number(payload.year) || new Date().getFullYear(),
    authorIds: Array.isArray(payload.authorIds) ? [...new Set(payload.authorIds)] : []
  };

  if (index >= 0) {
    state.books[index] = normalized;
  } else {
    state.books.push({ ...normalized, id: nextId(state.books) });
    selectedIds.books = state.books[state.books.length - 1].id;
  }
}

function saveAuthor(payload) {
  const index = state.authors.findIndex((item) => item.id === payload.id);
  const normalized = { ...payload };

  if (index >= 0) {
    state.authors[index] = normalized;
  } else {
    state.authors.push({ ...normalized, id: nextId(state.authors) });
    selectedIds.authors = state.authors[state.authors.length - 1].id;
  }
}

function saveEditorial(payload) {
  const index = state.editorials.findIndex((item) => item.id === payload.id);
  const normalized = {
    ...payload,
    foundedYear: Number(payload.foundedYear) || new Date().getFullYear()
  };

  if (index >= 0) {
    state.editorials[index] = normalized;
  } else {
    state.editorials.push({ ...normalized, id: nextId(state.editorials) });
    selectedIds.editorials = state.editorials[state.editorials.length - 1].id;
  }
}

function saveClassification(payload) {
  const index = state.classifications.findIndex((item) => item.id === payload.id);
  const normalized = { ...payload };

  if (index >= 0) {
    state.classifications[index] = normalized;
  } else {
    state.classifications.push({ ...normalized, id: nextId(state.classifications) });
    selectedIds.classifications = state.classifications[state.classifications.length - 1].id;
  }
}

function toastInfo(message) {
  toast.add({
    severity: 'success',
    summary: 'Biblioteca',
    detail: message,
    life: 2200
  });
}
</script>

