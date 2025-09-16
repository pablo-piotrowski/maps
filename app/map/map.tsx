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

const LocationAggregatorMap = () => {
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const mapRef = React.useRef<MapRef | null>(null);
  const [popupInfo, setPopupInfo] = React.useState<PopupInfo | null>(null);

  // Form state
  const [formData, setFormData] = React.useState({
    fish: "",
    length: "",
    weight: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

  const onClick = React.useCallback(
    (event: MapMouseEvent) => {
      if (!mapRef.current) return;

      const clickedFeature = event.features && event.features[0];

      if (clickedFeature && clickedFeature.layer?.id === myTilesetLayer.id) {
        setPopupInfo({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          properties: clickedFeature?.properties,
        });
      }
    },
    [myTilesetLayer.id]
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

  const handleFormSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!popupInfo || !formData.fish) {
        setSubmitMessage({ type: "error", text: "Fish type is required" });
        return;
      }

      setIsSubmitting(true);
      setSubmitMessage(null);

      try {
        // Get current date and time
        const now = new Date();
        const date = now.toISOString().split("T")[0]; // YYYY-MM-DD format
        const time = now.toTimeString().split(" ")[0]; // HH:MM:SS format

        // Get lake_id from popup properties
        const lakeId =
          typeof popupInfo.properties === "object" &&
          popupInfo.properties !== null &&
          "name" in popupInfo.properties
            ? String((popupInfo.properties as Record<string, unknown>).name)
            : "unknown_lake";

        const submitData = {
          lake_id: lakeId,
          fish: formData.fish,
          length: formData.length ? parseFloat(formData.length) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          date,
          time,
        };

        const response = await fetch("/api/fish-catch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        });

        const result = await response.json();

        if (result.success) {
          setSubmitMessage({
            type: "success",
            text: "Fish catch recorded successfully!",
          });
          // Reset form
          setFormData({ fish: "", length: "", weight: "" });
          // Close modal after 2 seconds
          setTimeout(() => {
            setPopupInfo(null);
            setSubmitMessage(null);
          }, 2000);
        } else {
          setSubmitMessage({
            type: "error",
            text: result.error || "Failed to record fish catch",
          });
        }
      } catch (error) {
        setSubmitMessage({
          type: "error",
          text: "Network error. Please try again. " + error,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [popupInfo, formData]
  );

  const handleInputChange = React.useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
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

        {popupInfo && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setPopupInfo(null)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex-shrink-0">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-black">
                    {typeof popupInfo.properties === "object" &&
                    popupInfo.properties !== null &&
                    "name" in popupInfo.properties
                      ? String(
                          (popupInfo.properties as Record<string, unknown>)
                            .name || "Unnamed Lake"
                        )
                      : "Unnamed Lake"}
                  </h3>
                  <button
                    onClick={() => setPopupInfo(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Lake Properties */}
              <div className="px-6 pb-4 max-h-32 overflow-y-auto">
                <div className="space-y-2 pr-2">
                  {typeof popupInfo.properties === "object" &&
                  popupInfo.properties !== null
                    ? Object.entries(
                        popupInfo.properties as Record<string, unknown>
                      ).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <strong className="text-gray-700">{key}:</strong>{" "}
                          <span className="text-gray-600">
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                          </span>
                        </div>
                      ))
                    : null}
                </div>
              </div>

              {/* Fish Catch Form */}
              <div className="px-6 p-6">
                <h4 className="text-lg font-medium text-black mb-4">
                  Log Fish Catch
                </h4>

                {submitMessage && (
                  <div
                    className={`mb-4 p-3 rounded ${
                      submitMessage.type === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {submitMessage.text}
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="fish"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Fish Type *
                    </label>
                    <input
                      type="text"
                      id="fish"
                      value={formData.fish}
                      onChange={(e) =>
                        handleInputChange("fish", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Bass, Pike, Perch"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="length"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Length (cm)
                      </label>
                      <input
                        type="number"
                        id="length"
                        value={formData.length}
                        onChange={(e) =>
                          handleInputChange("length", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="25.5"
                        step="0.1"
                        min="0"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="weight"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        id="weight"
                        value={formData.weight}
                        onChange={(e) =>
                          handleInputChange("weight", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="2.5"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.fish}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? "Recording..." : "Record Catch"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </Map>
    </>
  );
};

export default LocationAggregatorMap;
