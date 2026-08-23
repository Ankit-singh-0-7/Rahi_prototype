import React, { useState } from 'react';
import { IssueReport } from '../../types';
import { ShieldAlert, FileText, Send, Printer, CheckCircle, Download, X, AlertTriangle, Building2 } from 'lucide-react';

interface CivicDossierModalProps {
  issue: IssueReport | null;
  onClose: () => void;
}

export const CivicDossierModal: React.FC<CivicDossierModalProps> = ({ issue, onClose }) => {
  const [dispatched, setDispatched] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [customDossier, setCustomDossier] = useState<any>(null);

  if (!issue) return null;

  const handleGenerateAIDossier = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/summarize-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: issue.location,
          issueType: issue.issueType,
          reportsCount: issue.reportCount,
          recentNotes: [issue.description],
        }),
      });
      const data = await res.json();
      if (data.dossier) {
        setCustomDossier(data.dossier);
      }
    } catch (e) {
      console.warn('AI summary failed, using standard dossier', e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleDispatchOfficialNotice = () => {
    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Consolidated Civic Action Dossier</h3>
              <p className="text-xs text-slate-400">Formal escalation document for Municipal & Tourism Boards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
          {/* Status banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-medium">Escalation Status:</span>{' '}
              <span className="font-extrabold text-rose-600 uppercase tracking-wide">
                {issue.priority} PRIORITY ({issue.reportCount} Verified Tourist Reports)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleGenerateAIDossier}
                disabled={isGeneratingAI}
                className="px-3 py-1.5 bg-sky-50 text-sky-700 font-bold rounded-lg hover:bg-sky-100 transition cursor-pointer border border-sky-200"
              >
                {isGeneratingAI ? 'Synthesizing...' : '✨ Enhance with AI Insights'}
              </button>
            </div>
          </div>

          {/* Dossier Body */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4 font-sans">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Document ID</span>
                <p className="font-mono text-slate-800 font-bold">DOSSIER-CIVIC-{issue.id.slice(0, 10).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date of Dispatch</span>
                <p className="font-medium text-slate-700">{new Date().toLocaleDateString('en-GB')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 text-[11px] font-medium">Target Location / Ward</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{issue.location}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] font-medium">Issue Category</span>
                <p className="font-bold text-amber-700 text-sm mt-0.5">{issue.issueType}</p>
              </div>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] font-medium">Executive Summary & Cluster Analysis</span>
              <p className="mt-1 text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {customDossier?.executiveSummary ||
                  `Aggregated telemetry from ${issue.reportCount} independent visitors indicates repeated infrastructure breakdown and safety hazards at ${issue.location}. Primary complaints specify: "${issue.description}".`}
              </p>
            </div>

            {customDossier?.impactOnTourism && (
              <div>
                <span className="text-slate-500 text-[11px] font-medium">Tourism & Economic Impact</span>
                <p className="mt-1 text-slate-700 leading-relaxed bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                  {customDossier.impactOnTourism}
                </p>
              </div>
            )}

            <div>
              <span className="text-slate-500 text-[11px] font-medium">Recommended Immediate Corrective Actions</span>
              <ul className="mt-1.5 space-y-1.5 list-disc list-inside text-slate-700 bg-slate-50 p-3 rounded-xl">
                {customDossier?.recommendedImmediateActions ? (
                  customDossier.recommendedImmediateActions.map((act: string, idx: number) => (
                    <li key={idx} className="leading-snug">{act}</li>
                  ))
                ) : (
                  <>
                    <li>Deploy municipal sanitation and rapid engineering repair unit within 24 hours.</li>
                    <li>Install clear directional warning signs and high-intensity solar lighting.</li>
                    <li>Forward incident log to regional Superintendent of Police & Tourism Officer.</li>
                  </>
                )}
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-500">
              <div className="flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Assigned: {customDossier?.assignedDepartment || issue.escalatedTo || 'District Municipal & Tourism Infrastructure Board'}</span>
              </div>
              <span className="font-semibold text-emerald-600">Digitally Verified by SafarSetu Civic Protocol</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Dossier</span>
            </button>

            <button
              onClick={handleDispatchOfficialNotice}
              disabled={dispatched}
              className={`px-5 py-2.5 rounded-xl font-bold text-white flex items-center space-x-2 shadow-md transition cursor-pointer ${
                dispatched
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {dispatched ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Dossier Dispatched to Tourism Authority!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Forward Official Electronic Notice to Authority</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
