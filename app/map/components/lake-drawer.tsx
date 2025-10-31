import type React from 'react';
import type { LakeDrawerProps } from '@/types/map-components';
import FishCatchForm from './fish-catch-form';
import FishCatchesTable from './fish-catches-table';
import { useReduxAuth } from '@/lib/hooks/useReduxAuth';
import { useMapUI } from '@/lib/hooks/useMapUI';

// Refaktoryzacja: komponent nie potrzebuje już propsów isOpen/popupInfo – pobiera je ze stanu Redux.
// Zachowujemy jednak kompatybilność z obecną sygnaturą (można później oczyścić typ LakeDrawerProps).
const LakeDrawer: React.FC<LakeDrawerProps> = ({
  popupInfo: _legacyPopupInfo,
  isOpen: _legacyIsOpen,
  onClose,
  lakeCatches,
  isLoadingCatches,
  formData,
  isSubmitting,
  submitMessage,
  onInputChange,
  onFormSubmit,
}) => {
  const { user } = useReduxAuth();
  const { popupInfo, isLakeDrawerOpen } = useMapUI();

  if (!popupInfo) return null;

  const getLakeName = () => {
    if (
      typeof popupInfo.properties === 'object' &&
      popupInfo.properties !== null &&
      'name' in popupInfo.properties
    ) {
      return String(
        (popupInfo.properties as Record<string, unknown>).name ||
          'Nienazwane jezioro'
      );
    }
    return 'Nienazwane jezioro';
  };

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isLakeDrawerOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-label="Zamknij panel jeziora"
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-1/2 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isLakeDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-black">
              {getLakeName()}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none cursor-pointer"
              aria-label="Zamknij panel"
            >
              ×
            </button>
          </div>
        </div>

        {/* Recent Catches - Flexible Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-4 pb-2 flex-shrink-0">
            <h4 className="text-lg font-medium text-black mb-3">
              Ostatnie połowy ({lakeCatches.length})
            </h4>
          </div>

          <div className="flex-1 px-6 pb-4 overflow-hidden">
            <FishCatchesTable
              catches={lakeCatches}
              isLoading={isLoadingCatches}
            />
          </div>
        </div>

        {/* Fish Catch Form - Fixed at Bottom - Only for logged-in users */}
        {user && (
          <FishCatchForm
            formData={formData}
            isSubmitting={isSubmitting}
            submitMessage={submitMessage}
            onInputChange={onInputChange}
            onSubmit={onFormSubmit}
          />
        )}
      </div>
    </>
  );
};

export default LakeDrawer;
