/*
  # Resume Application Database Schema

  1. New Tables
    - `candidates` - Stores user profile information
    - `experiences` - Work experience entries linked to candidates
    - `skills` - Skills and proficiency levels for candidates
    - `education` - Educational background information
    - `certifications` - Professional certifications
    - `languages` - Language proficiencies
    - `tailored_resumes` - Job-specific resume versions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Users can only access data they own (linked via user_id or candidate_id)

  3. Features
    - UUID primary keys for all tables
    - Automatic timestamps for audit trails
    - Foreign key relationships for data integrity
    - JSON arrays for flexible data storage (achievements, skills, etc.)
*/

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  location text DEFAULT '',
  linkedin text,
  portfolio text,
  summary text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
  company text DEFAULT '',
  position text DEFAULT '',
  start_date text DEFAULT '',
  end_date text,
  current boolean DEFAULT false,
  description text,
  achievements text[] DEFAULT '{}',
  skills text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text DEFAULT 'Other',
  level text DEFAULT 'Intermediate',
  created_at timestamptz DEFAULT now()
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
  institution text NOT NULL,
  degree text NOT NULL,
  field text NOT NULL,
  graduation_date text NOT NULL,
  gpa text,
  honors text,
  created_at timestamptz DEFAULT now()
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  issuer text NOT NULL,
  date text NOT NULL,
  expiry_date text,
  credential_id text,
  created_at timestamptz DEFAULT now()
);

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  proficiency text DEFAULT 'Professional Working',
  created_at timestamptz DEFAULT now()
);

-- Create tailored_resumes table
CREATE TABLE IF NOT EXISTS tailored_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
  job_title text NOT NULL,
  company text,
  job_description text NOT NULL,
  matched_skills text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tailored_resumes ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for candidates table
CREATE POLICY "Users can manage their own candidate profile"
  ON candidates
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS Policies for experiences table
CREATE POLICY "Users can manage their own experiences"
  ON experiences
  FOR ALL
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM candidates WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    candidate_id IN (
      SELECT id FROM candidates WHERE user_id = auth.uid()
    )
  );

-- Create RLS Policies for skills table
CREATE POLICY "Users can manage their own skills"
  ON skills
  FOR ALL
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM candidates WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    candidate_id IN (
      SELECT id FROM candidates WHERE user_id = auth.uid()
    )
  );

-- Create RLS Policies for education table
CREATE POLICY "Users can manage their own education"
  ON education
  FOR ALL
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM candidates WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    candidate_id IN (
      SELECT id FROM candidates WHERE user_id = auth.uid()
    )
  );

-- Create RLS Policies for certifications table
CREATE POLICY "Users can manage their own certifications"
  ON certifications
  FOR ALL
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM candidates WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    candidate_id IN (
      SELECT id FROM candidates WHERE user_id = auth.uid()
    )
  );

-- Create RLS Policies for languages table
CREATE POLICY "Users can manage their own languages"
  ON languages
  FOR ALL
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM candidates WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    candidate_id IN (
      SELECT id FROM candidates WHERE user_id = auth.uid()
    )
  );

-- Create RLS Policies for tailored_resumes table
CREATE POLICY "Users can manage their own tailored resumes"
  ON tailored_resumes
  FOR ALL
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM candidates WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    candidate_id IN (
      SELECT id FROM candidates WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON candidates(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_candidate_id ON experiences(candidate_id);
CREATE INDEX IF NOT EXISTS idx_skills_candidate_id ON skills(candidate_id);
CREATE INDEX IF NOT EXISTS idx_education_candidate_id ON education(candidate_id);
CREATE INDEX IF NOT EXISTS idx_certifications_candidate_id ON certifications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_languages_candidate_id ON languages(candidate_id);
CREATE INDEX IF NOT EXISTS idx_tailored_resumes_candidate_id ON tailored_resumes(candidate_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for candidates table
CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();