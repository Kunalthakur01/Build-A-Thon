/*
  # Physiotherapy Assistant Database Schema

  ## Overview
  Creates the core database structure for an AI-powered physiotherapy assistant that recommends personalized exercises based on body pain types.

  ## 1. New Tables
  
  ### `pain_types`
  Stores different types of body pain that the system can address
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Pain type name (e.g., "Shoulder Pain", "Knee Pain")
  - `description` (text) - Detailed description of the pain type
  - `body_area` (text) - Body area affected (e.g., "upper_body", "lower_body")
  - `created_at` (timestamptz) - Record creation timestamp

  ### `exercises`
  Contains the exercise library with details and instructions
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Exercise name
  - `description` (text) - Detailed exercise description
  - `instructions` (text[]) - Step-by-step instructions
  - `duration_seconds` (integer) - Recommended duration
  - `repetitions` (integer) - Recommended number of reps
  - `difficulty_level` (text) - Difficulty: "beginner", "intermediate", "advanced"
  - `animation_type` (text) - Type of 3D animation to display
  - `benefits` (text[]) - List of exercise benefits
  - `precautions` (text[]) - Safety precautions
  - `created_at` (timestamptz) - Record creation timestamp

  ### `pain_exercise_mapping`
  Maps which exercises are recommended for specific pain types
  - `id` (uuid, primary key) - Unique identifier
  - `pain_type_id` (uuid, foreign key) - References pain_types
  - `exercise_id` (uuid, foreign key) - References exercises
  - `effectiveness_rating` (integer) - Rating 1-5 for effectiveness
  - `priority_order` (integer) - Order in which to recommend
  - `created_at` (timestamptz) - Record creation timestamp

  ### `user_sessions`
  Tracks user exercise sessions (optional, for future analytics)
  - `id` (uuid, primary key) - Unique identifier
  - `pain_type_id` (uuid, foreign key) - Selected pain type
  - `exercises_completed` (jsonb) - Array of completed exercise IDs
  - `session_duration_minutes` (integer) - Total session time
  - `created_at` (timestamptz) - Session timestamp

  ## 2. Security
  - Enable RLS on all tables
  - Allow public read access for pain types, exercises, and mappings (educational content)
  - User sessions would require authentication if implemented later

  ## 3. Indexes
  - Index on pain_types.body_area for filtering
  - Index on exercises.difficulty_level for filtering
  - Composite index on pain_exercise_mapping for efficient lookups

  ## 4. Sample Data
  Includes initial data for common pain types and exercises
*/

-- Create pain_types table
CREATE TABLE IF NOT EXISTS pain_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  body_area text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  instructions text[] NOT NULL DEFAULT '{}',
  duration_seconds integer DEFAULT 30,
  repetitions integer DEFAULT 10,
  difficulty_level text NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  animation_type text NOT NULL,
  benefits text[] NOT NULL DEFAULT '{}',
  precautions text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create pain_exercise_mapping table
