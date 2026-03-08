import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/disclosures/sessions/[id] - full session with questions and answers
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Fetch session
  const { data: session, error: sessionError } = await supabase
    .from('disclosure_sessions')
    .select(`*, form:disclosure_forms(*)`)
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  // Fetch questions for this form (ordered)
  const { data: questions } = await supabase
    .from('disclosure_questions')
    .select('*')
    .eq('form_id', session.form_id)
    .order('display_order');

  // Fetch existing answers
  const { data: answers } = await supabase
    .from('disclosure_answers')
    .select('*')
    .eq('session_id', id);

  // Build answers map for easy lookup
  const answersMap: Record<string, any> = {};
  (answers || []).forEach(a => { answersMap[a.question_key] = a; });

  // Group questions by section
  const sections: Record<string, { label: string; questions: any[] }> = {};
  (questions || []).forEach(q => {
    if (!sections[q.section_key]) {
      sections[q.section_key] = { label: q.section_label, questions: [] };
    }
    sections[q.section_key].questions.push({
      ...q,
      answer: answersMap[q.question_key] || null,
    });
  });

  // Calculate completion
  const totalRequired = (questions || []).filter(q => q.is_required).length;
  const answered = (questions || []).filter(q =>
    q.is_required && answersMap[q.question_key]?.answer_value
  ).length;
  const completion = totalRequired > 0 ? Math.round((answered / totalRequired) * 100) : 0;

  return NextResponse.json({
    session,
    sections: Object.entries(sections).map(([key, val]) => ({
      key,
      label: val.label,
      questions: val.questions,
    })),
    completion,
    total_questions: (questions || []).length,
    answered_questions: Object.keys(answersMap).length,
  });
}

// PATCH /api/disclosures/sessions/[id] - update session metadata
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const updates = await request.json();
  const allowed = ['current_section', 'status', 'seller_name', 'seller_email', 'completion_percentage'];
  const filtered: Record<string, any> = {};
  allowed.forEach(k => { if (k in updates) filtered[k] = updates[k]; });

  const { data, error } = await supabase
    .from('disclosure_sessions')
    .update(filtered)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
