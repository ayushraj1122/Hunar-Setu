import React, { useState, useEffect } from 'react';
import { SHGProfile, SHGMember, OrderItem, LectureCourse } from '../types';
import { SHG_COURSES } from '../data/seedData';
import {
  GraduationCap,
  Package,
  CheckCircle,
  Play,
  Users,
  IdCard,
  Building,
  MapPin,
  Phone,
  Sparkles,
  ExternalLink,
  Clock,
  BookOpen,
  Award,
  Check,
  Ban,
  ArrowRight,
  Plus,
  Trash2,
  Video,
  Wand2,
  Split
} from 'lucide-react';

interface SHGPortalProps {
  currentSHG: SHGProfile | null;
  activeUserEmail?: string;
  orders: OrderItem[];
  onSaveProfile: (profile: SHGProfile) => Promise<void>;
  onUpdateOrderStatus: (
    orderId: string,
    status: 'In Production' | 'Completed' | 'Cancelled',
    shgId?: string
  ) => Promise<void>;
  onBackToHome: () => void;
}

export const SHGPortal: React.FC<SHGPortalProps> = ({
  currentSHG,
  activeUserEmail,
  orders,
  onSaveProfile,
  onUpdateOrderStatus,
  onBackToHome
}) => {
  // First time login registration state if no profile exists yet
  const [isRegistering, setIsRegistering] = useState<boolean>(!currentSHG);
  const [activeTab, setActiveTab] = useState<'learning' | 'orders'>('learning');

  // Registration form states: default to clean blank state for a new SHG
  const [groupName, setGroupName] = useState(currentSHG?.groupName || '');
  const [regNumber, setRegNumber] = useState(currentSHG?.regNumber || '');
  const [district, setDistrict] = useState(currentSHG?.district || '');
  const [state, setState] = useState(currentSHG?.state || '');
  const [contactPhone, setContactPhone] = useState(currentSHG?.contactPhone || '');
  const [overallSkill, setOverallSkill] = useState(currentSHG?.overallSkill || '');
  const [leaderEmail, setLeaderEmail] = useState(currentSHG?.leaderEmail || activeUserEmail || '');

  // Members list for individual names, Aadhaar, and skills: empty for new SHG
  const [members, setMembers] = useState<SHGMember[]>(currentSHG?.members || []);

  // Sync state whenever currentSHG or activeUserEmail changes
  useEffect(() => {
    if (currentSHG) {
      setGroupName(currentSHG.groupName || '');
      setRegNumber(currentSHG.regNumber || '');
      setDistrict(currentSHG.district || '');
      setState(currentSHG.state || '');
      setContactPhone(currentSHG.contactPhone || '');
      setOverallSkill(currentSHG.overallSkill || '');
      setLeaderEmail(currentSHG.leaderEmail || activeUserEmail || '');
      setMembers(currentSHG.members || []);
      setVideoProgress(currentSHG.videoProgress || {});
      setCompletedLectures(currentSHG.completedLectures || []);
      setIsRegistering(false);
    } else {
      // Clean blank state for newly logged-in SHG
      setGroupName('');
      setRegNumber('');
      setDistrict('');
      setState('');
      setContactPhone('');
      setOverallSkill('');
      setLeaderEmail(activeUserEmail || '');
      setMembers([]);
      setVideoProgress({});
      setCompletedLectures([]);
      setIsRegistering(true);
    }
  }, [currentSHG, activeUserEmail]);

  // New member inputs
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberAadhaar, setNewMemberAadhaar] = useState('');
  const [newMemberSkill, setNewMemberSkill] = useState('');

  // Course & Video Player modal state
  const [activeLecture, setActiveLecture] = useState<LectureCourse | null>(null);
  const [videoProgress, setVideoProgress] = useState<Record<string, number>>(
    currentSHG?.videoProgress || {}
  );
  const [completedLectures, setCompletedLectures] = useState<string[]>(
    currentSHG?.completedLectures || []
  );

  // Filter orders assigned specifically to this SHG (supports legacy assignedShgId and multi-SHG allocations)
  const myAssignedOrders = currentSHG
    ? orders.filter(
        (o) =>
          o.assignedShgId === currentSHG.id ||
          (o.allocations && o.allocations.some((a) => a.shgId === currentSHG.id))
      )
    : [];

  // Helper to autofill sample craft group info if user wants to test quickly
  const handleFillSample = () => {
    setGroupName('Navchetna Mahila Sangathan');
    setRegNumber('SHG-MP-2024-9102');
    setDistrict('Chanderi');
    setState('Madhya Pradesh');
    setContactPhone('+91 98260 55432');
    setOverallSkill('Chanderi Silk Handloom Weaving & Zari Work');
    setLeaderEmail(activeUserEmail || 'navchetna.shg@hunarsetu.org');
    setMembers([
      {
        id: 'm_sample_1',
        name: 'Kamla Bai',
        aadhaarNumber: '4455-6677-8899',
        skill: 'Loom Warping & Jacquard Setting',
        experienceYears: 7
      },
      {
        id: 'm_sample_2',
        name: 'Meena Sharma',
        aadhaarNumber: '3322-1144-5566',
        skill: 'Gold & Silver Zari Border Inlay',
        experienceYears: 5
      }
    ]);
  };

  // Add individual member
  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberAadhaar.trim() || !newMemberSkill.trim()) {
      alert('Please fill Member Name, Aadhaar Number and Specific Skill');
      return;
    }
    const newM: SHGMember = {
      id: 'm_' + Date.now(),
      name: newMemberName.trim(),
      aadhaarNumber: newMemberAadhaar.trim(),
      skill: newMemberSkill.trim(),
      experienceYears: 3
    };
    setMembers([...members, newM]);
    setNewMemberName('');
    setNewMemberAadhaar('');
    setNewMemberSkill('');
  };

  const handleRemoveMember = (id: string) => {
    if (members.length <= 1) {
      alert('At least one member is required in an SHG.');
      return;
    }
    setMembers(members.filter((m) => m.id !== id));
  };

  // Submit profile registration
  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (members.length === 0) {
      alert('Please add at least one member to your SHG.');
      return;
    }
    const profile: SHGProfile = {
      id: currentSHG?.id || 'shg_' + Date.now(),
      groupName,
      regNumber,
      district,
      state,
      contactPhone,
      leaderEmail,
      overallSkill,
      members,
      videoProgress,
      completedLectures,
      createdAt: currentSHG?.createdAt || new Date().toISOString()
    };

    await onSaveProfile(profile);
    setIsRegistering(false);
  };

  // Video progress updater
  const handleUpdateProgress = async (lectureId: string, percent: number) => {
    const updatedProg = { ...videoProgress, [lectureId]: percent };
    setVideoProgress(updatedProg);
    let updatedCompleted = [...completedLectures];
    if (percent >= 100 && !updatedCompleted.includes(lectureId)) {
      updatedCompleted.push(lectureId);
      setCompletedLectures(updatedCompleted);
    }
    if (currentSHG) {
      await onSaveProfile({
        ...currentSHG,
        videoProgress: updatedProg,
        completedLectures: updatedCompleted
      });
    }
  };

  // FIRST TIME LOGIN FORM (as specified in prompt: "on first time login as all detail in form of form. like all each individual names and adhar card.. and each skills and overall skill for the entire group")
  if (isRegistering) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-emerald-800 text-white p-6 sm:p-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
                Hunar-Setu National SHG Portal
              </span>
              <button
                type="button"
                onClick={onBackToHome}
                className="text-xs bg-emerald-700/80 hover:bg-emerald-700 px-3 py-1 rounded-lg text-emerald-100 transition-colors"
              >
                Back to Home
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Self-Help Group (SHG) Enrollment & Skill Registration
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
              Please declare your registered SHG group details, overall collective specialization, and all individual member profiles with Aadhaar identification for transparent order distribution.
            </p>
          </div>

          <form onSubmit={handleSubmitProfile} className="p-6 sm:p-8 space-y-6">
            {/* Account Status Badge */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Creating New SHG Registry for: <strong className="font-bold text-emerald-950">{activeUserEmail || leaderEmail || 'New Group'}</strong>
                </span>
              </div>
              <button
                type="button"
                id="shg-autofill-sample-btn"
                onClick={handleFillSample}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
              >
                <Wand2 className="w-3.5 h-3.5 text-emerald-600" /> Autofill Sample Group
              </button>
            </div>

            {/* Group Identity */}
            <div className="border-b border-slate-100 pb-6 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" /> Group Identity & Location
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SHG Group Name *</label>
                  <input
                    id="shg-group-name-input"
                    type="text"
                    required
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g. Pratibha Mahila Sangathan"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SHG Registration / NRLM Code *</label>
                  <input
                    id="shg-reg-number-input"
                    type="text"
                    required
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    placeholder="e.g. SHG-UP-2024-8842"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
                  <input
                    id="shg-district-input"
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Prayagraj"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                  <input
                    id="shg-state-input"
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Uttar Pradesh"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Leader Mobile Phone *</label>
                  <input
                    id="shg-phone-input"
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Leader Email Address</label>
                  <input
                    id="shg-email-input"
                    type="email"
                    value={leaderEmail}
                    onChange={(e) => setLeaderEmail(e.target.value)}
                    placeholder="leader@shg.org"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Overall Skill for entire group */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Overall Primary Skill / Craft Specialization for the Entire Group *
                </label>
                <input
                  id="shg-overall-skill-input"
                  type="text"
                  required
                  value={overallSkill}
                  onChange={(e) => setOverallSkill(e.target.value)}
                  placeholder="e.g. Natural Moonj Grass Basketry, Handloom Cotton Weaving, Terracotta Pottery"
                  className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-lg bg-emerald-50/40 text-emerald-950 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Admin will distribute production orders based on this collective skill category.
                </span>
              </div>
            </div>

            {/* Individual Members List: Each individual name, Aadhaar card, and each individual skill */}
            <div className="border-b border-slate-100 pb-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" /> Individual Member Skill Registry
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Register each artisan with their Name, Aadhaar ID, and unique personal craft skill.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                  {members.length} Members Enrolled
                </span>
              </div>

              {/* Existing Members Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {members.map((m, idx) => (
                  <div key={m.id} className="p-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-900">{m.name}</span>
                        <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                          <IdCard className="w-3 h-3 text-slate-400" /> Aadhaar: {m.aadhaarNumber}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] pl-7">
                        <span className="text-slate-400 font-medium">Individual Skill:</span> {m.skill}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(m.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Member Sub-Form */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">Add Another Member to SHG:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    id="new-member-name"
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Member Full Name"
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                  <input
                    id="new-member-aadhaar"
                    type="text"
                    value={newMemberAadhaar}
                    onChange={(e) => setNewMemberAadhaar(e.target.value)}
                    placeholder="12-digit Aadhaar Card"
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                  />
                  <input
                    id="new-member-skill"
                    type="text"
                    value={newMemberSkill}
                    onChange={(e) => setNewMemberSkill(e.target.value)}
                    placeholder="Individual Artisan Skill"
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <button
                  id="add-shg-member-btn"
                  type="button"
                  onClick={handleAddMember}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Append Member
                </button>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onBackToHome}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                id="submit-shg-registration-btn"
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" /> Save Profile & Launch Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // SHG DASHBOARD: Divided into Two categories per user requirement:
  // i) learning (with video cards, youtube integration, and progress tracker)
  // ii) order to produce (admin assigned orders with photo & quantity, and ability to complete or cancel)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* SHG Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                HS
              </div>
              <span className="font-semibold text-slate-900 hidden sm:inline">Hunar-Setu</span>
            </button>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                SHG: {currentSHG?.groupName || groupName}
              </span>
              <span className="text-xs text-slate-500 hidden md:inline">
                ({currentSHG?.district || district}, {currentSHG?.state || state})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="edit-shg-profile-btn"
              onClick={() => setIsRegistering(true)}
              className="text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Update Registration
            </button>
            <button
              onClick={onBackToHome}
              className="text-xs font-semibold text-rose-700 hover:bg-rose-50 px-3 py-1.5 border border-rose-200 rounded-lg transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Two Mandatory Tabs: i) Learning, ii) Order to Produce */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center border-t border-slate-100">
          <button
            id="shg-tab-learning"
            onClick={() => setActiveTab('learning')}
            className={`py-3 px-5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'learning'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            i) Learning & Skill Courses ({SHG_COURSES.length})
          </button>
          <button
            id="shg-tab-orders"
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all relative ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            ii) Orders to Produce
            {myAssignedOrders.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">
                {myAssignedOrders.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: LEARNING */}
        {activeTab === 'learning' && (
          <div className="space-y-6">
            {/* Learning summary header */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  Skill Development & Video Tutorials
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Artisan Skill Curriculum & Completion Tracker
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Watch curated master-artisan lectures, sharpen group craft methods, and track progress towards certified production status.
                </p>
              </div>

              {/* Progress Tracker Widget */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 w-full sm:w-72">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" /> Overall Progress
                  </span>
                  <span className="text-emerald-700">
                    {completedLectures.length} of {SHG_COURSES.length} Completed
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-500"
                    style={{
                      width: `${Math.round((completedLectures.length / SHG_COURSES.length) * 100)}%`
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1.5 block text-right">
                  {Math.round((completedLectures.length / SHG_COURSES.length) * 100)}% certified curriculum completed
                </span>
              </div>
            </div>

            {/* Lecture Cards Grid with embedded or popup video and progress tracker */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SHG_COURSES.map((course) => {
                const prog = videoProgress[course.id] || 0;
                const isCompleted = completedLectures.includes(course.id) || prog >= 100;

                return (
                  <div
                    key={course.id}
                    id={`lecture-card-${course.id}`}
                    className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Video Thumbnail with Play Button */}
                      <div className="relative aspect-video bg-slate-900 group">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition-opacity"
                        />
                        <button
                          id={`play-video-btn-${course.id}`}
                          onClick={() => setActiveLecture(course)}
                          className="absolute inset-0 m-auto w-12 h-12 bg-white/90 group-hover:bg-emerald-600 text-slate-900 group-hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all transform group-hover:scale-110"
                        >
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </button>
                        <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[11px] font-mono px-2 py-0.5 rounded">
                          {course.duration}
                        </span>
                        {isCompleted && (
                          <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Check className="w-3 h-3" /> Completed
                          </span>
                        )}
                      </div>

                      {/* Course Details */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-emerald-700 font-bold uppercase tracking-wider">
                            {course.category}
                          </span>
                          <span className="text-slate-400 font-medium">{course.level}</span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {course.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2">
                          {course.description}
                        </p>

                        <div className="pt-2">
                          <span className="text-[11px] font-bold text-slate-700 block mb-1">Key Skills Taught:</span>
                          <div className="flex flex-wrap gap-1">
                            {course.keySkillsTaught.map((skill, i) => (
                              <span
                                key={i}
                                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Tracker Slider & Direct Link */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50/60 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                          <span>Progress Completed:</span>
                          <span className="text-emerald-700">{prog}%</span>
                        </div>
                        <input
                          id={`progress-slider-${course.id}`}
                          type="range"
                          min="0"
                          max="100"
                          value={prog}
                          onChange={(e) => handleUpdateProgress(course.id, Number(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => setActiveLecture(course)}
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                        >
                          <Video className="w-3.5 h-3.5" /> Watch in Portal
                        </button>
                        <a
                          href={course.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1"
                        >
                          YouTube Link <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ORDER TO PRODUCE (If admin sends order to particular SHG, appears here by photo & quantity with complete or cancel power) */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                  ii) Production Orders Assigned by Hunar-Setu Admin
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Active Production & Handcrafting Pipeline
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Admin distributes verified buyer orders to your group based on your registered skills. Update each batch status as Completed or Cancelled once inspected.
                </p>
              </div>

              <div className="text-xs font-semibold px-3 py-1.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
                {myAssignedOrders.length} Order(s) in Group Queue
              </div>
            </div>

            {myAssignedOrders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-700 font-semibold text-sm">No Active Production Orders Assigned Yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  When the Central Admin distributes incoming buyer orders to your SHG group, they will automatically reflect here with photos and quantity.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myAssignedOrders.map((order) => {
                  const myAlloc = order.allocations?.find((a) => a.shgId === currentSHG?.id);
                  const myQty = myAlloc ? myAlloc.quantity : order.quantity;
                  const myStatus = myAlloc ? myAlloc.productionStatus : order.productionStatus;
                  const isDistributed = Boolean(order.allocations && order.allocations.length > 1);
                  const myBatchValue = myQty * order.productPrice;

                  return (
                    <div
                      key={order.id}
                      id={`shg-order-${order.id}`}
                      className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                Order #{order.id.slice(-6)}
                              </span>
                              {isDistributed && (
                                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold text-[10px] flex items-center gap-1">
                                  <Split className="w-3 h-3 text-purple-700" /> Multi-SHG Batch
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400 block mt-1">
                              Ordered: {new Date(order.orderDate).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Production Status Badge */}
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              myStatus === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : myStatus === 'Cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800 animate-pulse'
                            }`}
                          >
                            Status: {myStatus}
                          </span>
                        </div>

                        {/* Photo & Quantity Display */}
                        <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-4">
                          <img
                            src={order.productImage}
                            alt={order.productTitle}
                            className="w-20 h-20 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                          />
                          <div className="space-y-1 flex-1">
                            <h4 className="text-sm font-bold text-slate-900 leading-snug">
                              {order.productTitle}
                            </h4>
                            <p className="text-xs font-semibold text-emerald-800">
                              Your Assigned Quantity:{' '}
                              <span className="text-base text-slate-900 font-extrabold">{myQty} units</span>
                              {isDistributed && (
                                <span className="text-slate-500 font-normal ml-1">
                                  (of {order.quantity} total)
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-500">
                              Your Batch Value: ₹{myBatchValue.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        {/* Buyer Delivery Summary */}
                        <div className="text-xs text-slate-600 space-y-1 bg-white border border-slate-100 rounded-lg p-3 mb-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Buyer:</span>
                            <span className="font-medium text-slate-800">{order.buyerName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Destination:</span>
                            <span className="font-medium text-slate-800 truncate max-w-[200px]">{order.buyerAddress}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Payment:</span>
                            <span className="text-emerald-700 font-semibold">{order.paymentStatus}</span>
                          </div>
                        </div>
                      </div>

                      {/* Powers to Select Complete or Cancel as requested in prompt */}
                      <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center gap-3">
                        <button
                          id={`shg-order-cancel-${order.id}`}
                          onClick={() => onUpdateOrderStatus(order.id, 'Cancelled', currentSHG?.id)}
                          disabled={myStatus === 'Cancelled'}
                          className="flex-1 py-2 px-3 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                        >
                          <Ban className="w-3.5 h-3.5" /> Cancel Batch
                        </button>
                        <button
                          id={`shg-order-complete-${order.id}`}
                          onClick={() => onUpdateOrderStatus(order.id, 'Completed', currentSHG?.id)}
                          disabled={myStatus === 'Completed'}
                          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 shadow-sm transition-all disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" /> Mark Completed
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* VIDEO PLAYER MODAL */}
      {activeLecture && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-700 truncate pr-4">
                {activeLecture.title}
              </span>
              <button
                id="close-video-modal-btn"
                onClick={() => setActiveLecture(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Embedded Responsive YouTube Player */}
            <div className="aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeLecture.youtubeId}?autoplay=1`}
                title={activeLecture.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{activeLecture.instructor}</h4>
                  <p className="text-xs text-slate-500">{activeLecture.duration} • {activeLecture.level}</p>
                </div>
                <button
                  id="mark-lecture-finished-btn"
                  onClick={() => {
                    handleUpdateProgress(activeLecture.id, 100);
                    setActiveLecture(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
                >
                  <Check className="w-4 h-4" /> Mark 100% Completed
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeLecture.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
