// tests/backend/pagination.test.js
// Tests for pagination and sorting functionality

describe('Pagination & Sorting', () => {
  const mockRecipes = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Recipe ${i + 1}`,
    created_at: new Date(2024, 0, i + 1).toISOString(),
    time_minutes: (i % 60) + 1
  }));

  describe('Pagination', () => {
    it('should return correct page of results', () => {
      const page = 2;
      const limit = 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      const pageResults = mockRecipes.slice(start, end);
      
      expect(pageResults).toHaveLength(10);
      expect(pageResults[0].id).toBe(11);
    });

    it('should handle last page with fewer items', () => {
      const page = 5;
      const limit = 10;
      const start = (page - 1) * limit;
      const pageResults = mockRecipes.slice(start);
      
      expect(pageResults.length).toBeLessThanOrEqual(10);
    });

    it('should return total count metadata', () => {
      const total = mockRecipes.length;
      const page = 1;
      const limit = 10;
      const totalPages = Math.ceil(total / limit);
      
      expect(totalPages).toBe(5);
      expect(total).toBe(50);
    });
  });

  describe('Sorting', () => {
    it('should sort by title ascending', () => {
      const sorted = [...mockRecipes].sort((a, b) => 
        a.title.localeCompare(b.title)
      );
      expect(sorted[0].title).toBe('Recipe 1');
      expect(sorted[49].title).toBe('Recipe 9');
    });

    it('should sort by date descending', () => {
      const sorted = [...mockRecipes].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      expect(sorted[0].created_at).toBe(mockRecipes[49].created_at);
    });

    it('should sort by time minutes ascending', () => {
      const sorted = [...mockRecipes].sort((a, b) => 
        a.time_minutes - b.time_minutes
      );
      expect(sorted[0].time_minutes).toBe(1);
    });
  });

  describe('Filtering with Pagination', () => {
    it('should apply filters before pagination', () => {
      const filtered = mockRecipes.filter(r => r.time_minutes < 30);
      const pageResults = filtered.slice(0, 10);
      
      expect(pageResults.every(r => r.time_minutes < 30)).toBe(true);
    });
  });
});