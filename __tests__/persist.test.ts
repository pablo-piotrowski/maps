import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadMapUiPreloaded, MAP_UI_STORAGE_KEY } from '../lib/store/persist';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('persist utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadMapUiPreloaded', () => {
    it('should return undefined when no stored data', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = loadMapUiPreloaded();

      expect(localStorageMock.getItem).toHaveBeenCalledWith(MAP_UI_STORAGE_KEY);
      expect(result).toBeUndefined();
    });

    it('should return undefined when stored data is invalid JSON', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      const result = loadMapUiPreloaded();

      expect(result).toBeUndefined();
    });

    it('should return undefined when stored data has invalid structure', () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          invalidField: true,
        })
      );

      const result = loadMapUiPreloaded();

      expect(result).toBeUndefined();
    });

    it('should restore valid map state', () => {
      const validState = {
        zoom: 12,
        longitude: 14.5,
        latitude: 53.4,
        selectedLakeId: 'lake1',
        isLakeDrawerOpen: false,
        popupInfo: null,
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(validState));

      const result = loadMapUiPreloaded();

      expect(result).toEqual({
        mapUi: {
          ...validState,
          lastInteractionTs: null,
        },
      });
    });

    it('should restore state with popup info when drawer is open', () => {
      const stateWithPopup = {
        zoom: 15,
        longitude: 14.6,
        latitude: 53.4,
        selectedLakeId: 'lake2',
        isLakeDrawerOpen: true,
        popupInfo: {
          longitude: 14.6,
          latitude: 53.4,
          properties: { name: 'Test Lake' },
        },
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(stateWithPopup));

      const result = loadMapUiPreloaded();

      expect(result?.mapUi.popupInfo).toEqual(stateWithPopup.popupInfo);
      expect(result?.mapUi.isLakeDrawerOpen).toBe(true);
    });

    it('should not restore popup info when drawer is closed', () => {
      const stateWithClosedDrawer = {
        zoom: 15,
        longitude: 14.6,
        latitude: 53.4,
        selectedLakeId: 'lake2',
        isLakeDrawerOpen: false,
        popupInfo: {
          longitude: 14.6,
          latitude: 53.4,
          properties: { name: 'Test Lake' },
        },
      };

      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(stateWithClosedDrawer)
      );

      const result = loadMapUiPreloaded();

      expect(result?.mapUi.popupInfo).toBeNull();
      expect(result?.mapUi.isLakeDrawerOpen).toBe(false);
    });

    it('should handle missing required fields gracefully', () => {
      const partialState = {
        zoom: 10,
        // missing longitude, latitude
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(partialState));

      const result = loadMapUiPreloaded();

      expect(result).toBeUndefined();
    });
  });
});
