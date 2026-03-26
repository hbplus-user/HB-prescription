-- Run this snippet in your Supabase SQL Editor to add the two new signatures.

INSERT INTO physicians (id, name, reg_number, specialisation, signature_url) 
VALUES
  ('44444444-4444-4444-4444-444444444444', 'Dr. Sarvesh', 'MCI-40001', 'General Physician', '/signatures/signature_1.png'),
  ('55555555-5555-5555-5555-555555555555', 'Dr. Aki', 'MCI-50002', 'General Physician', '/signatures/signature_2.jpg');
