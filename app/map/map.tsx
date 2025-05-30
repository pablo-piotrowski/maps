"use client";

import * as React from "react";
import Map from "react-map-gl/mapbox-legacy";
import "mapbox-gl/dist/mapbox-gl.css";
import DeckGL from "@deck.gl/react";

import {
  lightingEffect,
  // material,
  INITIAL_VIEW_STATE,
  // colorRange,
} from "./mapconfig";

const LocationAggregatorMap = () => {
  return (
    <div>
      <DeckGL
        effects={[lightingEffect]}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
      >
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          style={{ position: "relative", width: "100%", height: "100vh" }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
        />
      </DeckGL>
    </div>
  );
};

export default LocationAggregatorMap;
