'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Question {
  id: string;
  question_key: string;
  question_number: string;
  question_text: string;
  help_text: string;
  answer_type: string;
  answer_options: string[] | null;
  requires_explanation: boolean;
  explanation_prompt: string;
  is_required: boolean;
  depends_on_key: string | null;
  depends_on_value: string | null;
  answer: { answer_value: string; explanation?: string } | null;
}

interface Section {
  key: string;
  label: string;
  questions: Question[];
}

interface SessionData {
  session: any;
  sections: Section[];
  completion: number;
  total_questions: number;
  answered_questions: number;
}

export default function DisclosurePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<SessionData | null>(null);
  const [answers, setAnswers] = useState<Record<string, { value: string; explanation: string }>>({});
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    const res = await fetch(`/api/disclosures/sessions/${id}`);
    if (!res.ok) { router.push('/disclosures'); return; }
    const json: SessionData = await res.json();
    setData(json);

    // Hydrate local answers from saved data
    const initial: Record<string, { value: string; explanation: string }> = {};
    json.sections.forEach(s => s.questions.forEach(q => {
      if (q.answer) {
        initial[q.question_key] = {
          value: q.answer.answer_value || '',
          explanation: q.answer.explanation || '',
        };
      }
    }));
    setAnswers(initial);
    if (!activeSection && json.sections.length > 0) {
      setActiveSection(json.sections[0].key);
    }
  }, [id, router, activeSection]);

  useEffect(() => { loadSession(); }, [id]);

  const setAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: { ...prev[key], value, explanation: prev[key]?.explanation || '' } }));
    setSaved(false);
  };

  const setExplanation = (key: string, explanation: string) => {
    setAnswers(prev => ({ ...prev, [key]: { ...prev[key], explanation } }));
    setSaved(false);
  };

  const saveSection = async () => {
    setSaving(true);
    setError(null);
    const payload = Object.entries(answers).map(([question_key, ans]) => ({
      question_key,
      answer_value: ans.value,
      explanation: ans.explanation || undefined,
    }));

    const res = await fetch(`/api/disclosures/sessions/${id}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const result = await res.json();
      setData(prev => prev ? { ...prev, completion: result.completion } : prev);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setError('Failed to save answers. Please try again.');
    }
    setSaving(false);
  };

  const generateDocument = async () => {
    await saveSection();
    setGenerating(true);
    const res = await fetch(`/api/disclosures/sessions/${id}/generate`, { method: 'POST' });
    if (res.ok) {
      const { html } = await res.json();
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(html);
        win.document.close();
      }
    } else {
      setError('Failed to generate document.');
    }
    setGenerating(false);
  };

  const isVisible = (q: Question): boolean => {
    if (!q.depends_on_key) return true;
    const dep = answers[q.depends_on_key];
    return dep?.value === q.depends_on_value;
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-aire-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentSection = data.sections.find(s => s.key === activeSection);
  const sectionIndex = data.sections.findIndex(s => s.key === activeSection);

  const getSectionCompletion = (section: Section) => {
    const visible = section.questions.filter(q => q.is_required && isVisible(q));
    if (!visible.length) return 100;
    const done = visible.filter(q => answers[q.question_key]?.value).length;
    return Math.round((done / visible.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/disclosures" className="text-gray-400 hover:text-white">
              <i className="fas fa-arrow-left" />
            </Link>
            <div className="min-w-0">
              <div className="text-white font-semibold truncate">{data.session.form?.form_name}</div>
              <div className="text-gray-400 text-xs truncate">{data.session.property_address}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Progress */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-aire-500 transition-all"
                  style={{ width: `${data.completion}%` }}
                />
              </div>
              <span className="text-sm text-gray-400">{data.completion}%</span>
            </div>
            <button
              onClick={saveSection}
              disabled={saving}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition"
            >
              {saving ? <i className="fas fa-spinner fa-spin" /> : saved ? <><i className="fas fa-check text-green-400 mr-1" />Saved</> : 'Save'}
            </button>
            <button
              onClick={generateDocument}
              disabled={generating || data.completion < 100}
              title={data.completion < 100 ? 'Complete all required questions first' : 'Generate disclosure document'}
              className="px-4 py-2 bg-aire-500 hover:bg-aire-600 disabled:bg-gray-800 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition"
            >
              {generating ? <i className="fas fa-spinner fa-spin" /> : <><i className="fas fa-file-pdf mr-1" />Generate</>}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar: Section Navigation */}
        <aside className="w-56 flex-shrink-0 hidden md:block">
          <nav className="space-y-1 sticky top-24">
            {data.sections.map((section, i) => {
              const pct = getSectionCompletion(section);
              const isActive = section.key === activeSection;
              return (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition text-sm ${
                    isActive ? 'bg-aire-500/10 border border-aire-500/30 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${isActive ? 'text-white' : ''}`}>{section.label}</span>
                    {pct === 100 && <i className="fas fa-check-circle text-green-400 text-xs" />}
                  </div>
                  <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-500' : 'bg-aire-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main: Questions */}
        <main className="flex-1 min-w-0">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              <i className="fas fa-exclamation-circle mr-2" />{error}
            </div>
          )}

          {currentSection && (
            <div>
              <div className="mb-6">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Section {sectionIndex + 1} of {data.sections.length}
                </div>
                <h2 className="text-2xl font-bold text-white">{currentSection.label}</h2>
              </div>

              <div className="space-y-4">
                {currentSection.questions.filter(isVisible).map(q => {
                  const ans = answers[q.question_key] || { value: '', explanation: '' };
                  const needsExplanation = q.requires_explanation && ans.value === 'yes';

                  return (
                    <div
                      key={q.id}
                      className={`bg-gray-900 border rounded-xl p-5 transition ${
                        ans.value ? 'border-gray-700' : q.is_required ? 'border-gray-700' : 'border-gray-800'
                      }`}
                    >
                      <div className="flex gap-3">
                        <span className="text-xs text-gray-500 font-mono mt-1 flex-shrink-0 w-6">{q.question_number}</span>
                        <div className="flex-1">
                          <p className="text-white font-medium leading-relaxed">{q.question_text}</p>

                          {q.help_text && (
                            <p className="text-gray-400 text-sm mt-2 leading-relaxed">{q.help_text}</p>
                          )}

                          {q.is_required && !ans.value && (
                            <span className="inline-block text-xs text-red-400 mt-1">Required</span>
                          )}

                          {/* Answer Controls */}
                          <div className="mt-4">
                            {(q.answer_type === 'yes_no' || q.answer_type === 'yes_no_na') && (
                              <div className="flex gap-2">
                                {['yes', 'no', ...(q.answer_type === 'yes_no_na' ? ['na'] : [])].map(opt => (
                                  <button
                                    key={opt}
                                    onClick={() => setAnswer(q.question_key, opt)}
                                    className={`px-5 py-2 rounded-lg text-sm font-medium transition border ${
                                      ans.value === opt
                                        ? opt === 'yes' ? 'bg-red-500/20 border-red-500 text-red-400'
                                          : opt === 'no' ? 'bg-green-500/20 border-green-500 text-green-400'
                                          : 'bg-gray-700 border-gray-500 text-gray-300'
                                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                                    }`}
                                  >
                                    {opt === 'na' ? 'N/A' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                                  </button>
                                ))}
                              </div>
                            )}

                            {q.answer_type === 'select' && q.answer_options && (
                              <select
                                value={ans.value}
                                onChange={e => setAnswer(q.question_key, e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-aire-500"
                              >
                                <option value="">Select an option...</option>
                                {q.answer_options.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            )}

                            {q.answer_type === 'text' && (
                              <textarea
                                value={ans.value}
                                onChange={e => setAnswer(q.question_key, e.target.value)}
                                placeholder="Enter your answer..."
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500 resize-none"
                              />
                            )}
                          </div>

                          {/* Explanation field */}
                          {needsExplanation && (
                            <div className="mt-3">
                              <label className="block text-sm text-yellow-400 mb-1">
                                <i className="fas fa-exclamation-circle mr-1" />
                                {q.explanation_prompt || 'Please provide additional details:'}
                              </label>
                              <textarea
                                value={ans.explanation}
                                onChange={e => setExplanation(q.question_key, e.target.value)}
                                placeholder="Provide details..."
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-800 border border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Section Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-800">
                <button
                  onClick={() => sectionIndex > 0 && setActiveSection(data.sections[sectionIndex - 1].key)}
                  disabled={sectionIndex === 0}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white rounded-xl transition"
                >
                  <i className="fas fa-arrow-left mr-2" /> Previous
                </button>
                <button
                  onClick={async () => {
                    await saveSection();
                    if (sectionIndex < data.sections.length - 1) {
                      setActiveSection(data.sections[sectionIndex + 1].key);
                      window.scrollTo(0, 0);
                    }
                  }}
                  className="px-6 py-3 bg-aire-500 hover:bg-aire-600 text-white font-semibold rounded-xl transition"
                >
                  {sectionIndex < data.sections.length - 1 ? (<>Save & Continue <i className="fas fa-arrow-right ml-2" /></>) : (<><i className="fas fa-save mr-2" />Save All</>)}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
