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
import MapHeader from "@/components/map-header";
import { useAuth } from "@/lib/auth-context";
import { FishCatch } from "@/types/fish-catch";

const LocationAggregatorMap = () => {
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const mapRef = React.useRef<MapRef | null>(null);
  const [popupInfo, setPopupInfo] = React.useState<PopupInfo | null>(null);
  const { token } = useAuth();

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

  // Fish catches state
  const [lakeCatches, setLakeCatches] = React.useState<FishCatch[]>([]);
  const [isLoadingCatches, setIsLoadingCatches] = React.useState(false);
  const { user } = useAuth();

  // Drawer animation state
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

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

  // Fetch fish catches for a specific lake
  const fetchLakeCatches = React.useCallback(
    async (lakeId: string) => {
      if (!token) return;

      setIsLoadingCatches(true);
      try {
        const response = await fetch(
          `/api/fish-catch?lake_id=${encodeURIComponent(lakeId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Sort catches: current user first, then others
            const sortedCatches = result.data.sort(
              (a: FishCatch, b: FishCatch) => {
                // Current user's catches first
                if (user && a.user_id === user.id && b.user_id !== user.id)
                  return -1;
                if (user && b.user_id === user.id && a.user_id !== user.id)
                  return 1;
                // Then sort by date/time descending
                return (
                  new Date(`${b.date} ${b.time}`).getTime() -
                  new Date(`${a.date} ${a.time}`).getTime()
                );
              }
            );
            setLakeCatches(sortedCatches);
          }
        } else {
          console.error("API Error:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Failed to fetch lake catches:", error);
      } finally {
        setIsLoadingCatches(false);
      }
    },
    [token, user]
  );

  // Fetch catches when popup opens
  React.useEffect(() => {
    if (
      popupInfo &&
      typeof popupInfo.properties === "object" &&
      popupInfo.properties !== null &&
      "name" in popupInfo.properties
    ) {
      const lakeId = String(
        (popupInfo.properties as Record<string, unknown>).name
      );
      fetchLakeCatches(lakeId);
      // Trigger drawer animation after a small delay
      setTimeout(() => setIsDrawerOpen(true), 50);
    } else {
      setIsDrawerOpen(false);
    }
  }, [popupInfo, fetchLakeCatches]);

  // Handle drawer close with animation
  const handleCloseDrawer = React.useCallback(() => {
    setIsDrawerOpen(false);
    // Close popup after animation completes
    setTimeout(() => {
      setPopupInfo(null);
      setSubmitMessage(null);
    }, 300);
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submitData),
        });

        const result = await response.json();

        if (response.status === 401) {
          setSubmitMessage({
            type: "error",
            text: "Authentication failed. Please log in again.",
          });
          return;
        }

        if (result.success) {
          setSubmitMessage({
            type: "success",
            text: "Fish catch recorded successfully!",
          });
          // Reset form
          setFormData({ fish: "", length: "", weight: "" });
          // Refresh catch list for this lake
          const lakeId =
            typeof popupInfo.properties === "object" &&
            popupInfo.properties !== null &&
            "name" in popupInfo.properties
              ? String((popupInfo.properties as Record<string, unknown>).name)
              : "unknown_lake";
          fetchLakeCatches(lakeId);
          // Clear success message after 2 seconds
          setTimeout(() => {
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
    [popupInfo, formData, token, fetchLakeCatches]
  );

  const handleInputChange = React.useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return (
    <>
      <MapHeader />
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
          <>
            {/* Backdrop */}
            <div
              className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
                isDrawerOpen ? "opacity-100" : "opacity-0"
              }`}
              onClick={handleCloseDrawer}
            />

            {/* Drawer */}
            <div
              className={`fixed inset-y-0 right-0 w-full md:w-1/2 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
                isDrawerOpen ? "translate-x-0" : "translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 flex-shrink-0">
                <div className="flex justify-between items-start">
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
                    onClick={handleCloseDrawer}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Recent Catches - Flexible Content Area */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="px-6 pt-4 pb-2 flex-shrink-0">
                  <h4 className="text-lg font-medium text-black mb-3">
                    Recent Catches ({lakeCatches.length})
                  </h4>
                </div>

                <div className="flex-1 px-6 pb-4 overflow-hidden">
                  {isLoadingCatches ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  ) : lakeCatches.length > 0 ? (
                    <div className="h-full overflow-y-auto border rounded-md">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">
                              Angler
                            </th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">
                              Fish
                            </th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">
                              Size
                            </th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {lakeCatches.map((catch_) => (
                            <tr
                              key={catch_.id}
                              className={`${
                                user && catch_.user_id === user.id
                                  ? "bg-blue-50"
                                  : "bg-white"
                              } hover:bg-gray-50`}
                            >
                              <td className="px-3 py-2 text-gray-900">
                                <div className="flex items-center">
                                  {user && catch_.user_id === user.id && (
                                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                  )}
                                  {catch_.username ||
                                    (catch_.user_id
                                      ? "Unknown User"
                                      : "Anonymous")}
                                  {user && catch_.user_id === user.id && (
                                    <span className="ml-1 text-xs text-blue-600">
                                      (You)
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-2 text-gray-900 font-medium">
                                {catch_.fish}
                              </td>
                              <td className="px-3 py-2 text-gray-600">
                                {catch_.length && catch_.weight ? (
                                  <div>
                                    <div>{catch_.length}cm</div>
                                    <div className="text-xs text-gray-500">
                                      {catch_.weight}g
                                    </div>
                                  </div>
                                ) : catch_.length ? (
                                  `${catch_.length}cm`
                                ) : catch_.weight ? (
                                  `${catch_.weight}g`
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td className="px-3 py-2 text-gray-600 text-xs">
                                <div>
                                  {new Date(catch_.date).toLocaleDateString()}
                                </div>
                                <div className="text-gray-400">
                                  {catch_.time}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center py-8 text-gray-500 text-sm border rounded-md bg-gray-50 w-full">
                        No catches recorded for this lake yet.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fish Catch Form - Fixed at Bottom */}
              <div className="flex-shrink-0 border-t border-gray-200 bg-white">
                <div className="px-6 py-6">
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

                  <form
                    onSubmit={handleFormSubmit}
                    className="space-y-4 text-black"
                  >
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
          </>
        )}
      </Map>
    </>
  );
};

export default LocationAggregatorMap;
