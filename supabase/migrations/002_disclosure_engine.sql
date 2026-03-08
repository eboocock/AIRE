-- Disclosure Engine Schema
-- WA State Form 17 + Lead Paint Federal Disclosure

-- Catalog of disclosure forms by state
CREATE TABLE IF NOT EXISTS disclosure_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state CHAR(2) NOT NULL,
  form_code TEXT NOT NULL,          -- e.g. 'WA_FORM_17', 'FEDERAL_LEAD_PAINT'
  form_name TEXT NOT NULL,
  description TEXT,
  version TEXT NOT NULL DEFAULT '1.0',
  property_types TEXT[] DEFAULT ARRAY['residential'],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(state, form_code, version)
);

-- Questions within each form
CREATE TABLE IF NOT EXISTS disclosure_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL REFERENCES disclosure_forms(id),
  section_key TEXT NOT NULL,        -- e.g. 'structural', 'environmental'
  section_label TEXT NOT NULL,      -- e.g. 'Structural Conditions'
  question_key TEXT NOT NULL,       -- machine-readable key
  question_number TEXT,             -- e.g. '4a', '4b'
  question_text TEXT NOT NULL,
  help_text TEXT,                   -- plain-English explanation shown to seller
  answer_type TEXT NOT NULL CHECK (answer_type IN ('yes_no_na', 'yes_no', 'text', 'number', 'date', 'select', 'multiselect')),
  answer_options JSONB,             -- for select/multiselect types
  requires_explanation BOOLEAN DEFAULT false,  -- when answered 'yes', prompt for detail
  explanation_prompt TEXT,          -- e.g. 'Please describe the defect'
  is_required BOOLEAN DEFAULT true,
  display_order INTEGER NOT NULL,
  -- Conditional logic: only show this question if parent has specific answer
  depends_on_key TEXT,
  depends_on_value TEXT,
  -- Pre-fill source from property data
  prefill_source TEXT,              -- e.g. 'property.year_built', 'property.hoa'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- A seller's disclosure session for a specific property
CREATE TABLE IF NOT EXISTS disclosure_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  listing_id UUID REFERENCES listings(id),
  form_id UUID NOT NULL REFERENCES disclosure_forms(id),
  property_address TEXT NOT NULL,
  property_data JSONB,              -- cached property data from Estated
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'complete', 'signed')),
  current_section TEXT,             -- track progress
  completion_percentage INTEGER DEFAULT 0,
  seller_name TEXT,
  seller_email TEXT,
  signed_at TIMESTAMPTZ,
  signature_data JSONB,             -- signature metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual answers to disclosure questions
CREATE TABLE IF NOT EXISTS disclosure_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES disclosure_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES disclosure_questions(id),
  question_key TEXT NOT NULL,
  answer_value TEXT,                -- 'yes', 'no', 'na', or free text
  explanation TEXT,                 -- required when answer triggers explanation
  is_prefilled BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

-- Generated disclosure documents
CREATE TABLE IF NOT EXISTS disclosure_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES disclosure_sessions(id),
  document_type TEXT NOT NULL,      -- 'html', 'pdf_url'
  content TEXT,                     -- HTML content for PDF generation
  file_url TEXT,                    -- if stored in Supabase storage
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  is_signed BOOLEAN DEFAULT false,
  signed_at TIMESTAMPTZ
);

-- RLS Policies
ALTER TABLE disclosure_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE disclosure_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE disclosure_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE disclosure_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE disclosure_questions ENABLE ROW LEVEL SECURITY;

-- Public can read forms and questions (they're templates)
CREATE POLICY "Anyone can read disclosure forms" ON disclosure_forms FOR SELECT USING (true);
CREATE POLICY "Anyone can read disclosure questions" ON disclosure_questions FOR SELECT USING (true);

-- Users can only access their own sessions
CREATE POLICY "Users can manage own sessions" ON disclosure_sessions
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own answers" ON disclosure_answers
  USING (session_id IN (SELECT id FROM disclosure_sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own documents" ON disclosure_documents
  USING (session_id IN (SELECT id FROM disclosure_sessions WHERE user_id = auth.uid()));

-- Indexes
CREATE INDEX idx_disclosure_sessions_user ON disclosure_sessions(user_id);
CREATE INDEX idx_disclosure_sessions_listing ON disclosure_sessions(listing_id);
CREATE INDEX idx_disclosure_answers_session ON disclosure_answers(session_id);
CREATE INDEX idx_disclosure_questions_form ON disclosure_questions(form_id, display_order);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER disclosure_sessions_updated_at
  BEFORE UPDATE ON disclosure_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER disclosure_answers_updated_at
  BEFORE UPDATE ON disclosure_answers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
