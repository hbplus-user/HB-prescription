-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Physicians table
create table physicians (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  reg_number text not null,
  specialisation text not null,
  signature_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Prescriptions table
create table prescriptions (
  id uuid primary key default uuid_generate_v4(),
  consultation_number text,
  date text,
  physician_id uuid references physicians(id),
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
  target1 text,
  target2 text,
  target3 text,
  red_flags text,
  client_acknowledgement text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set Row Level Security (RLS)
alter table physicians enable row level security;
alter table prescriptions enable row level security;

-- Policies for physicians (public read)
create policy "Allow public read access on physicians"
  on physicians for select
  using (true);

-- Policies for prescriptions (public read and insert)
create policy "Allow public insert on prescriptions"
  on prescriptions for insert
  with check (true);

create policy "Allow public read on prescriptions"
  on prescriptions for select
  using (true);

-- Seed existing doctors
insert into physicians (id, name, reg_number, specialisation, signature_url) values
  ('11111111-1111-1111-1111-111111111111', 'Dr. Rajiv Sharma', 'MCI-10234', 'Sports Medicine', 'data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' width=''160'' height=''50''%3E%3Cpath d=''M10 40 Q30 10 50 35 T90 25 T130 38 L150 30'' stroke=''%231a2f4e'' stroke-width=''2'' fill=''none'' stroke-linecap=''round''/%3E%3C/svg%3E'),
  ('22222222-2222-2222-2222-222222222222', 'Dr. Priya Mehta', 'MCI-20987', 'Internal Medicine', 'data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' width=''160'' height=''50''%3E%3Cpath d=''M10 35 Q40 5 70 30 T120 20 T155 32'' stroke=''%231a2f4e'' stroke-width=''2'' fill=''none'' stroke-linecap=''round''/%3E%3C/svg%3E'),
  ('33333333-3333-3333-3333-333333333333', 'Dr. Anand Verma', 'MCI-30456', 'Lifestyle Medicine', 'data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' width=''160'' height=''50''%3E%3Cpath d=''M10 38 C30 10 50 45 80 25 S120 10 150 35'' stroke=''%231a2f4e'' stroke-width=''2'' fill=''none'' stroke-linecap=''round''/%3E%3C/svg%3E');
