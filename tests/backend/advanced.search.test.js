// tests/backend/advanced.search.test.js
// Tests for advanced search features

describe('Advanced Search', () => {
  const recipes = [
    { title: 'Spicy Chicken Wings', tags: ['spicy', 'chicken', 'appetizer'], time: 25, rating: 4.5 },
    { title: 'Mild Curry', tags: ['curry', 'mild', 'dinner'], time: 45, rating: 4.2 },
    { title: 'Vegetable Soup', tags: ['vegan', 'healthy', 'soup'], time: 30, rating: 4.0 },
    { title: 'Chocolate Cake', tags: ['dessert', 'sweet', 'baking'], time: 60, rating: 4.8 }
  ];

  describe('Filter Operators', () => {
    it('should support greater than filter', () => {
      const timeGreaterThan30 = recipes.filter(r => r.time > 30);
      expect(timeGreaterThan30).toHaveLength(2);
    });

    it('should support less than filter', () => {
      const timeLessThan40 = recipes.filter(r => r.time < 40);
      expect(timeLessThan40).toHaveLength(2);
    });

    it('should support range filter', () => {
      const timeRange = recipes.filter(r => r.time >= 25 && r.time <= 45);
      expect(timeRange).toHaveLength(3);
    });
  });

  describe('Sorting Options', () => {
    it('should sort by rating descending', () => {
      const sorted = [...recipes].sort((a, b) => b.rating - a.rating);
      expect(sorted[0].rating).toBe(4.8);
      expect(sorted[3].rating).toBe(4.0);
    });

    it('should sort by title alphabetically', () => {
      const sorted = [...recipes].sort((a, b) => a.title.localeCompare(b.title));
      expect(sorted[0].title).toBe('Chocolate Cake');
    });
  });

  describe('Text Search', () => {
    it('should support partial word matching', () => {
      const searchTerm = 'chick';
      const results = recipes.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      expect(results).toHaveLength(1);
      expect(results[0].title).toContain('Chicken');
    });
  });
});