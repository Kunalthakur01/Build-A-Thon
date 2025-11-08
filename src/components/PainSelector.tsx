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

const bodyAreaGradients: Record<string, string> = {
  upper_body: 'from-sky-400 to-blue-500',
  lower_body: 'from-emerald-400 to-green-500',
  core: 'from-amber-400 to-orange-500',
};

export function PainSelector({
  painTypes,
  selectedPainType,
  onSelect,
}: PainSelectorProps) {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-3 tracking-tight">
          Where are you feeling discomfort?
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Select the area of pain below to receive guided exercises tailored to your recovery.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {painTypes.map((painType) => {
          const Icon = bodyAreaIcons[painType.body_area] || Activity;
          const gradient = bodyAreaGradients[painType.body_area] || 'from-gray-400 to-gray-600';
          const isSelected = selectedPainType?.id === painType.id;

          return (
            <button
              key={painType.id}
              onClick={() => onSelect(painType)}
              className={`relative p-8 rounded-2xl border transition-all duration-300 text-left backdrop-blur-md
                ${
                  isSelected
                    ? 'bg-white/70 border-blue-500 shadow-xl scale-[1.03]'
                    : 'bg-white/50 hover:bg-white/70 border-gray-200 hover:shadow-lg'
                }`}
            >
              <div className="flex items-start gap-5">
                <div
                  className={`p-4 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}
                >
                  <Icon size={28} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {painType.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-snug">
                    {painType.description}
                  </p>
                </div>
              </div>

              <div
                className={`absolute inset-0 rounded-2xl transition-all duration-300
                  ${
                    isSelected
                      ? 'ring-4 ring-blue-400/50 shadow-inner'
                      : 'hover:ring-2 hover:ring-blue-200/50'
                  }`}
              ></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
