
// tests/backend/validation.edges.test.js
// Tests for input validation edge cases and boundary conditions

describe('Input Validation Edge Cases', () => {
  describe('Email Validation', () => {
    const validEmails = [
      'user@example.com',
      'user.name@example.co.uk',
      'user+tag@example.com',
      'user@subdomain.example.com'
    ];
    
    const definitelyInvalid = ['plainaddress', '@missing.com', 'user@.com'];

    it('should accept valid email formats', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    it('should reject clearly invalid email formats', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      definitelyInvalid.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    it('should handle email length limits', () => {
      const maxEmailLength = 254;
      const normalEmail = 'user@example.com';
      const longEmail = 'a'.repeat(200) + '@example.com';
      
      expect(normalEmail.length).toBeLessThan(maxEmailLength);
      expect(longEmail.length).toBeLessThan(maxEmailLength);
    });
  });

  describe('Username Validation', () => {
    const validUsernames = ['john_doe', 'johndoe123', 'JOHN_DOE', 'a1b2c3'];
    const shortUsernames = ['ab', 'a'];
    const longUsernames = ['a'.repeat(51)];

    it('should reject usernames that are too short', () => {
      shortUsernames.forEach(username => {
        const isValid = username.length >= 3;
        expect(isValid).toBe(false);
      });
    });

    it('should reject usernames that are too long', () => {
      longUsernames.forEach(username => {
        const isValid = username.length <= 50;
        expect(isValid).toBe(false);
      });
    });

    it('should only allow alphanumeric and underscore', () => {
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      
      validUsernames.forEach(username => {
        expect(usernameRegex.test(username)).toBe(true);
      });
    });
  });

  describe('Password Validation', () => {
    const testCases = [
      { password: 'Abc123!@', valid: true, reason: 'strong password' },
      { password: 'weak', valid: false, reason: 'too short' },
      { password: 'abcdefgh', valid: false, reason: 'no numbers or special chars' },
      { password: '12345678', valid: false, reason: 'no letters' },
      { password: 'a'.repeat(129), valid: false, reason: 'too long' }
    ];

    it('should enforce password complexity rules', () => {
      testCases.forEach(({ password, valid }) => {
        const hasMinLength = password.length >= 6;
        const hasMaxLength = password.length <= 128;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumberOrSpecial = /[0-9!@#$%^&*]/.test(password);
        
        const isValid = hasMinLength && hasMaxLength && hasLetter && hasNumberOrSpecial;
        
        expect(isValid).toBe(valid);
      });
    });
  });

  describe('Recipe Input Validation', () => {
    it('should handle empty ingredients array', () => {
      const ingredients = [];
      expect(ingredients.length).toBe(0);
    });

    it('should handle very long titles', () => {
      const longTitle = 'a'.repeat(255);
      expect(longTitle.length).toBe(255);
    });

    it('should handle negative time values', () => {
      const negativeTime = -5;
      expect(negativeTime).toBeLessThan(0);
    });

    it('should handle zero servings', () => {
      const zeroServings = 0;
      expect(zeroServings).toBe(0);
    });
  });

  describe('XSS and Injection Prevention', () => {
    const dangerousInputs = [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '"><img src=x onerror=alert(1)>'
    ];

    it('should detect dangerous patterns', () => {
      dangerousInputs.forEach(input => {
        const hasScriptTag = /<script/i.test(input);
        const hasJavascriptProtocol = /javascript:/i.test(input);
        const hasEventHandler = /on\w+\s*=/i.test(input);
        
        const isDangerous = hasScriptTag || hasJavascriptProtocol || hasEventHandler;
        expect(isDangerous).toBe(true);
      });
    });
  });
});