CREATE TABLE IF NOT EXISTS pain_exercise_mapping (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pain_type_id uuid NOT NULL REFERENCES pain_types(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  effectiveness_rating integer NOT NULL CHECK (effectiveness_rating BETWEEN 1 AND 5),
  priority_order integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(pain_type_id, exercise_id)
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pain_type_id uuid NOT NULL REFERENCES pain_types(id) ON DELETE CASCADE,
  exercises_completed jsonb DEFAULT '[]',
  session_duration_minutes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pain_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_exercise_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access to educational content
CREATE POLICY "Anyone can view pain types"
  ON pain_types FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view exercises"
  ON exercises FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view exercise mappings"
  ON pain_exercise_mapping FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create sessions"
  ON user_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view sessions"
  ON user_sessions FOR SELECT
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pain_types_body_area ON pain_types(body_area);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_mapping_pain_type ON pain_exercise_mapping(pain_type_id);
CREATE INDEX IF NOT EXISTS idx_mapping_exercise ON pain_exercise_mapping(exercise_id);

-- Insert sample pain types
INSERT INTO pain_types (name, description, body_area) VALUES
  ('Shoulder Pain', 'Discomfort or pain in the shoulder joint, often from overuse, injury, or poor posture', 'upper_body'),
  ('Knee Pain', 'Pain or discomfort in the knee joint, common in athletes and older adults', 'lower_body'),
  ('Lower Back Pain', 'Pain in the lumbar region, often from muscle strain or poor posture', 'core'),
  ('Neck Pain', 'Stiffness or pain in the neck area, typically from tension or poor ergonomics', 'upper_body'),
  ('Hip Pain', 'Discomfort in the hip joint or surrounding muscles', 'lower_body')
ON CONFLICT DO NOTHING;

-- Insert sample exercises
INSERT INTO exercises (name, description, instructions, duration_seconds, repetitions, difficulty_level, animation_type, benefits, precautions) VALUES
  (
    'Pendulum Swing',
    'Gentle shoulder exercise to improve mobility and reduce stiffness',
    ARRAY['Stand and lean forward slightly', 'Let your arm hang down naturally', 'Gently swing your arm in small circles', 'Gradually increase circle size', 'Repeat in opposite direction'],
    60,
    10,
    'beginner',
    'arm_swing',
    ARRAY['Increases shoulder mobility', 'Reduces stiffness', 'Improves blood flow'],
    ARRAY['Stop if sharp pain occurs', 'Keep movements gentle', 'Do not force range of motion']
  ),
  (
    'Wall Angels',
    'Shoulder and upper back exercise to improve posture and mobility',
    ARRAY['Stand with back against wall', 'Raise arms to shoulder height', 'Slowly move arms up and down like making snow angels', 'Keep back flat against wall', 'Breathe steadily'],
    45,
    12,
    'beginner',
    'wall_slide',
    ARRAY['Improves posture', 'Strengthens upper back', 'Increases shoulder flexibility'],
    ARRAY['Keep lower back pressed to wall', 'Move slowly and controlled']
  ),
  (
    'Seated Knee Extension',
    'Strengthening exercise for quadriceps to support knee joint',
    ARRAY['Sit in a sturdy chair', 'Extend one leg straight out', 'Hold for 5 seconds', 'Lower leg slowly', 'Repeat with other leg'],
    30,
    15,
    'beginner',
    'leg_extension',
    ARRAY['Strengthens quadriceps', 'Supports knee stability', 'Improves leg strength'],
    ARRAY['Do not lock knee joint', 'Stop if knee pain worsens']
  ),
  (
    'Heel Slides',
    'Gentle knee mobility exercise to improve flexion',
    ARRAY['Lie on your back', 'Slowly slide heel toward buttocks', 'Keep foot on floor', 'Hold for 5 seconds', 'Slide back to start'],
    40,
    12,
    'beginner',
    'heel_slide',
    ARRAY['Improves knee flexibility', 'Reduces stiffness', 'Safe for recovery'],
    ARRAY['Move within comfortable range', 'Stop if sharp pain occurs']
  ),
  (
    'Cat-Cow Stretch',
    'Spinal mobility exercise for lower back pain relief',
    ARRAY['Start on hands and knees', 'Arch back up like a cat', 'Hold for 3 seconds', 'Lower back down and lift chest', 'Repeat slowly'],
    60,
    10,
    'beginner',
    'spine_flex',
    ARRAY['Increases spinal flexibility', 'Relieves tension', 'Improves posture'],
    ARRAY['Move slowly', 'Stop if pain increases', 'Breathe deeply']
  ),
  (
    'Pelvic Tilt',
    'Core strengthening exercise for lower back support',
    ARRAY['Lie on back with knees bent', 'Flatten lower back to floor', 'Tighten abdominal muscles', 'Hold for 5 seconds', 'Release slowly'],
    45,
    15,
    'beginner',
    'pelvic_tilt',
    ARRAY['Strengthens core', 'Supports lower back', 'Improves stability'],
    ARRAY['Keep movements gentle', 'Breathe normally']
  ),
  (
    'Chin Tucks',
    'Neck strengthening exercise to improve posture',
    ARRAY['Sit or stand with good posture', 'Pull chin straight back', 'Create a "double chin"', 'Hold for 5 seconds', 'Release and repeat'],
    30,
    15,
    'beginner',
    'neck_retraction',
    ARRAY['Strengthens neck muscles', 'Improves posture', 'Reduces neck strain'],
    ARRAY['Do not tilt head up or down', 'Move gently']
  ),
  (
    'Clamshell Exercise',
    'Hip strengthening exercise to improve stability',
    ARRAY['Lie on your side', 'Bend knees at 45 degrees', 'Keep feet together', 'Lift top knee up', 'Lower slowly'],
    45,
    15,
    'intermediate',
    'hip_rotation',
    ARRAY['Strengthens hip abductors', 'Improves stability', 'Supports lower body'],
    ARRAY['Keep hips stacked', 'Move in controlled manner']
  )
ON CONFLICT DO NOTHING;

-- Create mappings between pain types and exercises
INSERT INTO pain_exercise_mapping (pain_type_id, exercise_id, effectiveness_rating, priority_order)
SELECT 
  (SELECT id FROM pain_types WHERE name = 'Shoulder Pain'),
  (SELECT id FROM exercises WHERE name = 'Pendulum Swing'),
  5, 1
WHERE EXISTS (SELECT 1 FROM pain_types WHERE name = 'Shoulder Pain')
  AND EXISTS (SELECT 1 FROM exercises WHERE name = 'Pendulum Swing')
ON CONFLICT DO NOTHING;

INSERT INTO pain_exercise_mapping (pain_type_id, exercise_id, effectiveness_rating, priority_order)
SELECT 
  (SELECT id FROM pain_types WHERE name = 'Shoulder Pain'),
  (SELECT id FROM exercises WHERE name = 'Wall Angels'),
  4, 2
WHERE EXISTS (SELECT 1 FROM pain_types WHERE name = 'Shoulder Pain')
  AND EXISTS (SELECT 1 FROM exercises WHERE name = 'Wall Angels')
ON CONFLICT DO NOTHING;

INSERT INTO pain_exercise_mapping (pain_type_id, exercise_id, effectiveness_rating, priority_order)
SELECT 
  (SELECT id FROM pain_types WHERE name = 'Knee Pain'),
  (SELECT id FROM exercises WHERE name = 'Seated Knee Extension'),
  5, 1
WHERE EXISTS (SELECT 1 FROM pain_types WHERE name = 'Knee Pain')
  AND EXISTS (SELECT 1 FROM exercises WHERE name = 'Seated Knee Extension')
ON CONFLICT DO NOTHING;

INSERT INTO pain_exercise_mapping (pain_type_id, exercise_id, effectiveness_rating, priority_order)
SELECT 
  (SELECT id FROM pain_types WHERE name = 'Knee Pain'),
  (SELECT id FROM exercises WHERE name = 'Heel Slides'),
  4, 2
WHERE EXISTS (SELECT 1 FROM pain_types WHERE name = 'Knee Pain')
  AND EXISTS (SELECT 1 FROM exercises WHERE name = 'Heel Slides')
ON CONFLICT DO NOTHING;

INSERT INTO pain_exercise_mapping (pain_type_id, exercise_id, effectiveness_rating, priority_order)
SELECT 
  (SELECT id FROM pain_types WHERE name = 'Lower Back Pain'),
  (SELECT id FROM exercises WHERE name = 'Cat-Cow Stretch'),
  5, 1
WHERE EXISTS (SELECT 1 FROM pain_types WHERE name = 'Lower Back Pain')
  AND EXISTS (SELECT 1 FROM exercises WHERE name = 'Cat-Cow Stretch')
ON CONFLICT DO NOTHING;

INSERT INTO pain_exercise_mapping (pain_type_id, exercise_id, effectiveness_rating, priority_order)
SELECT 
  (SELECT id FROM pain_types WHERE name = 'Lower Back Pain'),
  (SELECT id FROM exercises WHERE name = 'Pelvic Tilt'),
  5, 2
WHERE EXISTS (SELECT 1 FROM pain_types WHERE name = 'Lower Back Pain')
  AND EXISTS (SELECT 1 FROM exercises WHERE name = 'Pelvic Tilt')
ON CONFLICT DO NOTHING;

INSERT INTO pain_exercise_mapping (pain_type_id, exercise_id, effectiveness_rating, priority_order)
SELECT 
  (SELECT id FROM pain_types WHERE name = 'Neck Pain'),
  (SELECT id FROM exercises WHERE name = 'Chin Tucks'),
  5, 1
WHERE EXISTS (SELECT 1 FROM pain_types WHERE name = 'Neck Pain')
  AND EXISTS (SELECT 1 FROM exercises WHERE name = 'Chin Tucks')
ON CONFLICT DO NOTHING;

INSERT INTO pain_exercise_mapping (pain_type_id, exercise_id, effectiveness_rating, priority_order)
SELECT 
  (SELECT id FROM pain_types WHERE name = 'Hip Pain'),
  (SELECT id FROM exercises WHERE name = 'Clamshell Exercise'),
  5, 1
WHERE EXISTS (SELECT 1 FROM pain_types WHERE name = 'Hip Pain')
  AND EXISTS (SELECT 1 FROM exercises WHERE name = 'Clamshell Exercise')
ON CONFLICT DO NOTHING;