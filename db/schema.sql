-- Create tables for the application

-- Create substance_logs table
CREATE TABLE IF NOT EXISTS substance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  substance_type TEXT NOT NULL,
  substance_subtype TEXT,
  amount TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  context TEXT,
  location TEXT,
  emotional_state TEXT,
  purpose TEXT,
  intention_outcome TEXT,
  harm_points FLOAT NOT NULL DEFAULT 1,
  supplements TEXT[],
  notes TEXT,
  feeling_during INTEGER,
  feeling_after INTEGER,
  notes_during TEXT,
  notes_after TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create intervention_logs table
CREATE TABLE IF NOT EXISTS intervention_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  intervention_type TEXT NOT NULL,
  subtype TEXT,
  duration INTEGER,
  intensity TEXT,
  quantity FLOAT,
  quality_rating INTEGER,
  context TEXT,
  location TEXT,
  intention_outcome TEXT,
  harm_reduction FLOAT NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sleep_logs table
CREATE TABLE IF NOT EXISTS sleep_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  bedtime TEXT NOT NULL,
  wake_time TEXT NOT NULL,
  duration INTEGER NOT NULL,
  quality TEXT NOT NULL,
  supplements TEXT[],
  notes TEXT,
  harm_reduction FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercise_logs table
CREATE TABLE IF NOT EXISTS exercise_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  activity_type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  intensity TEXT NOT NULL,
  notes TEXT,
  harm_reduction FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create substance_breaks table
CREATE TABLE IF NOT EXISTS substance_breaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  substance_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  goal_duration TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  harm_reduction FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create harm_index table
CREATE TABLE IF NOT EXISTS harm_index (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  score FLOAT NOT NULL,
  substance_harm FLOAT NOT NULL,
  intervention_reduction FLOAT NOT NULL,
  decay_reduction FLOAT NOT NULL,
  factors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create custom_substances table
CREATE TABLE IF NOT EXISTS custom_substances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  harm_points_per_unit FLOAT NOT NULL DEFAULT 1,
  unit_name TEXT NOT NULL DEFAULT 'dose',
  half_life_days INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create custom_supplements table
CREATE TABLE IF NOT EXISTS custom_supplements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_substance_logs_user_id ON substance_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_intervention_logs_user_id ON intervention_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_user_id ON sleep_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_user_id ON exercise_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_substance_breaks_user_id ON substance_breaks(user_id);
CREATE INDEX IF NOT EXISTS idx_harm_index_user_id ON harm_index(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_substances_user_id ON custom_substances(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_supplements_user_id ON custom_supplements(user_id);
