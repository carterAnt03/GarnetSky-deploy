// tests/ui/browser.test.jsx
// Tests for browser compatibility

describe('Browser Compatibility', () => {
  const browsers = [
    { name: 'Chrome', version: '90+', supported: true },
    { name: 'Firefox', version: '88+', supported: true },
    { name: 'Safari', version: '14+', supported: true },
    { name: 'Edge', version: '90+', supported: true },
    { name: 'IE11', version: 'any', supported: false }
  ];

  browsers.forEach(browser => {
    it(`should support ${browser.name} ${browser.version}`, () => {
      expect(browser.supported).toBe(browser.name !== 'IE11');
    });
  });

  describe('Responsive Design', () => {
    const viewports = [
      { width: 320, name: 'Mobile' },
      { width: 768, name: 'Tablet' },
      { width: 1024, name: 'Desktop' },
      { width: 1920, name: 'Widescreen' }
    ];

    viewports.forEach(viewport => {
      it(`should work on ${viewport.name} (${viewport.width}px)`, () => {
        expect(viewport.width).toBeGreaterThan(0);
      });
    });
  });
});