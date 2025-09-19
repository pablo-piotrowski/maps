"use client";

import * as React from "react";
import Map, {
  Source,
  Layer,
  LayerProps,
  MapRef,
} from "react-map-gl/mapbox-legacy";
import "mapbox-gl/dist/mapbox-gl.css";
import { INITIAL_VIEW_STATE } from "./mapconfig";
import { MapMouseEvent } from "mapbox-gl";
import LakeDrawer from "./components/lake-drawer";
import { useFishCatches } from "./hooks/useFishCatches";
import { useFishCatchForm } from "./hooks/useFishCatchForm";
import { useLakeDrawer } from "./hooks/useLakeDrawer";

const FishMap = () => {
  const [mapLoaded, setMapLoaded] = React.useState(false);
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
  const { popupInfo, isDrawerOpen, handleCloseDrawer, openDrawerForLake } =
    useLakeDrawer(fetchLakeCatches, resetForm);

  const myVectorTilesetSource = {
    type: "vector",
    url: "mapbox://ppiotrowski.bwg5i0qk",
  };

  const onMapLoad = React.useCallback(() => {
    setMapLoaded(true);
  }, []);

  const myTilesetLayer: LayerProps = {
    id: "my-custom-data-layer",
    type: "fill",
    "source-layer": "export-8r3k7q",
    paint: {
      "fill-color": "#f00",
      "fill-opacity": 0.4,
      "fill-outline-color": "#000",
    },
  };

  const onClick = React.useCallback(
    (event: MapMouseEvent) => {
      if (!mapRef.current) return;

      const clickedFeature = event.features && event.features[0];

      if (clickedFeature && clickedFeature.layer?.id === myTilesetLayer.id) {
        openDrawerForLake(
          event.lngLat.lng,
          event.lngLat.lat,
          clickedFeature?.properties
        );
      }
    },
    [myTilesetLayer.id, openDrawerForLake]
  );

  const onMouseMove = React.useCallback(
    (event: MapMouseEvent) => {
      if (!mapRef.current) return;

      const hoveredFeature = event.features && event.features[0];

      if (hoveredFeature && hoveredFeature.layer?.id === myTilesetLayer.id) {
        mapRef.current.getCanvas().style.cursor = "pointer";
      } else {
        mapRef.current.getCanvas().style.cursor = "";
      }
    },
    [myTilesetLayer.id]
  );

  // Wrapper for form submit to pass popupInfo
  const handleFormSubmitWithPopup = React.useCallback(
    (e: React.FormEvent) => {
      handleFormSubmit(e, popupInfo);
    },
    [handleFormSubmit, popupInfo]
  );

  return (
    <>
      <Map
        id="my-custom-tileset-source"
        initialViewState={INITIAL_VIEW_STATE}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        style={{ position: "relative", width: "100%", height: "100vh" }}
        mapStyle="mapbox://styles/ppiotrowski/cmbesfnjn004t01r02wpgahpe"
        onLoad={onMapLoad}
        ref={mapRef}
        interactiveLayerIds={[myTilesetLayer.id as string]}
        onClick={onClick}
        onMouseMove={onMouseMove}
      >
        {mapLoaded && (
          <Source
            id="custom-tileset-data-source"
            type="vector"
            url={myVectorTilesetSource.url}
          >
            <Layer {...myTilesetLayer} source="custom-tileset-data-source" />
          </Source>
        )}

        <LakeDrawer
          popupInfo={popupInfo}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          lakeCatches={lakeCatches}
          isLoadingCatches={isLoadingCatches}
          formData={formData}
          isSubmitting={isSubmitting}
          submitMessage={submitMessage}
          onInputChange={handleInputChange}
          onFormSubmit={handleFormSubmitWithPopup}
        />
      </Map>
    </>
  );
};

export default FishMap;
