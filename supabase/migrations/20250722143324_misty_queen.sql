/*
  # Resume Application Database Schema

  1. New Tables
    - `candidates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `location` (text)
      - `linkedin` (text, optional)
      - `portfolio` (text, optional)
      - `summary` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `experiences`
      - `id` (uuid, primary key)
      - `candidate_id` (uuid, references candidates)
      - `company` (text)
      - `position` (text)
      - `start_date` (text)
      - `end_date` (text, optional)
      - `current` (boolean)
      - `description` (text)
      - `achievements` (jsonb array)
      - `skills` (jsonb array)
      - `created_at` (timestamp)
    
    - `skills`
      - `id` (uuid, primary key)
      - `candidate_id` (uuid, references candidates)
      - `name` (text)
      - `category` (text)
      - `level` (text)
      - `created_at` (timestamp)
    
    - `education`
      - `id` (uuid, primary key)
      - `candidate_id` (uuid, references candidates)
      - `institution` (text)
      - `degree` (text)
      - `field` (text)
      - `graduation_date` (text)
      - `gpa` (text, optional)
      - `honors` (text, optional)
      - `created_at` (timestamp)
    
    - `certifications`
      - `id` (uuid, primary key)
      - `candidate_id` (uuid, references candidates)
      - `name` (text)
      - `issuer` (text)
      - `date` (text)
      - `expiry_date` (text, optional)
      - `credential_id` (text, optional)
      - `created_at` (timestamp)
    
    - `languages`
      - `id` (uuid, primary key)
      - `candidate_id` (uuid, references candidates)
      - `name` (text)
      - `proficiency` (text)
      - `created_at` (timestamp)
    
    - `tailored_resumes`
      - `id` (uuid, primary key)
      - `candidate_id` (uuid, references candidates)
      - `job_title` (text)
      - `company` (text, optional)
      - `job_description` (text)
      - `matched_skills` (jsonb array)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  linkedin text DEFAULT '',
  portfolio text DEFAULT '',
  summary text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  company text NOT NULL DEFAULT '',
  position text NOT NULL DEFAULT '',
  start_date text NOT NULL DEFAULT '',
  end_date text DEFAULT '',
  current boolean DEFAULT false,
  description text DEFAULT '',
  achievements jsonb DEFAULT '[]'::jsonb,
  skills jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Other',
  level text NOT NULL DEFAULT 'Intermediate',
  created_at timestamptz DEFAULT now()
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  institution text NOT NULL,
  degree text NOT NULL,
  field text NOT NULL,
  graduation_date text NOT NULL,
  gpa text DEFAULT '',
  honors text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  name text NOT NULL,
  issuer text NOT NULL,
  date text NOT NULL,
  expiry_date text DEFAULT '',
  credential_id text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  name text NOT NULL,
  proficiency text NOT NULL DEFAULT 'Professional Working',
  created_at timestamptz DEFAULT now()
);

-- Create tailored_resumes table
CREATE TABLE IF NOT EXISTS tailored_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  job_title text NOT NULL,
  company text DEFAULT '',
  job_description text NOT NULL,
  matched_skills jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tailored_resumes ENABLE ROW LEVEL SECURITY;

-- Create policies for candidates table
CREATE POLICY "Users can manage their own candidate data"
  ON candidates
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for experiences table
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

-- Create policies for skills table
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

-- Create policies for education table
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

-- Create policies for certifications table
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

-- Create policies for languages table
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

-- Create policies for tailored_resumes table
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

-- Create function to update updated_at timestamp
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