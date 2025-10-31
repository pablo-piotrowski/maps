'use client';

import * as React from 'react';
import { useId } from 'react';
import MapComponent, {
  Source,
  Layer,
  type LayerProps,
  type MapRef,
} from 'react-map-gl/mapbox-legacy';
import 'mapbox-gl/dist/mapbox-gl.css';
import { INITIAL_VIEW_STATE } from './mapconfig';
import type { MapMouseEvent } from 'mapbox-gl';
import LakeDrawer from './components/lake-drawer';
import { useFishCatches } from './hooks/useFishCatches';
import { useFishCatchForm } from './hooks/useFishCatchForm';
// import { useLakeDrawer } from './hooks/useLakeDrawer'; // Zastąpione globalnym stanem Redux
import { useMapUI } from '@/lib/hooks/useMapUI';

const FishMap = () => {
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const mapId = useId();
  const sourceId = useId();
  const mapRef = React.useRef<MapRef | null>(null);

  // Custom hooks for state management
  const { lakeCatches, isLoadingCatches, fetchLakeCatches } = useFishCatches();
  const {
    formData,
    isSubmitting,
    submitMessage,
    handleInputChange,
    handleFormSubmit,
    resetForm,
  } = useFishCatchForm(fetchLakeCatches);
  const {
    popupInfo,
    openDrawerForLake,
    closeDrawer,
    zoom,
    center,
    updateViewState,
    selectedLakeId,
    isLakeDrawerOpen,
  } = useMapUI();
  // Jeden dispatch po zakończeniu ruchu: brak debounce, nasłuch 'moveend'.
  // Użyj persisted center & zoom jako initialViewState (tylko przy pierwszym montażu)
  const persistedInitialViewState = React.useRef({
    ...INITIAL_VIEW_STATE,
    longitude: center.longitude,
    latitude: center.latitude,
    zoom,
  });

  // Podpinamy się pod 'moveend' mapy, wysyłamy pojedynczy update stanu.
  React.useEffect(() => {
    if (!mapLoaded) return; // czekamy aż mapa się w pełni załaduje
    const map = mapRef.current?.getMap?.();
    if (!map) return;
    const handleMoveEnd = () => {
      const view = map.getCenter();
      const newZoom = map.getZoom();
      const longitude = view.lng;
      const latitude = view.lat;
      const partial: { zoom?: number; longitude?: number; latitude?: number } =
        {};
      if (newZoom !== zoom) partial.zoom = newZoom;
      if (longitude !== center.longitude) partial.longitude = longitude;
      if (latitude !== center.latitude) partial.latitude = latitude;
      if (Object.keys(partial).length) {
        updateViewState(partial);
      }
    };
    map.on('moveend', handleMoveEnd);
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [mapLoaded, zoom, center.longitude, center.latitude, updateViewState]);

  const myVectorTilesetSource = {
    type: 'vector',
    url: 'mapbox://ppiotrowski.bwg5i0qk',
  };

  const onMapLoad = React.useCallback(() => {
    setMapLoaded(true);
  }, []);

  const tilesetLayerIdRef = React.useRef('my-custom-data-layer');
  const myTilesetLayer: LayerProps = {
    id: tilesetLayerIdRef.current,
    type: 'fill',
    'source-layer': 'export-8r3k7q',
    paint: {
      'fill-color': '#f00',
      'fill-opacity': 0.4,
      'fill-outline-color': '#000',
    },
  };

  const onClick = React.useCallback(
    (event: MapMouseEvent) => {
      if (!mapRef.current) return;
      const clickedFeature = event.features?.[0];
      if (
        clickedFeature &&
        clickedFeature.layer?.id === tilesetLayerIdRef.current
      ) {
        openDrawerForLake(
          event.lngLat.lng,
          event.lngLat.lat,
          clickedFeature.properties as Record<string, unknown> | null
        );
      }
    },
    [openDrawerForLake]
  );

  const onMouseMove = React.useCallback((event: MapMouseEvent) => {
    if (!mapRef.current) return;
    const hoveredFeature = event.features?.[0];
    mapRef.current.getCanvas().style.cursor =
      hoveredFeature && hoveredFeature.layer?.id === tilesetLayerIdRef.current
        ? 'pointer'
        : '';
  }, []);

  // Wrapper for form submit to pass popupInfo
  const handleFormSubmitWithPopup = React.useCallback(
    (e: React.FormEvent) => {
      handleFormSubmit(e, popupInfo);
    },
    [handleFormSubmit, popupInfo]
  );

  // Auto-refresh połowów: przy każdej zmianie jeziora (gdy drawer otwarty) czyścimy listę i pobieramy świeże dane.
  const prevLakeIdRef = React.useRef<string | null>(null);
  const lastFetchedLakeIdRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!isLakeDrawerOpen || !selectedLakeId) return;
    const changedLake = prevLakeIdRef.current !== selectedLakeId;
    if (changedLake) {
      prevLakeIdRef.current = selectedLakeId;
      // Czyścimy starą listę aby uniknąć wyświetlania poprzednich wyników
      // (W przyszłości: użyć cache per jezioro)
      // Na razie brak clearLakeCatches referencji tutaj, bo hook jej nie eksponuje w tej wersji.
    }
    // Guard: unikamy zapętlenia przez wielokrotne wywołania gdy brak zmiany jeziora
    if (
      !isLoadingCatches &&
      (changedLake || lastFetchedLakeIdRef.current !== selectedLakeId)
    ) {
      lastFetchedLakeIdRef.current = selectedLakeId;
      fetchLakeCatches(selectedLakeId);
    }
  }, [isLakeDrawerOpen, selectedLakeId, isLoadingCatches, fetchLakeCatches]);

  return (
    <MapComponent
      id={mapId}
      initialViewState={persistedInitialViewState.current}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      style={{ position: 'relative', width: '100%', height: '100vh' }}
      mapStyle="mapbox://styles/ppiotrowski/cmbesfnjn004t01r02wpgahpe"
      onLoad={onMapLoad}
      ref={mapRef}
      interactiveLayerIds={[myTilesetLayer.id as string]}
      onClick={onClick}
      onMouseMove={onMouseMove}
      // Brak onMove – pojedynczy dispatch realizowany w 'moveend' effect.
    >
      {mapLoaded && (
        <Source id={sourceId} type="vector" url={myVectorTilesetSource.url}>
          <Layer {...myTilesetLayer} source="custom-tileset-data-source" />
        </Source>
      )}

      <LakeDrawer
        onClose={() => {
          // Zamykamy animacyjnie i czyścimy form po zakończeniu.
          closeDrawer(300);
          resetForm();
        }}
        lakeCatches={lakeCatches}
        isLoadingCatches={isLoadingCatches}
        formData={formData}
        isSubmitting={isSubmitting}
        submitMessage={submitMessage}
        onInputChange={handleInputChange}
        onFormSubmit={handleFormSubmitWithPopup}
      />
    </MapComponent>
  );
};

export default FishMap;
