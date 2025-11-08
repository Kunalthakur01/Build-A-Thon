import { Clock, Repeat, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { ExerciseRecommendation } from '../lib/services/physiotherapy';

interface ExerciseCardProps {
  exercise: ExerciseRecommendation;
  onStartExercise: (exercise: ExerciseRecommendation) => void;
  isCompleted: boolean;
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

export function ExerciseCard({
  exercise,
  onStartExercise,
  isCompleted,
}: ExerciseCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {exercise.name}
              </h3>
              {isCompleted && (
                <CheckCircle className="text-green-500" size={20} />
              )}
            </div>
            <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  difficultyColors[exercise.difficulty_level]
                }`}
              >
                {exercise.difficulty_level.charAt(0).toUpperCase() +
                  exercise.difficulty_level.slice(1)}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1">
                <Star size={12} />
                {exercise.effectiveness_rating}/5 Effectiveness
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{exercise.duration_seconds}s</span>
          </div>
          <div className="flex items-center gap-1">
            <Repeat size={16} />
            <span>{exercise.repetitions} reps</span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2 text-sm">
            Instructions:
          </h4>
          <ol className="list-decimal list-inside space-y-1">
            {exercise.instructions.map((instruction, index) => (
              <li key={index} className="text-sm text-gray-600">
                {instruction}
              </li>
            ))}
          </ol>
        </div>

        {exercise.benefits.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2 text-sm flex items-center gap-1">
              <CheckCircle size={14} />
              Benefits:
            </h4>
            <ul className="space-y-1">
              {exercise.benefits.map((benefit, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {exercise.precautions.length > 0 && (
          <div className="mb-4 bg-amber-50 p-3 rounded-lg">
            <h4 className="font-medium text-amber-900 mb-2 text-sm flex items-center gap-1">
              <AlertCircle size={14} />
              Precautions:
            </h4>
            <ul className="space-y-1">
              {exercise.precautions.map((precaution, index) => (
                <li key={index} className="text-sm text-amber-800 flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>{precaution}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={() => onStartExercise(exercise)}
          disabled={isCompleted}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
            isCompleted
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isCompleted ? 'Exercise Completed' : 'Start Exercise'}
        </button>
      </div>
    </div>
  );
}
