import { supabase } from '../supabase';
import { PainType, Exercise } from '../types/database';

export interface ExerciseRecommendation extends Exercise {
  effectiveness_rating: number;
  priority_order: number;
}

export async function getPainTypes(): Promise<PainType[]> {
  const { data, error } = await supabase
    .from('pain_types')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function getRecommendedExercises(
  painTypeId: string
): Promise<ExerciseRecommendation[]> {
  const { data, error } = await supabase
    .from('pain_exercise_mapping')
    .select(`
      effectiveness_rating,
      priority_order,
      exercises (*)
    `)
    .eq('pain_type_id', painTypeId)
    .order('priority_order');

  if (error) throw error;

  return (data || []).map((item) => ({
    ...(item.exercises as Exercise),
    effectiveness_rating: item.effectiveness_rating,
    priority_order: item.priority_order,
  }));
}

export async function createSession(
  painTypeId: string,
  exercisesCompleted: string[]
): Promise<void> {
  const { error } = await supabase.from('user_sessions').insert({
    pain_type_id: painTypeId,
    exercises_completed: exercisesCompleted,
    session_duration_minutes: 0,
  });

  if (error) throw error;
}
