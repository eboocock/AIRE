-- ============================================================
-- Disclosure Forms Seed Data
-- WA Form 17 (Residential Seller Disclosure) + Federal Lead Paint
-- ============================================================

-- Insert forms
INSERT INTO disclosure_forms (id, state, form_code, form_name, description, version, property_types) VALUES
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'WA',
  'WA_FORM_17',
  'Seller Disclosure Statement',
  'Washington State law (RCW 64.06) requires sellers of residential property to disclose known material defects. This form covers all required disclosures for a standard residential sale.',
  '2024.1',
  ARRAY['residential', 'single_family', 'townhouse']
),
(
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'US',
  'FEDERAL_LEAD_PAINT',
  'Lead-Based Paint Disclosure',
  'Federal law (42 U.S.C. 4852d) requires sellers of housing built before 1978 to disclose known information about lead-based paint and lead-based paint hazards.',
  '2024.1',
  ARRAY['residential', 'single_family', 'townhouse', 'condo']
);

-- ============================================================
-- WA FORM 17 QUESTIONS
-- Source: RCW 64.06 / WAC 308-124C
-- ============================================================

-- SECTION 1: TITLE
INSERT INTO disclosure_questions (form_id, section_key, section_label, question_key, question_number, question_text, help_text, answer_type, requires_explanation, explanation_prompt, is_required, display_order) VALUES

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'title', 'Title', 'title_encumbrances', '1a',
 'Are there any encumbrances, easements, liens, or restrictions on the title to the property not listed in the preliminary title report?',
 'Examples include: neighbor agreements about shared driveways, restrictions on how you can use the land, or money owed that is secured against the property.',
 'yes_no', true, 'Please describe the encumbrance, easement, lien, or restriction:', true, 10),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'title', 'Title', 'title_boundary_disputes', '1b',
 'Are you aware of any boundary disputes or encroachments?',
 'A boundary dispute means there is disagreement about where your property ends and a neighbor''s begins. An encroachment means something (like a fence or building) extends past the property line.',
 'yes_no', true, 'Please describe the dispute or encroachment:', true, 20),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'title', 'Title', 'title_legal_proceedings', '1c',
 'Are there any pending or threatened legal proceedings that could affect the property?',
 'This includes lawsuits, foreclosure actions, or any other court proceedings involving the property.',
 'yes_no', true, 'Please describe the legal proceeding:', true, 30),

-- SECTION 2: WATER
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'water', 'Water', 'water_source_type', '2a',
 'What is the source of water for this property?',
 'Identify how the property gets its water supply.',
 'select',
 false, null, true, 40),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'water', 'Water', 'water_problems', '2b',
 'Are you aware of any problems or defects with the water supply or water quality?',
 'Examples: low water pressure, contamination, seasonal shortages, pump failures.',
 'yes_no', true, 'Please describe the problem:', true, 50),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'water', 'Water', 'water_right', '2c',
 'Is there a water right associated with this property (e.g., well water right or irrigation right)?',
 'A water right is a legal entitlement to use water from a specific source. This is common for rural properties with wells or irrigation systems.',
 'yes_no', true, 'Please provide the water right permit number or details:', false, 60),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'water', 'Water', 'water_shared', '2d',
 'Is the domestic water supply shared with any other properties?',
 'Some rural properties share a single well or water system with neighboring properties.',
 'yes_no', true, 'Please describe the shared water arrangement:', false, 70),

-- SECTION 3: SEWER / SEPTIC
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'sewer', 'Sewer / Septic', 'sewer_type', '3a',
 'What type of sewage system serves this property?',
 'Identify how wastewater is handled at this property.',
 'select', false, null, true, 80),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'sewer', 'Sewer / Septic', 'sewer_problems', '3b',
 'Are you aware of any problems or defects with the sewer or septic system?',
 'Examples: slow drains, backups, septic system failures, leach field problems.',
 'yes_no', true, 'Please describe the problem:', true, 90),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'sewer', 'Sewer / Septic', 'septic_inspected', '3c',
 'If on-site septic, has it been inspected or pumped in the last 3 years?',
 'Regular septic maintenance is important. Buyers will want to know the service history.',
 'yes_no_na', false, null, false, 100),

