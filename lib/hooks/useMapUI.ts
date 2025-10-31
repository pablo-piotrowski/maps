import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  openLakeDrawer,
  startCloseLakeDrawer,
  finalizeCloseLakeDrawer,
  updatePopupProperties,
  selectPopupInfo,
  selectIsLakeDrawerOpen,
  selectSelectedLakeId,
  selectZoom,
  selectCenter,
  setZoom,
  setViewState,
} from '../store/mapUiSlice';

// Publiczny hook do konsumpcji UI stanu mapy.
export const useMapUI = () => {
  const dispatch = useAppDispatch();
  const popupInfo = useAppSelector(selectPopupInfo);
  const isLakeDrawerOpen = useAppSelector(selectIsLakeDrawerOpen);
  const selectedLakeId = useAppSelector(selectSelectedLakeId);
  const zoom = useAppSelector(selectZoom);
  const center = useAppSelector(selectCenter);

  const openDrawerForLake = useCallback(
    (
      longitude: number,
      latitude: number,
      properties: Record<string, unknown> | null
    ) => {
      dispatch(openLakeDrawer({ longitude, latitude, properties }));
    },
    [dispatch]
  );

  // Strategia zamykania dwustopniowego (animacja): najpierw zamykamy, potem czyścimy
  const closeDrawer = useCallback(
    (delayMs: number = 300) => {
      dispatch(startCloseLakeDrawer());
      if (delayMs <= 0) {
        dispatch(finalizeCloseLakeDrawer());
      } else {
        setTimeout(() => dispatch(finalizeCloseLakeDrawer()), delayMs);
      }
    },
    [dispatch]
  );

  const updateProperties = useCallback(
    (properties: Record<string, unknown>) => {
      dispatch(updatePopupProperties(properties));
    },
    [dispatch]
  );

  const updateZoom = useCallback(
    (value: number) => {
      dispatch(setZoom(value));
    },
    [dispatch]
  );

  const updateViewState = useCallback(
    (partial: { longitude?: number; latitude?: number; zoom?: number }) => {
      dispatch(setViewState(partial));
    },
    [dispatch]
  );

  return {
    popupInfo,
    isLakeDrawerOpen,
    selectedLakeId,
    zoom,
    center,
    openDrawerForLake,
    closeDrawer,
    updateProperties,
    updateZoom,
    updateViewState,
  };
};

export default useMapUI;
