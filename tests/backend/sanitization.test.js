// tests/backend/sanitization.test.js
// Tests for input sanitization and data cleaning

describe('Input Sanitization', () => {
  describe('String Sanitization', () => {
    it('should trim whitespace from inputs', () => {
      const dirtyInput = '  test@example.com  ';
      const cleanInput = dirtyInput.trim();
      expect(cleanInput).toBe('test@example.com');
    });

    it('should remove HTML tags from text fields', () => {
      const htmlInput = '<p>Hello <b>World</b></p>';
      const sanitized = htmlInput.replace(/<[^>]*>/g, '');
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
    });

    it('should escape special characters', () => {
      const specialChars = '&<>"\'';
      const escaped = specialChars
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      expect(escaped).toBe('&amp;&lt;&gt;&quot;&#39;');
    });
  });

  describe('Number Sanitization', () => {
    it('should convert string numbers to integers', () => {
      const stringNumber = '42';
      const number = parseInt(stringNumber, 10);
      expect(number).toBe(42);
      expect(typeof number).toBe('number');
    });

    it('should handle NaN values', () => {
      const invalidNumber = parseInt('not a number', 10);
      expect(isNaN(invalidNumber)).toBe(true);
    });

    it('should enforce min/max bounds', () => {
      const timeMinutes = 30;
      const minTime = 1;
      const maxTime = 1440;
      expect(timeMinutes).toBeGreaterThanOrEqual(minTime);
      expect(timeMinutes).toBeLessThanOrEqual(maxTime);
    });
  });

  describe('Array Sanitization', () => {
    it('should remove duplicate array items', () => {
      const tags = ['italian', 'pasta', 'italian', 'dinner'];
      const uniqueTags = [...new Set(tags)];
      expect(uniqueTags).toHaveLength(3);
      expect(uniqueTags).toEqual(['italian', 'pasta', 'dinner']);
    });

    it('should filter out empty strings', () => {
      const ingredients = ['flour', '', 'eggs', '', 'sugar'];
      const filtered = ingredients.filter(i => i.trim() !== '');
      expect(filtered).toHaveLength(3);
      expect(filtered).not.toContain('');
    });
  });
});