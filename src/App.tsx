import React, { useState, useEffect } from 'react';
import { AuthWrapper } from './components/AuthWrapper';
import { HomePage } from './components/HomePage';
import { CandidateDetailsPage } from './components/CandidateDetailsPage';
import { EditResumePage } from './components/CreateResumePage';
import { ViewResumePage } from './components/ViewResumePage';
import { ResumeData, TailoredResume, PersonalInfo, Experience, Education, Skill, Certification, Language } from './types/resume';
import { ResumeService } from './services/resumeService';
import { supabase } from './lib/supabase';
import { FileText, LogOut, User as UserIcon, Download, ArrowLeft, Shield } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import html2pdf from 'html2pdf.js';
import { SecurityTest } from './components/SecurityTest';

type AppScreen = 'home' | 'candidate-details' | 'create-resume' | 'view-resume' | 'security-test';

const initialPersonalInfo: PersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  portfolio: '',
  summary: ''
};

const initialResumeData: ResumeData = {
  personalInfo: initialPersonalInfo,
  experiences: [],
  education: [],
  skills: [],
  certifications: [],
  languages: []
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [tailoredResumes, setTailoredResumes] = useState<TailoredResume[]>([]);
  const [viewingResume, setViewingResume] = useState<TailoredResume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveRef = React.useRef<(() => void) | null>(null);
  const exportPdfRef = React.useRef<(() => void) | null>(null);
  const [showJobDescModal, setShowJobDescModal] = useState(false);
  const [pendingCreateResume, setPendingCreateResume] = useState(false);
  const [jobDescForResume, setJobDescForResume] = useState('');
  const [resumeTitle, setResumeTitle] = useState('');
  const [isEditingResumeTitle, setIsEditingResumeTitle] = useState(false);

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load data when user is authenticated
  useEffect(() => {
    if (currentUser) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resumeData, tailoredResumes] = await Promise.all([
        ResumeService.loadResumeData(),
        ResumeService.loadTailoredResumes()
      ]);
      setResumeData(resumeData);
      setTailoredResumes(tailoredResumes);
    } catch (error: any) {
      console.error('Error loading data:', error);
      // If authentication error, redirect to auth
      if (error.message?.includes('not authenticated')) {
        await supabase.auth.signOut();
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalInfoChange = (personalInfo: PersonalInfo) => {
    setResumeData(prev => ({ ...prev, personalInfo }));
    // Removed auto-save
  };

  const handleExperiencesChange = (experiences: Experience[]) => {
    setResumeData(prev => ({ ...prev, experiences }));
  };

  const handleEducationChange = (education: Education[]) => {
    setResumeData(prev => ({ ...prev, education }));
  };

  const handleSkillsChange = (skills: Skill[]) => {
    setResumeData(prev => ({ ...prev, skills }));
  };

  const savePersonalInfo = async (personalInfo: PersonalInfo) => {
    setSaving(true);
    try {
      await ResumeService.savePersonalInfo(personalInfo);
    } catch (error) {
      console.error('Error saving personal info:', error);
    } finally {
      setSaving(false);
    }
  };

  const saveExperiences = async (experiences: Experience[]) => {
    setSaving(true);
    try {
      await ResumeService.saveExperiences(experiences);
    } catch (error) {
      console.error('Error saving experiences:', error);
    } finally {
      setSaving(false);
    }
  };

  const saveSkills = async (skills: Skill[]) => {
    setSaving(true);
    try {
      await ResumeService.saveSkills(skills);
    } catch (error) {
      console.error('Error saving skills:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleTailorResume = async (tailoredResume: TailoredResume) => {
    try {
      await ResumeService.saveTailoredResume(tailoredResume);
      setTailoredResumes(prev => [tailoredResume, ...prev]);
      setSaveError(null);
    } catch (error: any) {
      console.error('Error saving tailored resume:', error);
      setSaveError(error?.message || 'Failed to save tailored resume.');
    }
  };

  const handleViewResume = (resume: TailoredResume) => {
    setViewingResume(resume);
    setResumeTitle(resume.resumeTitle || 'Untitled Resume');
    setCurrentScreen('view-resume');
  };

  const handleDeleteResume = async (id: string) => {
    try {
      await ResumeService.deleteTailoredResume(id);
      setTailoredResumes(prev => prev.filter(resume => resume.id !== id));
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setViewingResume(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Clear cached data
    ResumeService.clearCache();
    setResumeData(initialResumeData);
    setTailoredResumes([]);
    setCurrentScreen('home');
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await ResumeService.saveResumeData(resumeData);
      // Reload from DB to ensure UI matches DB
      const updatedResumeData = await ResumeService.loadResumeData();
      setResumeData(updatedResumeData);
    } catch (error) {
      console.error('Error saving all resume data:', error);
    } finally {
      setSaving(false);
    }
  };

  // When user clicks create resume, show modal first
  const handleStartCreateResume = () => {
    setShowJobDescModal(true);
    setPendingCreateResume(true);
  };

  // When modal is submitted or skipped
  const handleJobDescModalDone = (desc: string) => {
    setJobDescForResume(desc);
    setShowJobDescModal(false);
    setCurrentScreen('create-resume');
    setPendingCreateResume(false);
    
    // Set the default resume title
    const baseName = 'New Resume';
    const existingNumbers = tailoredResumes
      .map(r => r.resumeTitle)
      .filter((title): title is string => title !== undefined && title.startsWith(baseName))
      .map(title => {
        const match = title.match(/^New Resume (\d+)$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter(n => n !== null) as number[];
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    setResumeTitle(`${baseName} ${nextNumber}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {/* Job Description Modal */}
      {showJobDescModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Enter Job Description</h2>
            <textarea
              className="w-full border border-gray-300 rounded p-2 mb-4"
              rows={6}
              value={jobDescForResume}
              onChange={e => setJobDescForResume(e.target.value)}
              placeholder="Paste the job description here (optional)"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => handleJobDescModalDone('')}
              >
                Skip
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => handleJobDescModalDone(jobDescForResume)}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      <AuthWrapper>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                {currentScreen === 'home' ? (
                  <div className="flex items-center gap-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-800" />
                    </div>
                    <div>
                      <h1 className="text-lg font-medium text-gray-800">ResumeAI</h1>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleBackToHome}
                      className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      
                    </button>
                    {(currentScreen === 'create-resume' || currentScreen === 'view-resume') && (
                      <div className="flex items-center gap-2">
                        {isEditingResumeTitle ? (
                          <input
                            type="text"
                            value={resumeTitle}
                            onChange={(e) => setResumeTitle(e.target.value)}
                            onBlur={() => setIsEditingResumeTitle(false)}
                            onKeyDown={(e) => e.key === 'Enter' && setIsEditingResumeTitle(false)}
                            className="text-lg font-medium text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                            autoFocus
                          />
                        ) : (
                          <button
                            onClick={() => setIsEditingResumeTitle(true)}
                            className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors"
                          >
                            {resumeTitle || 'Untitled Resume'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  {currentScreen === 'home' && (
                    <>
                      <button
                        onClick={() => setCurrentScreen('candidate-details')}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <UserIcon className="w-4 h-4" />
                        Details
                      </button>
                      
                      <button
                        onClick={handleStartCreateResume}
                        className="flex items-center gap-2 px-4 py-2 font-regular bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Create resume
                      </button>
                    </>
                  )}
                  {(currentScreen === 'create-resume' || currentScreen === 'view-resume') && (
                    <>
                      <button
                        onClick={() => saveRef.current && saveRef.current()}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors shadow-sm"
                        title="Save Changes"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => exportPdfRef.current && exportPdfRef.current()}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                        title="Export as PDF"
                      >
                        <Download className="w-4 h-4" />
                        Export PDF
                      </button>
                    </>
                  )}
                  {saving && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </div>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-1.5 py-1.5 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            {currentScreen === 'home' && (
              <HomePage
                tailoredResumes={tailoredResumes}
                onCreateResume={handleStartCreateResume}
                onEditCandidateDetails={() => setCurrentScreen('candidate-details')}
                onViewResume={handleViewResume}
                onDeleteResume={handleDeleteResume}
              />
            )}

            {currentScreen === 'candidate-details' && (
              <CandidateDetailsPage
                resumeData={resumeData}
                onPersonalInfoChange={handlePersonalInfoChange}
                onExperiencesChange={handleExperiencesChange}
                onEducationChange={handleEducationChange}
                onSkillsChange={handleSkillsChange}
                onBack={handleBackToHome}
                onSave={handleSaveAll} // Pass the new handler
              />
            )}

            {currentScreen === 'create-resume' && (
              (() => {
                // Count existing resumes with the base name 'New Resume'
                const baseName = 'New Resume';
                const existingNumbers = tailoredResumes
                  .map(r => r.resumeTitle)
                  .filter((title): title is string => title !== undefined && title.startsWith(baseName))
                  .map(title => {
                    const match = title.match(/^New Resume (\d+)$/);
                    return match ? parseInt(match[1], 10) : null;
                  })
                  .filter(n => n !== null) as number[];
                const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
                const defaultTitle = `${baseName} ${nextNumber}`;
                return (
                  <EditResumePage
                    resumeData={resumeData}
                    onCreateResume={handleTailorResume}
                    onBack={handleBackToHome}
                    saveError={saveError}
                    onDismissError={() => setSaveError(null)}
                    saveRef={saveRef}
                    exportPdfRef={exportPdfRef}
                    defaultResumeTitle={defaultTitle}
                    jobDescriptionFromModal={jobDescForResume}
                    headerResumeTitle={resumeTitle}
                    onHeaderResumeTitleChange={setResumeTitle}
                  />
                );
              })()
            )}

            {currentScreen === 'view-resume' && viewingResume && (
              <ViewResumePage
                resume={viewingResume}
                onBack={handleBackToHome}
                onUpdateResume={async (updated) => {
                  try {
                    await ResumeService.saveTailoredResume(updated);
                    setTailoredResumes(prev => prev.map(r => r.id === updated.id ? updated : r));
                    setViewingResume(updated);
                    setSaveError(null);
                  } catch (error: any) {
                    setSaveError(error?.message || 'Failed to update tailored resume.');
                  }
                }}
                saveError={saveError}
                onDismissError={() => setSaveError(null)}
                saveRef={saveRef}
                exportPdfRef={exportPdfRef}
              />
            )}

            {currentScreen === 'security-test' && (
              <SecurityTest />
            )}
          </div>
        </div>
      </AuthWrapper>
    </>
  );
}

export default App;