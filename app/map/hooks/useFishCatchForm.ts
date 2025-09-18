import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  FishCatchFormData,
  SubmitMessage,
  PopupInfo,
} from "@/types/map-components";

export const useFishCatchForm = (
  onSuccessCallback?: (lakeId: string) => void
) => {
  const [formData, setFormData] = useState<FishCatchFormData>({
    fish: "",
    length: "",
    weight: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<SubmitMessage | null>(
    null
  );
  const { token } = useAuth();

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ fish: "", length: "", weight: "" });
    setSubmitMessage(null);
  }, []);

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent, popupInfo: PopupInfo | null) => {
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

          // Call success callback to refresh data
          if (onSuccessCallback) {
            onSuccessCallback(lakeId);
          }

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
    [formData, token, onSuccessCallback]
  );

  return {
    formData,
    isSubmitting,
    submitMessage,
    handleInputChange,
    handleFormSubmit,
    resetForm,
    setSubmitMessage,
  };
};
