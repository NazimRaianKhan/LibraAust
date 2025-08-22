// src/lib/data.js
const coverFor = (prefix, id) => `https://picsum.photos/seed/${prefix}-${id}/400/600`;

export const sampleBooks = Array.from({ length: 120 }).map((_, i) => ({
  id: i + 1,
  title: `Sample Book ${i + 1}`,
  author: `Author ${i % 10}`,
  department: ['CSE', 'EEE', 'MPE', 'Textile', 'Arch', 'Civil'][i % 6],
  cover: coverFor('book', i + 1),
  year: 2000 + (i % 20), // random year between 2000–2019
  description: `This is a placeholder description for Sample Book ${i + 1}. 
  It belongs to the ${['CSE', 'EEE', 'MPE', 'Textile', 'Arch', 'Civil'][i % 6]} department 
  and was written by Author ${i % 10}.`,
}));

export const sampleThesis = Array.from({ length: 57 }).map((_, i) => ({
  id: i + 1,
  title: `Thesis Paper ${i + 1}`,
  author: `Student ${i % 12}`,
  department: ['CSE', 'EEE', 'MPE', 'Textile', 'Arch', 'Civil'][i % 6],
  cover: coverFor('thesis', i + 1),
  year: 2010 + (i % 10), // random year between 2010–2019
  description: `This is a placeholder abstract for Thesis Paper ${i + 1}. 
  It was prepared by Student ${i % 12} from the ${['CSE', 'EEE', 'MPE', 'Textile', 'Arch', 'Civil'][i % 6]} department.`,
}));
