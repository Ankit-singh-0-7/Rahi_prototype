import React from 'react';
import { Attraction, OfferDiscount, EventFestival, CommunityPost } from '../../types';
import { useTravel } from '../../context/TravelContext';
import {
  Star,
  MapPin,
  Clock,
  Plus,
  Flame,
  Tag,
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  Copy,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const AttractionCard: React.FC<{ attraction: Attraction }> = ({ attraction }) => {
  const { addActivityToTrip, showToast } = useTravel();

  const handleAddToTrip = (e: React.MouseEvent) => {
    e.stopPropagation();
    addActivityToTrip(0, {
      id: `act-${Date.now()}`,
      timeSlot: attraction.bestTimeOfDay === 'Early Morning' || attraction.bestTimeOfDay === 'Morning' ? 'Morning' : 'Afternoon',
      activityTitle: attraction.name,
      description: attraction.description,
      location: attraction.destinationName,
      cost: attraction.cost,
      category: 'sightseeing',
    });
  };

  return (
    <div
      id={`attr-card-${attraction.id}`}
      className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={attraction.image}
          alt={attraction.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex gap-1.5">
          {attraction.category === 'hidden_gem' && (
            <span className="bg-amber-500 text-white font-extrabold px-2.5 py-0.5 rounded-full text-[10px] flex items-center space-x-1 shadow-md">
              <Flame className="w-3 h-3" />
              <span>Hidden Gem</span>
            </span>
          )}
          <span className="bg-sky-600/90 backdrop-blur-xs text-white font-bold px-2 py-0.5 rounded-full text-[10px]">
            {attraction.destinationName}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs font-bold bg-slate-900/60 backdrop-blur-md px-2 py-0.5 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{attraction.rating}</span>
            <span className="text-slate-300 font-normal">({attraction.reviewsCount})</span>
          </div>
          <span className="text-xs font-bold text-emerald-300">
            {attraction.cost === 0 ? 'Free Entry' : `₹${attraction.cost}`}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-sky-600 transition">
            {attraction.name}
          </h3>
          <p className="text-slate-600 text-xs line-clamp-2 mt-1 leading-relaxed">
            {attraction.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{attraction.durationHours} hrs ({attraction.bestTimeOfDay})</span>
          </div>
          <span className="font-semibold text-slate-700 truncate max-w-[120px]">{attraction.openingHours}</span>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500">
            {attraction.weatherSuitability === 'indoor_friendly' ? '☔ Rain Friendly' : '☀️ Best in Fair Weather'}
          </span>
          <button
            onClick={handleAddToTrip}
            className="py-1.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition shadow-xs flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Trip</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const OfferCard: React.FC<{ offer: OfferDiscount }> = ({ offer }) => {
  const { showToast, setIsEnquiryModalOpen, setEnquiryTarget } = useTravel();

  const handleClaim = () => {
    navigator.clipboard.writeText(offer.promoCode);
    showToast(`Promo code "${offer.promoCode}" copied! Use during enquiry or reservation.`);
    setEnquiryTarget({
      name: offer.businessName,
      type: 'business',
    });
    setIsEnquiryModalOpen(true);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-emerald-200 shadow-xs hover:shadow-xl transition-all flex flex-col group relative">
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={offer.image}
          alt={offer.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 bg-rose-600 text-white font-black px-3 py-1 rounded-full text-xs shadow-md animate-pulse">
          {offer.discountPercent}% OFF
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
            {offer.businessCategory} • {offer.destinationName}
          </span>
          <h3 className="text-base font-bold text-white line-clamp-1 mt-0.5">{offer.title}</h3>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <p className="text-xs text-slate-600 font-medium">{offer.conditions}</p>

        <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 line-through">₹{offer.originalPrice}</span>
            <div className="text-base font-black text-emerald-900">₹{offer.discountedPrice}</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">Promo Code</span>
            <span className="font-mono font-bold text-sky-800 bg-white px-2 py-0.5 rounded border border-sky-200 text-xs">
              {offer.promoCode}
            </span>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500">{offer.validUntil}</span>
          <button
            onClick={handleClaim}
            className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs flex items-center space-x-1 cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Claim & Enquire</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const EventCard: React.FC<{ event: EventFestival }> = ({ event }) => {
  const { setSelectedDestination, destinations, setActiveTab } = useTravel();

  const handleExploreEventDest = () => {
    const matched = destinations.find((d) => d.name.toLowerCase().includes(event.destinationName.toLowerCase()));
    if (matched) setSelectedDestination(matched);
    else setActiveTab('explore');
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col group">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="bg-purple-600 text-white font-bold px-2.5 py-0.5 rounded-full text-[10px]">
            {event.category}
          </span>
          {event.isHappeningSoon && (
            <span className="bg-rose-600 text-white font-extrabold px-2.5 py-0.5 rounded-full text-[10px] animate-pulse">
              Happening Soon!
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center space-x-1 text-xs text-sky-300 font-semibold mb-0.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{event.date} ({event.duration})</span>
          </div>
          <h3 className="text-base font-bold text-white line-clamp-1">{event.title}</h3>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-xs">
        <p className="text-slate-600 leading-relaxed line-clamp-2">{event.description}</p>

        <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100 text-[11px] text-purple-900">
          <strong>Why Visit Now:</strong> {event.whyVisitNow}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="font-bold text-slate-800">{event.destinationName}</span>
          <button
            onClick={handleExploreEventDest}
            className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center space-x-1 cursor-pointer"
          >
            <span>Plan for Festival</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const CommunityCard: React.FC<{ post: CommunityPost }> = ({ post }) => {
  const { likeCommunityPost, addCommentToPost } = useTravel();
  const [commentInput, setCommentInput] = React.useState('');
  const [showComments, setShowComments] = React.useState(false);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput || !commentInput.trim()) return;
    addCommentToPost(post.id, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-3.5 transition hover:shadow-md">
      {/* Author Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-100"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{post.authorName}</span>
              <span className="bg-sky-100 text-sky-800 font-semibold px-2 py-0.2 rounded-full text-[10px]">
                {post.authorBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{post.date} • #{post.destinationTag}</p>
          </div>
        </div>

        {post.rating && (
          <div className="flex items-center space-x-1 text-xs font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-xl border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{post.rating}.0 Experience</span>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-slate-900">{post.title}</h4>
        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{post.content}</p>
      </div>

      {/* Media Image */}
      {post.image && (
        <div className="rounded-2xl overflow-hidden max-h-72 border border-slate-100">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Actions (Like, Comment, Share) */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => likeCommunityPost(post.id)}
            className={`flex items-center space-x-1.5 font-bold transition cursor-pointer ${
              post.isLiked ? 'text-rose-600' : 'hover:text-rose-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
            <span>{post.likes} Likes</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1.5 font-semibold hover:text-sky-600 transition cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments.length} Comments</span>
          </button>
        </div>

        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
          {post.category === 'hidden_gem' ? '💎 Hidden Gem' : '📖 Travel Story'}
        </span>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs animate-in fade-in">
          {post.comments.map((c) => (
            <div key={c.id} className="flex items-start space-x-2.5 bg-slate-50 p-2.5 rounded-xl">
              <img src={c.avatar} alt={c.author} className="w-6 h-6 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-[11px]">{c.author}</span>
                  <span className="text-[10px] text-slate-400">{c.date}</span>
                </div>
                <p className="text-slate-700 text-xs mt-0.5">{c.text}</p>
              </div>
            </div>
          ))}

          <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Write a comment or ask a question..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
