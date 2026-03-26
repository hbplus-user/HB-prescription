-- Please run this quickly in your Supabase SQL editor to ensure new targets save properly

ALTER TABLE prescriptions
DROP COLUMN target3,
ADD COLUMN target30_1 text,
ADD COLUMN target30_2 text,
ADD COLUMN target90_1 text,
ADD COLUMN target90_2 text,
ADD COLUMN target90_3 text;
