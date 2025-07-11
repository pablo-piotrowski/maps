"use client";

import * as React from "react";
import Map, {
  Source,
  Layer,
  LayerProps,
  Popup,
  MapRef,
} from "react-map-gl/mapbox-legacy";
import "mapbox-gl/dist/mapbox-gl.css";
import { INITIAL_VIEW_STATE } from "./mapconfig";
import { MapMouseEvent } from "mapbox-gl";

const LocationAggregatorMap = () => {
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const mapRef = React.useRef<MapRef | null>(null);
  const [popupInfo, setPopupInfo] = React.useState<PopupInfo | null>(null);

  type PopupInfo = {
    longitude: number;
    latitude: number;
    properties: unknown;
  };

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

  const onHover = React.useCallback(
    (event: MapMouseEvent) => {
      if (!mapRef.current) return;

      const hoveredFeature = event.features && event.features[0];

      if (hoveredFeature && hoveredFeature.layer?.id === myTilesetLayer.id) {
        mapRef.current.getCanvas().style.cursor = "pointer";

        setPopupInfo({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          properties: hoveredFeature?.properties,
        });
      } else {
        mapRef.current.getCanvas().style.cursor = "";
        setPopupInfo(null);
      }
    },
    [myTilesetLayer.id]
  );

  const onClick = React.useCallback((event: MapMouseEvent) => {
    if (!mapRef.current) return;

    const hoveredFeature = event.features && event.features[0];

    console.log(hoveredFeature?.properties?.name);
  }, []);

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
        onMouseMove={onHover}
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

        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            onClose={() => setPopupInfo(null)} // Close popup when X is clicked
            closeButton={false}
            closeOnClick={false} // Don't close if user clicks elsewhere on map
            offset={[0, -15]} // Offset the popup slightly above the feature
          >
            <div className="text-black">
              <h3>
                {typeof popupInfo.properties === "object" &&
                popupInfo.properties !== null &&
                "name" in popupInfo.properties
                  ? String(
                      (popupInfo.properties as Record<string, unknown>).name ||
                        "Unnamed Lake"
                    )
                  : "Unnamed Lake"}
              </h3>
              {/* Render other properties as needed */}
              {typeof popupInfo.properties === "object" &&
              popupInfo.properties !== null
                ? Object.entries(
                    popupInfo.properties as Record<string, unknown>
                  ).map(([key, value]) => (
                    <p key={key}>
                      <strong>{key}:</strong>{" "}
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </p>
                  ))
                : null}
            </div>
          </Popup>
        )}
      </Map>
    </>
  );
};

export default LocationAggregatorMap;
