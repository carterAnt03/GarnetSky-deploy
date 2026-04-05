// tests/backend/search.test.js
// Tests for recipe search and filtering functionality

describe('Recipe Search & Filtering', () => {
  const mockRecipes = [
    { id: 1, title: 'Chicken Alfredo', tags: ['italian', 'pasta', 'chicken'], time_minutes: 30 },
    { id: 2, title: 'Vegetable Stir Fry', tags: ['asian', 'vegan', 'quick'], time_minutes: 20 },
    { id: 3, title: 'Beef Tacos', tags: ['mexican', 'beef', 'spicy'], time_minutes: 25 },
    { id: 4, title: 'Chocolate Cake', tags: ['dessert', 'sweet', 'baking'], time_minutes: 60 }
  ];

  describe('Title Search', () => {
    it('should find recipes by title keyword', () => {
      const searchTerm = 'chicken';
      const results = mockRecipes.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      expect(results).toHaveLength(1);
      expect(results[0].title).toContain('Chicken');
    });

    it('should be case-insensitive', () => {
      const searchTerm = 'CHICKEN';
      const results = mockRecipes.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty array for no matches', () => {
      const searchTerm = 'nonexistent';
      const results = mockRecipes.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      expect(results).toHaveLength(0);
    });
  });

  describe('Tag Filtering', () => {
    it('should filter recipes by single tag', () => {
      const tag = 'italian';
      const results = mockRecipes.filter(r => r.tags.includes(tag));
      
      expect(results).toHaveLength(1);
      expect(results[0].tags).toContain('italian');
    });

    it('should filter recipes by multiple tags (AND logic)', () => {
      const tags = ['italian', 'pasta'];
      const results = mockRecipes.filter(r => 
        tags.every(tag => r.tags.includes(tag))
      );
      
      expect(results).toHaveLength(1);
    });

    it('should filter recipes by any tag (OR logic)', () => {
      const tags = ['mexican', 'asian'];
      const results = mockRecipes.filter(r => 
        tags.some(tag => r.tags.includes(tag))
      );
      
      expect(results).toHaveLength(2);
    });
  });

  describe('Time Filtering', () => {
    it('should filter recipes under 30 minutes', () => {
      const maxTime = 30;
      const results = mockRecipes.filter(r => r.time_minutes <= maxTime);
      
      expect(results).toHaveLength(3);
      expect(results.every(r => r.time_minutes <= 30)).toBe(true);
    });

    it('should filter recipes between 20-40 minutes', () => {
      const minTime = 20;
      const maxTime = 40;
      const results = mockRecipes.filter(r => 
        r.time_minutes >= minTime && r.time_minutes <= maxTime
      );
      
      expect(results).toHaveLength(3);
    });
  });

  describe('Combined Search', () => {
    it('should combine title search and tag filter', () => {
      const searchTerm = 'chicken';
      const tag = 'italian';
      
      const results = mockRecipes.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        r.tags.includes(tag)
      );
      
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Chicken Alfredo');
    });
  });
});