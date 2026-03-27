-- ==========================================
-- FINAL CONSOLIDATED SUPABASE SCHEMA
-- This script resets your database to the correct structure
-- ==========================================

-- 1. CLEANUP (Careful: This deletes existing data in these tables)
DROP TABLE IF EXISTS prescriptions;
DROP TABLE IF EXISTS physicians;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PHYSICIANS TABLE
CREATE TABLE physicians (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  reg_number text NOT NULL,
  specialisation text NOT NULL,
  signature_url text, -- Stores base64 or public URL
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRESCRIPTIONS TABLE
CREATE TABLE prescriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_number text,
  date text,
  physician_id uuid REFERENCES physicians(id),
  client_name text,
  age text,
  gender text,
  chief_complaints text[], -- Array of strings from frontend
  any_condition text,      -- Joined string of multi-selected conditions
  any_condition_notes text,
  key_blood_flags text,
  medications_currently_on text[], -- Array of strings from frontend
  services jsonb,                  -- The entire services object
  training_contraindications text,
  
  -- The specific targets correctly named for the code
  target30_1 text,
  target30_2 text,
  target90_1 text,
  target90_2 text,
  target90_3 text,
  
  red_flags text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SECURITY (Row Level Security)
ALTER TABLE physicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on physicians" ON physicians FOR SELECT USING (true);
CREATE POLICY "Allow public insert on prescriptions" ON prescriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on prescriptions" ON prescriptions FOR SELECT USING (true);

-- 5. SEED INITIAL DATA (Physicians)
INSERT INTO physicians (id, name, reg_number, specialisation, signature_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Dr. Rajiv Sharma', 'MCI-10234', 'Sports Medicine', 'data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' width=''160'' height=''50''%3E%3Cpath d=''M10 40 Q30 10 50 35 T90 25 T130 38 L150 30'' stroke=''%231a2f4e'' stroke-width=''2'' fill=''none'' stroke-linecap=''round''/%3E%3C/svg%3E'),
  ('22222222-2222-2222-2222-222222222222', 'Dr. Priya Mehta', 'MCI-20987', 'Internal Medicine', 'data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' width=''160'' height=''50''%3E%3Cpath d=''M10 35 Q40 5 70 30 T120 20 T155 32'' stroke=''%231a2f4e'' stroke-width=''2'' fill=''none'' stroke-linecap=''round''/%3E%3C/svg%3E'),
  ('33333333-3333-3333-3333-333333333333', 'Dr. Anand Verma', 'MCI-30456', 'Lifestyle Medicine', 'data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' width=''160'' height=''50''%3E%3Cpath d=''M10 38 C30 10 50 45 80 25 S120 10 150 35'' stroke=''%231a2f4e'' stroke-width=''2'' fill=''none'' stroke-linecap=''round''/%3E%3C/svg%3E'),
  ('44444444-4444-4444-4444-444444444444', 'Dr.Sarvesh Vaidyam', 'MCI-40001', 'General Physician', 'data:image/png;base64,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'),
  ('55555555-5555-5555-5555-555555555555', 'Dr.Siddem Chakradhar', 'TNMC 174305', 'Internal Medicine', NULL);
