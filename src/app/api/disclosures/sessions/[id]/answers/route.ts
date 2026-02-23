import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/disclosures/sessions/[id]/answers - save one or many answers (upsert)
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Verify session ownership
  const { data: session } = await supabase
    .from('disclosure_sessions')
    .select('id, form_id')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single();

  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const body = await request.json();
  // Accept either a single answer or an array
  const incoming: { question_key: string; answer_value: string; explanation?: string }[] =
    Array.isArray(body) ? body : [body];

  if (!incoming.length) {
    return NextResponse.json({ error: 'No answers provided' }, { status: 400 });
  }

  // Look up question IDs from keys
  const keys = incoming.map(a => a.question_key);
  const { data: questions } = await supabase
    .from('disclosure_questions')
    .select('id, question_key')
    .eq('form_id', session.form_id)
    .in('question_key', keys);

  const questionMap: Record<string, string> = {};
  (questions || []).forEach(q => { questionMap[q.question_key] = q.id; });

  const upserts = incoming
    .filter(a => questionMap[a.question_key])
    .map(a => ({
      session_id: sessionId,
      question_id: questionMap[a.question_key],
      question_key: a.question_key,
      answer_value: a.answer_value,
      explanation: a.explanation || null,
    }));

  if (!upserts.length) {
    return NextResponse.json({ error: 'No valid question keys found' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('disclosure_answers')
    .upsert(upserts, { onConflict: 'session_id,question_id' })
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Recalculate completion percentage
  const { data: allQuestions } = await supabase
    .from('disclosure_questions')
    .select('question_key, is_required')
    .eq('form_id', session.form_id);

  const { data: allAnswers } = await supabase
    .from('disclosure_answers')
    .select('question_key, answer_value')
    .eq('session_id', sessionId);

  const answeredKeys = new Set((allAnswers || []).filter(a => a.answer_value).map(a => a.question_key));
  const required = (allQuestions || []).filter(q => q.is_required);
  const completion = required.length > 0
    ? Math.round((required.filter(q => answeredKeys.has(q.question_key)).length / required.length) * 100)
    : 0;

  await supabase
    .from('disclosure_sessions')
    .update({ completion_percentage: completion, status: completion === 100 ? 'complete' : 'in_progress' })
    .eq('id', sessionId);

  return NextResponse.json({ saved: data, completion });
}
