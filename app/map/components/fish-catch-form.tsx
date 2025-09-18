import React from "react";
import { FishCatchFormProps } from "@/types/map-components";

const FishCatchForm: React.FC<FishCatchFormProps> = ({
  formData,
  isSubmitting,
  submitMessage,
  onInputChange,
  onSubmit,
}) => {
  return (
    <div className="flex-shrink-0 border-t border-gray-200 bg-white">
      <div className="px-6 py-6">
        <h4 className="text-lg font-medium text-black mb-4">Log Fish Catch</h4>

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

        <form onSubmit={onSubmit} className="space-y-4 text-black">
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
              onChange={(e) => onInputChange("fish", e.target.value)}
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
                onChange={(e) => onInputChange("length", e.target.value)}
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
                onChange={(e) => onInputChange("weight", e.target.value)}
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
  );
};

export default FishCatchForm;
