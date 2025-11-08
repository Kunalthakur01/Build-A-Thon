import { useState, useEffect } from 'react';
import { ArrowLeft, Stethoscope } from 'lucide-react';
import { PainSelector } from './components/PainSelector';
import { ExerciseCard } from './components/ExerciseCard';
import { ExerciseAnimation } from './components/ExerciseAnimation';
import {
  getPainTypes,
  getRecommendedExercises,
  ExerciseRecommendation,
} from './lib/services/physiotherapy';
import { PainType } from './lib/types/database';

function App() {
  const [painTypes, setPainTypes] = useState<PainType[]>([]);
  const [selectedPainType, setSelectedPainType] = useState<PainType | null>(null);
  const [exercises, setExercises] = useState<ExerciseRecommendation[]>([]);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    new Set()
  );
  const [activeExercise, setActiveExercise] =
    useState<ExerciseRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPainTypes();
  }, []);

  useEffect(() => {
    if (selectedPainType) {
      loadExercises(selectedPainType.id);
    }
  }, [selectedPainType]);

  const loadPainTypes = async () => {
    try {
      setLoading(true);
      const data = await getPainTypes();
      setPainTypes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load pain types. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadExercises = async (painTypeId: string) => {
    try {
      setLoading(true);
      const data = await getRecommendedExercises(painTypeId);
      setExercises(data);
      setCompletedExercises(new Set());
      setError(null);
    } catch (err) {
      setError('Failed to load exercises. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePainTypeSelect = (painType: PainType) => {
    setSelectedPainType(painType);
  };

  const handleStartExercise = (exercise: ExerciseRecommendation) => {
    setActiveExercise(exercise);
  };

  const handleExerciseComplete = () => {
    if (activeExercise) {
      setCompletedExercises((prev) => new Set([...prev, activeExercise.id]));
      setActiveExercise(null);
    }
  };

  const handleBackToPainSelection = () => {
    setSelectedPainType(null);
    setExercises([]);
    setCompletedExercises(new Set());
  };

  if (loading && painTypes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && painTypes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <AlertCircle size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadPainTypes}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Stethoscope className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                AI Physiotherapy Assistant
              </h1>
              <p className="text-sm text-gray-600">
                Personalized exercises for pain relief
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedPainType ? (
          <PainSelector
            painTypes={painTypes}
            selectedPainType={selectedPainType}
            onSelect={handlePainTypeSelect}
          />
        ) : (
          <div>
            <button
              onClick={handleBackToPainSelection}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to pain selection
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Recommended Exercises for {selectedPainType.name}
              </h2>
              <p className="text-gray-600">
                {selectedPainType.description}
              </p>
              {completedExercises.size > 0 && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    Great progress! You've completed {completedExercises.size} of{' '}
                    {exercises.length} exercises.
                  </p>
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading exercises...</p>
              </div>
            ) : exercises.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {exercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onStartExercise={handleStartExercise}
                    isCompleted={completedExercises.has(exercise.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <p className="text-gray-600">
                  No exercises found for this pain type.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {activeExercise && (
        <ExerciseAnimation
          exercise={activeExercise}
          onClose={() => setActiveExercise(null)}
          onComplete={handleExerciseComplete}
        />
      )}
    </div>
  );
}

function AlertCircle({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export default App;