-- SECTION 4: STRUCTURAL
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'structural', 'Structural Conditions', 'struct_roof_leaked', '4a',
 'Has the roof leaked during your ownership?',
 'Disclose any known roof leaks, even if repaired. Include the date and repair details if applicable.',
 'yes_no', true, 'Please describe when it leaked and any repairs made:', true, 110),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'structural', 'Structural Conditions', 'struct_roof_age', '4b',
 'Do you know the approximate age of the roof?',
 'If you know when the roof was last replaced, provide the approximate year.',
 'yes_no', true, 'Please provide approximate year roof was last replaced:', false, 120),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'structural', 'Structural Conditions', 'struct_basement_moisture', '4c',
 'Has the basement, crawl space, or any below-grade area experienced moisture, leaks, or flooding?',
 'This includes any water intrusion, dampness, or flooding regardless of whether it has been corrected.',
 'yes_no_na', true, 'Please describe the moisture issue and any repairs:', true, 130),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'structural', 'Structural Conditions', 'struct_foundation', '4d',
 'Are you aware of any cracks, movement, settling, or other defects in the foundation?',
 'Examples include cracking, bowing walls, uneven floors, or previous foundation repairs.',
 'yes_no', true, 'Please describe the foundation issue:', true, 140),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'structural', 'Structural Conditions', 'struct_exterior_walls', '4e',
 'Are you aware of any defects with exterior walls, windows, or doors?',
 'Examples: rot, water damage, failed seals on windows, doors that don''t close properly.',
 'yes_no', true, 'Please describe the defect:', true, 150),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'structural', 'Structural Conditions', 'struct_alterations', '4f',
 'Have there been any structural modifications, additions, or alterations to the property?',
 'Include any additions, room conversions, structural wall removals, or other major changes made during your ownership or that you are aware of.',
 'yes_no', true, 'Please describe the modifications:', true, 160),

-- SECTION 5: SYSTEMS & FIXTURES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'systems', 'Systems & Fixtures', 'sys_heating', '5a',
 'Are you aware of any defects with the heating system?',
 'Include furnace, heat pump, boiler, radiant heating, or any other heating equipment.',
 'yes_no', true, 'Please describe the defect:', true, 170),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'systems', 'Systems & Fixtures', 'sys_cooling', '5b',
 'Are you aware of any defects with the cooling/air conditioning system?',
 'Include central air, mini-splits, window units, or any other cooling equipment.',
 'yes_no_na', true, 'Please describe the defect:', false, 180),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'systems', 'Systems & Fixtures', 'sys_electrical', '5c',
 'Are you aware of any defects with the electrical system?',
 'Examples: flickering lights, tripping breakers, outdated wiring (aluminum or knob-and-tube), ungrounded outlets.',
 'yes_no', true, 'Please describe the defect:', true, 190),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'systems', 'Systems & Fixtures', 'sys_plumbing', '5d',
 'Are you aware of any defects with the plumbing system?',
 'Examples: leaks, slow drains, low water pressure, polybutylene pipes, galvanized pipes.',
 'yes_no', true, 'Please describe the defect:', true, 200),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'systems', 'Systems & Fixtures', 'sys_fireplace', '5e',
 'Are you aware of any defects with fireplaces, chimneys, or wood stoves?',
 'Include any known damage, blockages, or repairs needed. Note the last time the chimney was cleaned.',
 'yes_no_na', true, 'Please describe the defect:', false, 210),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'systems', 'Systems & Fixtures', 'sys_appliances', '5f',
 'Are there any defects with appliances included in the sale?',
 'Only include appliances that will remain with the property as part of the sale.',
 'yes_no_na', true, 'Please list the defective appliances and describe the issue:', false, 220),

