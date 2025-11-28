// Map UI state management types

// Typ danych popup (z mapy) – uproszczony aby uniezależnić slice od zewnętrznych typów.
export type MapPopupInfo = {
  longitude: number;
  latitude: number;
  // Przechowujemy właściwości jako dowolny obiekt – komponenty wiedzą jak je zinterpretować.
  properties: Record<string, unknown> | null;
};

export type MapUiState = {
  popupInfo: MapPopupInfo | null;
  isLakeDrawerOpen: boolean; // Czy panel dla jeziora jest otwarty (animacja / widoczność)
  selectedLakeId: string | null; // Id jeziora (np. nazwa z properties)
  lastInteractionTs: number | null; // Timestamp ostatniej interakcji – może służyć do efektów (np. odświeżenie połowów)
  zoom: number; // Aktualny poziom zoomu mapy
  longitude: number; // Aktualne centrum długość geograficzna
  latitude: number; // Aktualne centrum szerokość geograficzna
};

// Action payload types for mapUi slice
export type UpdateMapPositionPayload = {
  longitude: number;
  latitude: number;
  zoom: number;
};

export type SetPopupPayload = {
  longitude: number;
  latitude: number;
  properties: Record<string, unknown> | null;
};
