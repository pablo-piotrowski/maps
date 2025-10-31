import type { Middleware } from '@reduxjs/toolkit';

export const MAP_UI_STORAGE_KEY = 'mapUiStateV2';

export function loadMapUiPreloaded() {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem(MAP_UI_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof parsed.zoom === 'number' &&
      typeof parsed.longitude === 'number' &&
      typeof parsed.latitude === 'number'
    ) {
      const restoredPopupInfo = (() => {
        if (
          parsed.popupInfo &&
          typeof parsed.popupInfo === 'object' &&
          typeof parsed.popupInfo.longitude === 'number' &&
          typeof parsed.popupInfo.latitude === 'number'
        ) {
          return {
            longitude: parsed.popupInfo.longitude,
            latitude: parsed.popupInfo.latitude,
            properties:
              typeof parsed.popupInfo.properties === 'object'
                ? parsed.popupInfo.properties
                : null,
          };
        }
        return null;
      })();

      return {
        mapUi: {
          ...parsed,
          popupInfo: parsed.isLakeDrawerOpen ? restoredPopupInfo : null,
          isLakeDrawerOpen: Boolean(
            parsed.isLakeDrawerOpen && restoredPopupInfo
          ),
          selectedLakeId: parsed.selectedLakeId ?? null,
          lastInteractionTs: null,
        },
      };
    }
  } catch {
    // ignore
  }
  return undefined;
}

export const mapUiPersistMiddleware: Middleware =
  (storeAPI) => (next) => (action) => {
    const result = next(action);
    try {
      type PersistableMapUi = {
        zoom: number;
        longitude: number;
        latitude: number;
        selectedLakeId?: string | null;
        isLakeDrawerOpen: boolean;
        popupInfo: {
          longitude: number;
          latitude: number;
          properties: Record<string, unknown> | null;
        } | null;
      };
      const state = storeAPI.getState() as { mapUi?: PersistableMapUi };
      const slice = state.mapUi;
      if (slice) {
        const toStore = {
          zoom: slice.zoom,
          longitude: slice.longitude,
          latitude: slice.latitude,
          selectedLakeId: slice.selectedLakeId ?? null,
          isLakeDrawerOpen: slice.isLakeDrawerOpen,
          popupInfo: slice.isLakeDrawerOpen ? slice.popupInfo : null,
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem(MAP_UI_STORAGE_KEY, JSON.stringify(toStore));
        }
      }
    } catch {
      // ignore
    }
    return result;
  };