-- SECTION 6: HOMEOWNERS ASSOCIATION
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'hoa', 'Homeowners Association', 'hoa_exists', '6a',
 'Is this property subject to a Homeowners Association (HOA) or similar governing body?',
 'HOAs are common in planned communities, condominiums, and some neighborhoods. They typically have fees and rules.',
 'yes_no', false, null, true, 230),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'hoa', 'Homeowners Association', 'hoa_fees', '6b',
 'What are the current HOA fees and what do they cover?',
 'Provide monthly or annual dues and a brief description of what they include (e.g., landscaping, insurance, amenities).',
 'text', false, null, false, 240),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'hoa', 'Homeowners Association', 'hoa_special_assessment', '6c',
 'Are there any pending or approved special assessments?',
 'A special assessment is an extra charge beyond regular dues, typically for major repairs or improvements.',
 'yes_no_na', true, 'Please describe the special assessment, amount, and purpose:', false, 250),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'hoa', 'Homeowners Association', 'hoa_violations', '6d',
 'Are there any current HOA violations or unresolved compliance issues affecting this property?',
 'This includes any notices of violation you have received from the HOA.',
 'yes_no_na', true, 'Please describe the violation:', false, 260),

-- SECTION 7: ENVIRONMENTAL
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'environmental', 'Environmental', 'env_asbestos', '7a',
 'Are you aware of any asbestos-containing materials on the property?',
 'Asbestos was commonly used before 1980 in insulation, floor tiles, ceiling tiles, and roofing. If present but undisturbed, it may not require removal.',
 'yes_no', true, 'Please describe the location and condition:', true, 270),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'environmental', 'Environmental', 'env_mold', '7b',
 'Are you aware of any mold, mildew, or moisture problems not already disclosed?',
 'Disclose any known mold, even if treated. Include location and any remediation performed.',
 'yes_no', true, 'Please describe the location, extent, and any remediation:', true, 280),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'environmental', 'Environmental', 'env_underground_tanks', '7c',
 'Are there any underground storage tanks (USTs) on the property?',
 'This includes old oil tanks, fuel tanks, or any other buried storage containers.',
 'yes_no', true, 'Please describe the tank type, status, and any remediation:', true, 290),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'environmental', 'Environmental', 'env_contamination', '7d',
 'Are you aware of any hazardous materials, contamination, or Superfund/cleanup activity on or near the property?',
 'This includes any soil or groundwater contamination, proximity to industrial sites, or environmental cleanup activity.',
 'yes_no', true, 'Please describe the contamination or cleanup activity:', true, 300),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'environmental', 'Environmental', 'env_flood_zone', '7e',
 'Is the property located in a designated flood zone or floodplain?',
 'FEMA flood maps designate flood zones. Properties in high-risk zones typically require flood insurance. Check your property at FEMA''s Flood Map Service.',
 'yes_no', false, null, true, 310),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'environmental', 'Environmental', 'env_seismic', '7f',
 'Is the property located in a designated landslide, erosion, or seismic hazard zone?',
 'Washington State has several geologically active areas. Check with your county for hazard zone maps.',
 'yes_no', true, 'Please describe the hazard zone designation:', false, 320),

-- SECTION 8: PERMITS & LEGAL
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'permits', 'Permits & Legal Use', 'permit_improvements', '8a',
 'Were all improvements and additions to the property made with required permits?',
 'Unpermitted work can affect financing, insurance, and resale. If you''re unsure, check with your local building department.',
 'yes_no_na', true, 'Please describe any unpermitted work:', true, 330),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'permits', 'Permits & Legal Use', 'permit_open_permits', '8b',
 'Are there any open, expired, or finaled-but-not-inspected permits on the property?',
 'An open permit means work was started but the final inspection was never completed.',
 'yes_no', true, 'Please describe the open permit:', true, 340),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'permits', 'Permits & Legal Use', 'permit_zoning_violations', '8c',
 'Are you aware of any zoning violations or code violations affecting the property?',
 'This includes any notice from a government agency about a code or zoning violation.',
 'yes_no', true, 'Please describe the violation and its current status:', true, 350),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'permits', 'Permits & Legal Use', 'permit_nonconforming', '8d',
 'Is the property or any structure on it a legal nonconforming use?',
 'A legal nonconforming use means the property was built or used before current zoning laws, and while it can continue, it may not be rebuilt in its current form if destroyed.',
 'yes_no', true, 'Please describe the nonconforming use:', false, 360),

