import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { IssueReport } from '../../types';
import { AlertTriangle, MapPin, Upload, Camera, CheckCircle2, X, ShieldCheck } from 'lucide-react';

export const ReportIssueModal: React.FC = () => {
  const { isReportIssueOpen, setIsReportIssueOpen, reportNewIssue } = useTravel();

  const [location, setLocation] = useState('');
  const [issueType, setIssueType] = useState<IssueReport['issueType']>('Garbage / Cleanliness');
  const [description, setDescription] = useState('');
  const [mediaUploaded, setMediaUploaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const issueCategories: IssueReport['issueType'][] = [
    'Garbage / Cleanliness',
    'Damaged Road / Access',
    'Broken Streetlights',
    'Unsafe / Dark Area',
    'Lack of Public Restrooms',
    'Damaged Heritage Infrastructure',
    'Missing Signboards / Scams',
    'Overcharging / Harassment',
  ];

  if (!isReportIssueOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !location.trim() || !description || !description.trim()) return;

    reportNewIssue(
      location.trim(),
      issueType,
      description.trim(),
      mediaUploaded
        ? 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
        : undefined
    );

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsReportIssueOpen(false);
      setLocation('');
      setDescription('');
      setMediaUploaded(false);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white/10">
              <AlertTriangle className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Report a Tourist Destination Problem</h3>
              <p className="text-amber-100 text-xs">Help authorities fix issues & keep tourism areas safe</p>
            </div>
          </div>
          <button
            id="close-report-issue-modal-btn"
            onClick={() => setIsReportIssueOpen(false)}
            className="p-1 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Your report has been submitted!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Our automated civic engine has grouped your submission with regional reports and updated the priority matrix for municipal resolution.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* Location input */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">Destination & Exact Location Landmark *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Fontainhas Stepwell Alley, Panaji, Goa"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>
            </div>

            {/* Issue type selector */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">Issue Category *</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as IssueReport['issueType'])}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-white"
              >
                {issueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">Description & Details *</label>
              <textarea
                rows={3}
                required
                placeholder="Describe the issue clearly (e.g., streetlights not working, dangerous open pothole, garbage dump near heritage temple)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
              />
            </div>

            {/* Photo / Media attachment */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">Attach Supporting Photo / Video (Optional)</label>
              <div
                onClick={() => setMediaUploaded(!mediaUploaded)}
                className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition ${
                  mediaUploaded
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-300 hover:border-amber-500 bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {mediaUploaded ? <Camera className="w-4 h-4 text-emerald-600" /> : <Upload className="w-4 h-4" />}
                  <span className="font-semibold">
                    {mediaUploaded ? 'Photo attached: destination_evidence.jpg' : 'Click to simulate uploading photo evidence'}
                  </span>
                </div>
              </div>
            </div>

            {/* Priority grouping notice */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Similar reports from this destination will automatically be clustered. When reports exceed the escalation threshold (5+ reports), an official dossier is dispatched to the tourism board.
              </span>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsReportIssueOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-issue-report-btn"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs transition cursor-pointer"
              >
                Submit Civic Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
