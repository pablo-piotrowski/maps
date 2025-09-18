import React from "react";
import { FishCatchesTableProps } from "@/types/map-components";

const FishCatchesTable: React.FC<FishCatchesTableProps> = ({
  catches,
  isLoading,
  currentUserId,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (catches.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center py-8 text-gray-500 text-sm border rounded-md bg-gray-50 w-full">
          No catches recorded for this lake yet.
        </div>
      </div>
    );
  }

  return (
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
          {catches.map((catch_) => (
            <tr
              key={catch_.id}
              className={`${
                currentUserId && catch_.user_id === currentUserId
                  ? "bg-blue-50"
                  : "bg-white"
              } hover:bg-gray-50`}
            >
              <td className="px-3 py-2 text-gray-900">
                <div className="flex items-center">
                  {currentUserId && catch_.user_id === currentUserId && (
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  )}
                  {catch_.username ||
                    (catch_.user_id ? "Unknown User" : "Anonymous")}
                  {currentUserId && catch_.user_id === currentUserId && (
                    <span className="ml-1 text-xs text-blue-600">(You)</span>
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
                <div>{new Date(catch_.date).toLocaleDateString()}</div>
                <div className="text-gray-400">{catch_.time}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FishCatchesTable;