-- SECTION 9: FULL DISCLOSURE
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'full_disclosure', 'Full Disclosure', 'full_other_defects', '9a',
 'Are you aware of any other material defects, problems, or conditions affecting the property that have not been addressed in this form?',
 'A material defect is anything that would significantly affect the value of the property or the buyer''s decision to purchase. When in doubt, disclose.',
 'yes_no', true, 'Please describe all additional known defects:', true, 370),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'full_disclosure', 'Full Disclosure', 'full_disputes', '9b',
 'Are you aware of any disputes with neighbors, government agencies, or others regarding this property?',
 'Include fence disputes, access disputes, noise complaints, or any other ongoing conflicts.',
 'yes_no', true, 'Please describe the dispute:', true, 380),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'full_disclosure', 'Full Disclosure', 'full_deaths', '9c',
 'Have there been any deaths on the property in the last 3 years that you are aware of?',
 'Washington law requires disclosure of deaths on the property within the last 3 years (RCW 64.06.022). Note: HIV/AIDS status of a prior occupant does not need to be disclosed.',
 'yes_no', true, 'Please provide the approximate date and general circumstances (no personal information required):', true, 390);

-- Update answer_options for select questions
UPDATE disclosure_questions
SET answer_options = '["Public/municipal water", "Private well (individual)", "Shared well", "Cistern", "Other"]'::jsonb
WHERE question_key = 'water_source_type';

UPDATE disclosure_questions
SET answer_options = '["Public sewer", "On-site septic system", "Holding tank", "Shared septic", "Other"]'::jsonb
WHERE question_key = 'sewer_type';

-- Conditional logic: HOA questions only show if HOA exists
UPDATE disclosure_questions
SET depends_on_key = 'hoa_exists', depends_on_value = 'yes'
WHERE question_key IN ('hoa_fees', 'hoa_special_assessment', 'hoa_violations');

-- Conditional: septic inspection only if on-site septic
UPDATE disclosure_questions
SET depends_on_key = 'sewer_type', depends_on_value = 'On-site septic system'
WHERE question_key = 'septic_inspected';

-- ============================================================
-- FEDERAL LEAD PAINT DISCLOSURE
-- ============================================================

INSERT INTO disclosure_questions (form_id, section_key, section_label, question_key, question_number, question_text, help_text, answer_type, requires_explanation, explanation_prompt, is_required, display_order, prefill_source) VALUES

('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'lead_paint', 'Lead-Based Paint', 'lead_year_built', 'A',
 'Was this property built before 1978?',
 'Lead paint was common in homes built before 1978. If your home was built in 1978 or later, this disclosure is not required by federal law.',
 'yes_no', false, null, true, 10, 'property.year_built'),

('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'lead_paint', 'Lead-Based Paint', 'lead_known_presence', 'B',
 'Do you have knowledge of lead-based paint or lead-based paint hazards in the property?',
 'Lead paint hazards include paint that is chipping, peeling, or deteriorating, especially on windows, doors, and friction surfaces.',
 'yes_no', true, 'Explain the known lead-based paint and/or lead-based paint hazards:', true, 20),

('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'lead_paint', 'Lead-Based Paint', 'lead_records_available', 'C',
 'Do you have any records or reports pertaining to lead-based paint in the property?',
 'This includes any prior inspection reports, risk assessments, or abatement records.',
 'yes_no_na', true, 'List the documents available:', true, 30);
