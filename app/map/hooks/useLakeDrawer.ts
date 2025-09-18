import { useState, useCallback, useEffect } from "react";
import { PopupInfo } from "@/types/map-components";

export const useLakeDrawer = (
  fetchLakeCatches: (lakeId: string) => void,
  onCloseCallback?: () => void
) => {
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch catches when popup opens
  useEffect(() => {
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
  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    // Close popup after animation completes
    setTimeout(() => {
      setPopupInfo(null);
      if (onCloseCallback) {
        onCloseCallback();
      }
    }, 300);
  }, [onCloseCallback]);

  const openDrawerForLake = useCallback(
    (longitude: number, latitude: number, properties: unknown) => {
      setPopupInfo({
        longitude,
        latitude,
        properties,
      });
    },
    []
  );

  return {
    popupInfo,
    isDrawerOpen,
    handleCloseDrawer,
    openDrawerForLake,
  };
};
