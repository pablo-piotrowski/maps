export default function StatsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Main Statistics Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['users', 'catches', 'species', 'lakes'].map((item) => (
            <div key={item} className="text-center space-y-2">
              <div className="h-8 bg-gray-200 rounded w-16 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['activity-1', 'activity-2', 'activity-3', 'activity-4'].map(
            (item) => (
              <div key={item} className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-12"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Rankings Skeleton */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Popular Species Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[
              'species-1',
              'species-2',
              'species-3',
              'species-4',
              'species-5',
            ].map((item) => (
              <div key={item} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="h-3 bg-gray-200 rounded w-8"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User-specific section or Active Lakes Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {['item-1', 'item-2', 'item-3', 'item-4', 'item-5'].map((item) => (
              <div key={item} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent catches or Biggest Fish Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {['catch-1', 'catch-2', 'catch-3'].map((item) => (
            <div key={item} className="grid grid-cols-4 gap-4 py-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Trophy section skeleton (for biggest fish/achievements) */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-6">
        <div className="flex items-center mb-4">
          <div className="text-2xl mr-2">🏆</div>
          <div className="h-5 bg-amber-200 rounded w-1/3"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {['info-1', 'info-2', 'info-3'].map((item) => (
            <div key={item} className="space-y-2">
              <div className="h-4 bg-amber-200 rounded w-16"></div>
              <div className="h-5 bg-amber-200 rounded w-24"></div>
              <div className="h-3 bg-amber-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
