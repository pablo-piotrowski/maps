import ProtectedRoute from "@/components/protected-route";
import LocationAggregatorMap from "./map";

export default function MapPage() {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen">
        <LocationAggregatorMap />
      </div>
    </ProtectedRoute>
  );
}
