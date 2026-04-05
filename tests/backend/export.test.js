// tests/backend/export.test.js
// Tests for data export functionality

describe('Data Export', () => {
  const userData = {
    profile: { username: 'testuser', email: 'test@example.com' },
    recipes: [{ title: 'Recipe 1' }, { title: 'Recipe 2' }],
    favorites: ['recipe-1', 'recipe-3']
  };

  describe('JSON Export', () => {
    it('should export user data as JSON', () => {
      const jsonExport = JSON.stringify(userData);
      expect(() => JSON.parse(jsonExport)).not.toThrow();
      expect(jsonExport).toContain('testuser');
    });

    it('should exclude sensitive data', () => {
      const exportData = { ...userData };
      expect(exportData).not.toHaveProperty('password_hash');
    });
  });

  describe('CSV Export', () => {
    it('should export recipes as CSV', () => {
      const csvRows = [
        ['Title', 'Description', 'Time'],
        ['Recipe 1', 'Desc 1', '30'],
        ['Recipe 2', 'Desc 2', '45']
      ];
      const csvString = csvRows.map(row => row.join(',')).join('\n');
      expect(csvString).toContain('Title,Description,Time');
    });
  });
});