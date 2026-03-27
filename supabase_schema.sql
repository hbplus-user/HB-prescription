-- ==========================================
-- FINAL CONSOLIDATED SUPABASE SCHEMA
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Physicians table
CREATE TABLE IF NOT EXISTS physicians (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  reg_number text NOT NULL,
  specialisation text NOT NULL,
  signature_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_number text,
  date text,
  physician_id uuid REFERENCES physicians(id),
  client_name text,
  age text,
  gender text,
  chief_complaints text[], 
  any_condition text,      
  any_condition_notes text,
  key_blood_flags text,
  medications_currently_on text[], 
  services jsonb,                  
  training_contraindications text,
  
  -- Target columns correctly named for the code
  target30_1 text,
  target30_2 text,
  target90_1 text,
  target90_2 text,
  target90_3 text,
  
  red_flags text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE physicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

-- Re-apply policies (IF NOT EXISTS pattern is not supported for CREATE POLICY directly in some versions, 
-- but we use DROP then CREATE for simplicity in the 'Final' script)
DROP POLICY IF EXISTS "Allow public read access on physicians" ON physicians;
CREATE POLICY "Allow public read access on physicians" ON physicians FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on prescriptions" ON prescriptions;
CREATE POLICY "Allow public insert on prescriptions" ON prescriptions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on prescriptions" ON prescriptions;
CREATE POLICY "Allow public read on prescriptions" ON prescriptions FOR SELECT USING (true);
