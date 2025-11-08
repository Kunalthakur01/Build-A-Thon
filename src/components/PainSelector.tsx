import { Activity, User, Heart } from 'lucide-react';
import { PainType } from '../lib/types/database';

interface PainSelectorProps {
  painTypes: PainType[];
  selectedPainType: PainType | null;
  onSelect: (painType: PainType) => void;
}

const bodyAreaIcons: Record<string, typeof Activity> = {
  upper_body: Activity,
  lower_body: User,
  core: Heart,
};

const bodyAreaColors: Record<string, string> = {
  upper_body: 'bg-blue-500',
  lower_body: 'bg-green-500',
  core: 'bg-orange-500',
};

export function PainSelector({
  painTypes,
  selectedPainType,
  onSelect,
}: PainSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          What area is causing you discomfort?
        </h2>
        <p className="text-gray-600">
          Select the type of pain you're experiencing to get personalized exercise
          recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {painTypes.map((painType) => {
          const Icon = bodyAreaIcons[painType.body_area] || Activity;
          const colorClass = bodyAreaColors[painType.body_area] || 'bg-gray-500';
          const isSelected = selectedPainType?.id === painType.id;

          return (
            <button
              key={painType.id}
              onClick={() => onSelect(painType)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`${colorClass} p-3 rounded-lg text-white flex-shrink-0`}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {painType.name}
                  </h3>
                  <p className="text-sm text-gray-600">{painType.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
