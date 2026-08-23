import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { COMMON_TRAVEL_PHRASES } from '../../data/sampleData';
import { Languages, Volume2, Sparkles, Copy, Check, X, ArrowRight, MessageSquare, BookOpen } from 'lucide-react';

export const TranslatorModal: React.FC = () => {
  const { isTranslatorOpen, setIsTranslatorOpen, showToast } = useTravel();

  const [inputQuery, setInputQuery] = useState('');
  const [targetLang, setTargetLang] = useState('Hindi');
  const [sourceLang, setSourceLang] = useState('English');
  const [isLoading, setIsLoading] = useState(false);
  const [translationResult, setTranslationResult] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [copied, setCopied] = useState(false);

  if (!isTranslatorOpen) return null;

  const categories = ['All', 'Greetings', 'Dining', 'Navigation', 'Bargaining & Shopping', 'Emergency', 'Medical Emergency'];

  const filteredPhrases = activeCategory === 'All'
    ? COMMON_TRAVEL_PHRASES
    : COMMON_TRAVEL_PHRASES.filter((p) => p.context === activeCategory);

  const handleTranslateText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputQuery.trim(),
          sourceLang,
          targetLang,
          context: 'Tourist travel, bargaining, dining, direction or safety',
        }),
      });
      const data = await res.json();
      if (data.data) {
        setTranslationResult(data.data);
      }
    } catch (e) {
      console.warn('AI translation failed', e);
      setTranslationResult({
        translatedText: `[Translated to ${targetLang}]: ${inputQuery}`,
        pronunciationGuide: 'Pronounce phonetically',
        culturalNote: 'Locals appreciate when you start with a gentle smile and "Namaste".',
        quickReplies: ['Ji haan (Yes)', 'Nahi (No)', 'Dhanyavaad (Thank you)'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Phrase copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-white/10">
              <Languages className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h3 className="text-base font-bold">Multilingual Travel Translator</h3>
              <p className="text-xs text-sky-200">Phrases, menus, signage & instant AI audio pronunciation guide</p>
            </div>
          </div>
          <button
            onClick={() => setIsTranslatorOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
          {/* Custom Translation Form */}
          <form onSubmit={handleTranslateText} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
              >
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
                <option value="Japanese">Japanese</option>
              </select>

              <ArrowRight className="w-4 h-4 text-slate-400" />

              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
              >
                <option value="Hindi">Hindi (हिन्दी)</option>
                <option value="Konkani">Konkani (Goa)</option>
                <option value="Rajasthani">Rajasthani / Marwari</option>
                <option value="Malayalam">Malayalam (Kerala)</option>
                <option value="Bengali">Bengali (বাংলা)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Type any word, menu item, or question (e.g. Is this spicy? Where is the taxi stand?)"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white text-xs"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition flex items-center space-x-1.5 shrink-0 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoading ? 'Translating...' : 'Translate'}</span>
              </button>
            </div>

            {/* Translation Output Card */}
            {translationResult && (
              <div className="bg-white p-4 rounded-xl border border-sky-200 shadow-xs space-y-2.5 animate-in fade-in">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-sky-600 tracking-wider">
                      Translated to {targetLang}
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-0.5">
                      {translationResult.translatedText}
                    </h4>
                    {translationResult.pronunciationGuide && (
                      <p className="text-xs text-sky-800 font-mono italic mt-0.5">
                        🗣️ Pronunciation: "{translationResult.pronunciationGuide}"
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(translationResult.translatedText)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {translationResult.culturalNote && (
                  <p className="text-[11px] text-slate-600 bg-sky-50/50 p-2.5 rounded-lg border border-sky-100">
                    💡 <strong>Etiquette Tip:</strong> {translationResult.culturalNote}
                  </p>
                )}

                {translationResult.quickReplies && translationResult.quickReplies.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Common Expected Replies</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {translationResult.quickReplies.map((qr: string, idx: number) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px]">
                          {qr}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Quick Survival Phrase Guide */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Essential Tourist Survival Phrases</span>
              </h4>
            </div>

            {/* Categories filter */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 text-[11px]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap cursor-pointer transition ${
                    activeCategory === cat
                      ? 'bg-sky-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Phrases List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
              {filteredPhrases.map((phrase, idx) => (
                <div
                  key={idx}
                  onClick={() => copyText(phrase.hindi)}
                  className="p-3 bg-white rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 transition cursor-pointer group flex items-start justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wide">
                      {phrase.context}
                    </span>
                    <p className="font-semibold text-slate-800 text-xs mt-0.5">{phrase.english}</p>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">{phrase.hindi}</p>
                  </div>
                  <span className="p-1 rounded bg-slate-100 text-slate-400 group-hover:text-sky-600 transition">
                    <Copy className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
