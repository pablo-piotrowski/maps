"use client";

import * as React from "react";
import Map, { Source, Layer, LayerProps } from "react-map-gl/mapbox-legacy";
import "mapbox-gl/dist/mapbox-gl.css";

import { INITIAL_VIEW_STATE } from "./mapconfig";

const LocationAggregatorMap = () => {
  const [mapLoaded, setMapLoaded] = React.useState(false);

  const myVectorTilesetSource = {
    type: "vector",
    url: "mapbox://ppiotrowski.bwg5i0qk", // ZMIENIONO URL
  };

  const onMapLoad = React.useCallback(() => {
    setMapLoaded(true);
  }, []);

  const myTilesetLayer: LayerProps = {
    id: "my-custom-data-layer",
    type: "line",
    "source-layer": "export-8r3k7q", // The name of the layer within your tileset
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#ff69b4",
      "line-width": 3,
    },
  };

  return (
    <div>
      <Map
        id="my-custom-tileset-source"
        initialViewState={INITIAL_VIEW_STATE}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        style={{ position: "relative", width: "100%", height: "100vh" }}
        mapStyle="mapbox://styles/ppiotrowski/cmbesfnjn004t01r02wpgahpe"
        onLoad={onMapLoad}
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
      </Map>
    </div>
  );
};

export default LocationAggregatorMap;
