import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Typ danych popup (z mapy) – uproszczony aby uniezależnić slice od zewnętrznych typów.
export interface MapPopupInfo {
  longitude: number;
  latitude: number;
  // Przechowujemy właściwości jako dowolny obiekt – komponenty wiedzą jak je zinterpretować.
  properties: Record<string, unknown> | null;
}

export interface MapUiState {
  popupInfo: MapPopupInfo | null;
  isLakeDrawerOpen: boolean; // Czy panel dla jeziora jest otwarty (animacja / widoczność)
  selectedLakeId: string | null; // Id jeziora (np. nazwa z properties)
  lastInteractionTs: number | null; // Timestamp ostatniej interakcji – może służyć do efektów (np. odświeżenie połowów)
  zoom: number; // Aktualny poziom zoomu mapy
  longitude: number; // Aktualne centrum długość geograficzna
  latitude: number; // Aktualne centrum szerokość geograficzna
}

const initialState: MapUiState = {
  popupInfo: null,
  isLakeDrawerOpen: false,
  selectedLakeId: null,
  lastInteractionTs: null,
  zoom: 15, // domyślnie jak INITIAL_VIEW_STATE
  longitude: 14.62492450285754,
  latitude: 53.37144547012011,
};

// Helper do wydobycia nazwy jeziora z properties (bez logiki domenowej w komponentach)
function extractLakeId(
  properties: Record<string, unknown> | null
): string | null {
  if (
    properties &&
    typeof properties === 'object' &&
    'name' in properties &&
    properties.name != null
  ) {
    return String((properties as Record<string, unknown>).name);
  }
  return null;
}

const mapUiSlice = createSlice({
  name: 'mapUi',
  initialState,
  reducers: {
    openLakeDrawer: (
      state,
      action: PayloadAction<{
        longitude: number;
        latitude: number;
        properties: Record<string, unknown> | null;
      }>
    ) => {
      state.popupInfo = {
        longitude: action.payload.longitude,
        latitude: action.payload.latitude,
        properties: action.payload.properties,
      };
      state.selectedLakeId = extractLakeId(action.payload.properties);
      state.isLakeDrawerOpen = true;
      state.lastInteractionTs = Date.now();
    },
    // Użyte gdy chcemy tylko zamknąć (zostawiając popup do czasu animacji)
    startCloseLakeDrawer: (state) => {
      state.isLakeDrawerOpen = false;
      state.lastInteractionTs = Date.now();
    },
    // Całkowite wyczyszczenie popup i selekcji po animacji
    finalizeCloseLakeDrawer: (state) => {
      state.popupInfo = null;
      state.selectedLakeId = null;
      state.lastInteractionTs = Date.now();
    },
    // Aktualizacja właściwości popup (np. gdyby przyszłe dane się dogrywały dynamicznie)
    updatePopupProperties: (
      state,
      action: PayloadAction<Record<string, unknown>>
    ) => {
      if (state.popupInfo) {
        state.popupInfo.properties = action.payload;
        state.selectedLakeId = extractLakeId(action.payload);
        state.lastInteractionTs = Date.now();
      }
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
      state.lastInteractionTs = Date.now();
    },
    setViewState: (
      state,
      action: PayloadAction<{
        longitude?: number;
        latitude?: number;
        zoom?: number;
      }>
    ) => {
      if (action.payload.zoom != null) state.zoom = action.payload.zoom;
      if (action.payload.longitude != null)
        state.longitude = action.payload.longitude;
      if (action.payload.latitude != null)
        state.latitude = action.payload.latitude;
      state.lastInteractionTs = Date.now();
    },
  },
});

export const {
  openLakeDrawer,
  startCloseLakeDrawer,
  finalizeCloseLakeDrawer,
  updatePopupProperties,
  setZoom,
  setViewState,
} = mapUiSlice.actions;

export default mapUiSlice.reducer;

// Selektory – trzymamy lekkie i proste (reszta może powstać później jeśli będzie potrzebna memoizacja)
export const selectMapUi = (state: { mapUi: MapUiState }) => state.mapUi;
export const selectIsLakeDrawerOpen = (state: { mapUi: MapUiState }) =>
  state.mapUi.isLakeDrawerOpen;
export const selectPopupInfo = (state: { mapUi: MapUiState }) =>
  state.mapUi.popupInfo;
export const selectSelectedLakeId = (state: { mapUi: MapUiState }) =>
  state.mapUi.selectedLakeId;
export const selectZoom = (state: { mapUi: MapUiState }) => state.mapUi.zoom;
export const selectCenter = (state: { mapUi: MapUiState }) => ({
  longitude: state.mapUi.longitude,
  latitude: state.mapUi.latitude,
});
