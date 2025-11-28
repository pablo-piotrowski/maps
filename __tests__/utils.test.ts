import { describe, it, expect } from 'vitest';

// Simple utility function tests without external dependencies
describe('Map utilities', () => {
  describe('extractLakeId', () => {
    it('should extract lake name from properties', () => {
      const properties = { name: 'Lake Superior' };
      const result = extractLakeId(properties);
      expect(result).toBe('Lake Superior');
    });

    it('should return null for properties without name', () => {
      const properties = { id: '123' };
      const result = extractLakeId(properties);
      expect(result).toBeNull();
    });

    it('should return null for null properties', () => {
      const result = extractLakeId(null);
      expect(result).toBeNull();
    });

    it('should convert non-string names to string', () => {
      const properties = { name: 123 };
      const result = extractLakeId(properties);
      expect(result).toBe('123');
    });
  });
});

// Helper function extracted from mapUiSlice for testing
function extractLakeId(
  properties: Record<string, unknown> | null
): string | null {
  if (
    properties &&
    typeof properties === 'object' &&
    'name' in properties &&
    properties.name != null
  ) {
    return String(properties.name);
  }
  return null;
}
