// src/lib/data.js
const coverFor = (prefix, id) => `https://picsum.photos/seed/${prefix}-${id}/400/600`;

export const sampleBooks = Array.from({ length: 120 }).map((_, i) => {
  const title = `Sample Book ${i + 1}`;
  const department = ['CSE', 'EEE', 'MPE', 'Textile', 'Arch', 'Civil'][i % 6];
  return {
    id: i + 1,
    title,
    author: `Author ${i % 10}`,
    department,
    type: "book",
    tags: title.split(" ").slice(0, 3).map(word => word.toLowerCase()), // simple placeholder
    cover: coverFor("book", i + 1),
    year: 2000 + (i % 20),
    description: `This is a placeholder description for ${title}.
    It belongs to the ${department} department 
    and was written by Author ${i % 10}.`
  };
});

export const sampleThesis = Array.from({ length: 57 }).map((_, i) => {
  const title = `Thesis Paper ${i + 1}`;
  const department = ['CSE', 'EEE', 'MPE', 'Textile', 'Arch', 'Civil'][i % 6];
  return {
    id: i + 1,
    title,
    author: `Student ${i % 12}`,
    department,
    type: "thesis",
    tags: title.split(" ").slice(0, 3).map(word => word.toLowerCase()), // placeholder tags
    cover: coverFor("thesis", i + 1),
    year: 2010 + (i % 10),
    description: `This is a placeholder abstract for ${title}.
    It was prepared by Student ${i % 12} from the ${department} department.`
  };
});
