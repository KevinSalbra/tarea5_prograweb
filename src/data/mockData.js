const currentYear = new Date().getFullYear();

export const nationalityOptions = [
  'USA',
  'Irlanda',
  'Reino Unido',
  'España',
  'México',
  'Chile',
  'Francia',
  'Argentina',
  'Colombia',
  'Italia'
];

export const genderOptions = [
  'Masculino',
  'Femenino',
  'No especificar'
];

export const countryOptions = [
  'España',
  'México',
  'Chile',
  'Colombia',
  'Argentina',
  'USA',
  'Reino Unido',
  'Francia',
  'Costa Rica'
];

export const createLibrarySeed = () => ({
  authors: [
    {
      id: 1,
      name: 'Edgar Allan Poe',
      occupation: 'Escritor',
      nationality: 'USA',
      gender: 'Masculino',
      pseudonym: 'Poe'
    },
    {
      id: 2,
      name: 'Mark Twain',
      occupation: 'Escritor',
      nationality: 'USA',
      gender: 'Masculino',
      pseudonym: 'Samuel Clemens'
    },
    {
      id: 3,
      name: 'Lewis Carroll',
      occupation: 'Escritor',
      nationality: 'Reino Unido',
      gender: 'Masculino',
      pseudonym: 'Charles Lutwidge Dodgson'
    },
    {
      id: 4,
      name: 'Julio Verne',
      occupation: 'Escritor',
      nationality: 'Francia',
      gender: 'Masculino',
      pseudonym: 'Jules Verne'
    },
    {
      id: 5,
      name: 'Isabel Allende',
      occupation: 'Escritora',
      nationality: 'Chile',
      gender: 'Femenino',
      pseudonym: 'Isabel Allende Llona'
    },
    {
      id: 6,
      name: 'Bram Stoker',
      occupation: 'Escritor',
      nationality: 'Irlanda',
      gender: 'Masculino',
      pseudonym: ''
    }
  ],
  editorials: [
    {
      id: 1,
      name: 'Alfaguara',
      country: 'España',
      foundedYear: 1964,
      website: 'https://www.penguinlibros.com/pe/editorial/alfaguara',
      description: 'Editorial reconocida por narrativa contemporánea en lengua española.'
    },
    {
      id: 2,
      name: 'Planeta',
      country: 'España',
      foundedYear: 1949,
      website: 'https://www.planetadelibros.com',
      description: 'Uno de los sellos editoriales más amplios del mundo hispano.'
    },
    {
      id: 3,
      name: 'Penguin Books',
      country: 'Reino Unido',
      foundedYear: 1935,
      website: 'https://www.penguin.co.uk',
      description: 'Editorial internacional con catálogo clásico y contemporáneo.'
    },
    {
      id: 4,
      name: 'Santillana',
      country: 'España',
      foundedYear: 1960,
      website: 'https://www.santillana.com',
      description: 'Casa editorial con fuerte presencia educativa y literaria.'
    }
  ],
  classifications: [
    {
      id: 1,
      name: 'Novela',
      description: 'Obras narrativas extensas con desarrollo de personajes y trama.'
    },
    {
      id: 2,
      name: 'Ciencia ficción',
      description: 'Relatos especulativos basados en ciencia, tecnología o futuro.'
    },
    {
      id: 3,
      name: 'Fantasía',
      description: 'Historias con elementos maravillosos, mágicos o imposibles.'
    },
    {
      id: 4,
      name: 'Terror',
      description: 'Obras que exploran el miedo, la tensión y lo sobrenatural.'
    },
    {
      id: 5,
      name: 'Aventuras',
      description: 'Narraciones de acción, exploración y desafíos continuos.'
    }
  ],
  books: [
    {
      id: 1,
      name: 'La casa de los espíritus',
      isbn: '978-84-204-8330-4',
      year: 1982,
      edition: '1ra',
      editorialId: 1,
      authorIds: [5],
      classificationId: 1
    },
    {
      id: 2,
      name: 'Drácula',
      isbn: '978-0-141-43948-5',
      year: 1897,
      edition: '3ra',
      editorialId: 3,
      authorIds: [6],
      classificationId: 4
    },
    {
      id: 3,
      name: 'Alicia en el país de las maravillas',
      isbn: '978-84-675-0477-6',
      year: 1865,
      edition: '5ta',
      editorialId: 4,
      authorIds: [3],
      classificationId: 3
    },
    {
      id: 4,
      name: 'Las aventuras de Tom Sawyer',
      isbn: '978-84-08-07021-0',
      year: 1876,
      edition: '2da',
      editorialId: 2,
      authorIds: [2],
      classificationId: 5
    },
    {
      id: 5,
      name: 'Viaje al centro de la Tierra',
      isbn: '978-84-376-0494-7',
      year: 1864,
      edition: '4ta',
      editorialId: 1,
      authorIds: [4],
      classificationId: 2
    },
    {
      id: 6,
      name: 'El cuervo y otros poemas',
      isbn: '978-84-663-0000-2',
      year: 1845,
      edition: '1ra',
      editorialId: 3,
      authorIds: [1],
      classificationId: 4
    },
    {
      id: 7,
      name: 'La vuelta al mundo en 80 días',
      isbn: '978-84-674-9011-1',
      year: 1873,
      edition: '2da',
      editorialId: 2,
      authorIds: [4],
      classificationId: 5
    },
    {
      id: 8,
      name: 'El príncipe y el mendigo',
      isbn: '978-84-01-63095-6',
      year: 1881,
      edition: '5ta',
      editorialId: 1,
      authorIds: [2],
      classificationId: 1
    }
  ]
});

export const createBlankBook = (id, editorials, authors, classifications) => ({
  id,
  name: 'Nuevo libro',
  isbn: '',
  year: currentYear,
  edition: '1ra',
  editorialId: editorials[0]?.id ?? null,
  authorIds: authors[0]?.id ? [authors[0].id] : [],
  classificationId: classifications[0]?.id ?? null
});

export const createBlankAuthor = (id) => ({
  id,
  name: 'Nuevo autor',
  occupation: 'Escritor',
  nationality: nationalityOptions[0],
  gender: genderOptions[0],
  pseudonym: ''
});

export const createBlankEditorial = (id) => ({
  id,
  name: 'Nueva editorial',
  country: countryOptions[0],
  foundedYear: currentYear,
  website: '',
  description: ''
});

export const createBlankClassification = (id) => ({
  id,
  name: 'Nueva clasificacion',
  description: ''
});
