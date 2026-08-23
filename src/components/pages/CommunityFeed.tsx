import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { CommunityCard } from '../cards/AttractionCard';
import { CivicDossierModal } from '../modals/CivicDossierModal';
import { IssueReport } from '../../types';
import {
  Users,
  Plus,
  MessageSquare,
  ShieldAlert,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Filter,
  ShieldCheck,
  Send,
  PhoneCall,
  Clock,
  Sparkles,
  MapPin,
} from 'lucide-react';

export const CommunityFeed: React.FC = () => {
  const { communityPosts, addCommunityPost, userProfile } = useTravel();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('Goa');
  const [category, setCategory] = useState<'travel_story' | 'hidden_gem' | 'review' | 'tip'>('travel_story');
  const [filterCat, setFilterCat] = useState<string>('all');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !title.trim() || !content || !content.trim()) return;

    addCommunityPost({
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      authorBadge: 'Verified Traveller',
      destinationTag: tag,
      title: title.trim(),
      content: content.trim(),
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      category,
      rating: 5,
    });

    setShowCreateModal(false);
    setTitle('');
    setContent('');
  };

  const filteredPosts = filterCat === 'all'
    ? communityPosts
    : communityPosts.filter((p) => p.category === filterCat);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Traveller Community Feed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 font-display">
            Real Stories & Honest Tips
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Exchange hidden gems, safety advice, and authentic culinary discoveries.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Share Your Story</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Stories' },
          { id: 'travel_story', label: '📖 Experiences' },
          { id: 'hidden_gem', label: '💎 Hidden Gems' },
          { id: 'tip', label: '💡 Travel Tips' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCat(tab.id)}
            className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
              filterCat === tab.id
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <CommunityCard key={post.id} post={post} />
        ))}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-sky-600 text-white p-4 font-bold flex items-center justify-between">
              <span>Share Travel Story / Gem</span>
              <button
                onClick={() => setShowCreateModal(false)}
                className="hover:bg-white/20 p-1 rounded-full cursor-pointer text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Destination *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fontainhas, Goa / Jibhi, Himachal"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Post Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My peaceful morning at the secluded Butterfly Beach"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="travel_story">Travel Experience Story</option>
                  <option value="hidden_gem">Secret / Hidden Gem</option>
                  <option value="tip">Safety or Budget Tip</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Your Story & Insider Advice *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details on how to reach, best timing, local delicacies, and what to keep in mind..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition cursor-pointer"
                >
                  Publish Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const SafetyCivicPortal: React.FC = () => {
  const { issueReports, setIsReportIssueOpen, setIsSOSOpen } = useTravel();

  const [selectedIssueForDossier, setSelectedIssueForDossier] = useState<IssueReport | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('All');

  const filteredIssues = filterPriority === 'All'
    ? issueReports
    : issueReports.filter((i) => i.priority === filterPriority);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-rose-900/30">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Civic Problem Priority Matrix & Safety Shield</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display">
            Tourist Safety & Civic Escalation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Report broken infrastructure, scams, or dark alleys. When reports cluster in a destination, an official actionable dossier is auto-compiled for Municipal & Tourism boards.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setIsSOSOpen(true)}
            className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-1.5 transition cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>24x7 SOS Protocol</span>
          </button>
          <button
            onClick={() => setIsReportIssueOpen(true)}
            className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-lg flex items-center justify-center space-x-1.5 transition cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report Destination Problem</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 uppercase font-bold block text-[10px]">Active Tracked Reports</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{issueReports.length} Clusters</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
          <span className="text-slate-400 uppercase font-bold block text-[10px]">Critical / High Priority</span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">
            {issueReports.filter((i) => i.priority === 'HIGH' || i.priority === 'CRITICAL').length} Areas
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-slate-400 uppercase font-bold block text-[10px]">Resolved Municipal Wards</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">14 Corrected</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs">
          <span className="text-slate-400 uppercase font-bold block text-[10px]">Escalation Target Response</span>
          <span className="text-2xl font-black text-sky-600 mt-1 block">&lt; 48 Hours</span>
        </div>
      </div>

      {/* Priority Board & Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-slate-900 text-sm">Active Destination Issue Priority Board</h3>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold text-[10px]">
              Clustered by Geographic Proximity
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {['All', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((pri) => (
              <button
                key={pri}
                onClick={() => setFilterPriority(pri)}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  filterPriority === pri
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {pri}
              </button>
            ))}
          </div>
        </div>

        {/* Issue Cards */}
        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50"
            >
              <div className="flex items-start space-x-3.5">
                <div
                  className={`p-2.5 rounded-xl text-white font-bold shrink-0 shadow-xs ${
                    issue.priority === 'CRITICAL' || issue.priority === 'HIGH'
                      ? 'bg-rose-600'
                      : issue.priority === 'MEDIUM'
                      ? 'bg-amber-500'
                      : 'bg-sky-600'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{issue.location}</span>
                    <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.2 rounded-md">
                      {issue.issueType}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.2 rounded-md uppercase ${
                        issue.priority === 'CRITICAL' || issue.priority === 'HIGH'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {issue.priority} Priority ({issue.reportCount} reports)
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">{issue.description}</p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2">
                    <span>Reported: {issue.reportedAt}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">Status: {issue.status}</span>
                    {issue.escalatedTo && (
                      <>
                        <span>•</span>
                        <span className="text-sky-800 font-medium">Assigned: {issue.escalatedTo}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center space-x-2 pt-2 md:pt-0 border-t md:border-0 border-slate-200">
                <button
                  onClick={() => setSelectedIssueForDossier(issue)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-300" />
                  <span>View Authority Dossier</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dossier Modal */}
      {selectedIssueForDossier && (
        <CivicDossierModal
          issue={selectedIssueForDossier}
          onClose={() => setSelectedIssueForDossier(null)}
        />
      )}
    </div>
  );
};
