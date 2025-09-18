import ProtectedRoute from "@/components/protected-route";
import FishMap from "./fish-map";

export default function MapPage() {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen">
        <FishMap />
      </div>
    </ProtectedRoute>
  );
}
