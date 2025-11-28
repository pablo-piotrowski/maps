import type React from 'react';
import { useId } from 'react';
import type { FishCatchFormProps } from '@/types/map-components';

const FishCatchForm: React.FC<FishCatchFormProps> = ({
  formData,
  isSubmitting,
  submitMessage,
  onInputChange,
  onSubmit,
}) => {
  const fishId = useId();
  const lengthId = useId();
  const weightId = useId();
  return (
    <div className="flex-shrink-0 border-t border-gray-200 bg-white">
      <div className="px-6 py-6">
        <h4 className="text-lg font-medium text-black mb-4">
          Zapisz złowioną rybę
        </h4>

        {submitMessage && (
          <div
            className={`mb-4 p-3 rounded ${
              submitMessage.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4 text-black">
          <div>
            <label
              htmlFor={fishId}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Rodzaj ryby *
            </label>
            <input
              type="text"
              id={fishId}
              value={formData.fish}
              onChange={(e) => onInputChange('fish', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="np. Okoń, Szczupak, Karp"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor={lengthId}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Długość (cm) *
              </label>
              <input
                type="number"
                id={lengthId}
                value={formData.length}
                onChange={(e) => onInputChange('length', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="25.5"
                step="0.1"
                min="0"
                required
              />
            </div>

            <div>
              <label
                htmlFor={weightId}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Waga (kg) *
              </label>
              <input
                type="number"
                id={weightId}
                value={formData.weight}
                onChange={(e) => onInputChange('weight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2.5"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={
              isSubmitting ||
              !formData.fish ||
              !formData.length ||
              !formData.weight
            }
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Zapisywanie...' : 'Zapisz połów'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FishCatchForm;
