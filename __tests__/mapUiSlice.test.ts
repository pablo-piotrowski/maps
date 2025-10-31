import { describe, it, expect } from 'vitest';
import reducer, {
  setViewState,
  setZoom,
  type MapUiState,
} from '../lib/store/mapUiSlice';

// Minimal initial state shape extracted from slice (duplicated intentionally for test isolation)
const initialState: MapUiState = {
  popupInfo: null,
  isLakeDrawerOpen: false,
  selectedLakeId: null,
  lastInteractionTs: null,
  zoom: 15,
  longitude: 14.62492450285754,
  latitude: 53.37144547012011,
};

describe('mapUiSlice', () => {
  it('updates zoom via setZoom', () => {
    const newState = reducer(initialState, setZoom(10));
    expect(newState.zoom).toBe(10);
  });

  it('updates view state (zoom + center) via setViewState', () => {
    const newState = reducer(
      initialState,
      setViewState({ zoom: 12, longitude: 1, latitude: 2 })
    );
    expect(newState.zoom).toBe(12);
    expect(newState.longitude).toBe(1);
    expect(newState.latitude).toBe(2);
  });
});
