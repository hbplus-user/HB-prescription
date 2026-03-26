import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addPhysicians() {
  try {
    const sig1 = fs.readFileSync(path.join(__dirname, 'public/signatures/sig1_b64.txt'), 'utf8');
    const sig2 = fs.readFileSync(path.join(__dirname, 'public/signatures/sig2_b64.txt'), 'utf8');

    const newPhysicians = [
      {
        name: 'Dr. Sarvesh',
        reg_number: 'MCI-40001',
        specialisation: 'General Physician',
        signature_url: sig1
      },
      {
        name: 'Dr. Aki',
        reg_number: 'MCI-50002',
        specialisation: 'General Physician',
        signature_url: sig2
      }
    ];

    const { data, error } = await supabase
      .from('physicians')
      .insert(newPhysicians);

    if (error) {
      console.error("Error inserting physicians:", error);
      process.exit(1);
    }
    
    console.log("Successfully added Dr. Sarvesh and Dr. Aki to Supabase!");
    process.exit(0);
  } catch (err) {
    console.error("Script error:", err);
    process.exit(1);
  }
}

addPhysicians();
