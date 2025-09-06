-- Seeder data
INSERT INTO publications (title, author, type, category, photo_url, year, description, tags)
VALUES
  (
    'Introduction to Algorithms',
    'Thomas H. Cormen',
    'book',
    'Computer Science',
    'https://res.cloudinary.com/demo/image/upload/v1693234321/algorithms.jpg',
    2020,
    'A comprehensive book on algorithms widely used in universities.',
    '["algorithms","cs","advanced"]'
  ),
  (
    'Structural Analysis of Bridges',
    'Fatema Begum',
    'thesis',
    'Civil Engineering',
    'https://res.cloudinary.com/demo/image/upload/v1693234321/bridge.jpg',
    2022,
    'Research on the strength and flexibility of bridge structures.',
    '["civil","bridges","research"]'
  );
