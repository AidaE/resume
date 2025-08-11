import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ResumeData, TailoredResume, Skill } from '../types/resume';
import { ResumePreview } from './ResumePreview';
import { ArrowLeft, Target, Sparkles, FileText, Building, AlertCircle, ChevronDown, ChevronRight, GraduationCap, Download } from 'lucide-react';
import { PersonalInfoForm } from './PersonalInfoForm';
import { EducationForm } from './EducationForm';
import { ExperienceForm } from './ExperienceForm';
import { SkillsForm } from './SkillsForm';
import html2pdf from 'html2pdf.js';
import { generateResumeSections, CandidateDetails } from '../services/geminiService';
import { ResumeService } from '../services/resumeService';
import { generateProfessionalSummary, extractCompanyAndJobTitle, extractToolsAndSkills } from '../services/openaiService';

// JobDetailsForm component
interface JobDetailsFormProps {
  jobTitle: string;
  company: string;
  jobDescription: string;
  onJobTitleChange: (val: string) => void;
  onCompanyChange: (val: string) => void;
  onJobDescriptionChange: (val: string) => void;
}
const JobDetailsForm: React.FC<JobDetailsFormProps & { jobDescEdited: boolean; setJobDescEdited: (v: boolean) => void }> = ({ jobTitle, company, jobDescription, onJobTitleChange, onCompanyChange, onJobDescriptionChange, jobDescEdited, setJobDescEdited }) => {
  const [localJobTitle, setLocalJobTitle] = useState(jobTitle);
  const [localCompany, setLocalCompany] = useState(company);
  const [localJobDescription, setLocalJobDescription] = useState(jobDescription);
  useEffect(() => { setLocalJobTitle(jobTitle); }, [jobTitle]);
  useEffect(() => { setLocalCompany(company); }, [company]);
  useEffect(() => { setLocalJobDescription(jobDescription); }, [jobDescription]);
  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Job Title</label>
          <input
            type="text"
            value={localJobTitle}
            onChange={e => setLocalJobTitle(e.target.value)}
            onBlur={() => onJobTitleChange(localJobTitle)}
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="e.g. Senior Software Engineer"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Company</label>
          <input
            type="text"
            value={localCompany}
            onChange={e => setLocalCompany(e.target.value)}
            onBlur={() => onCompanyChange(localCompany)}
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="e.g. TechCorp Inc."
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 mt-4">Job Description</label>
        <textarea
          value={localJobDescription}
          onChange={e => {
            setLocalJobDescription(e.target.value);
            setJobDescEdited(true);
          }}
          onBlur={() => onJobDescriptionChange(localJobDescription)}
          rows={8}
          className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          placeholder="Paste the complete job description here. The AI will analyze this to tailor your resume..."
        />
        <p className="text-xs text-gray-500 mt-1">Include requirements, responsibilities, and preferred qualifications for best results.</p>
      </div>
    </>
  );
};

interface EditResumePageProps {
  resumeData: ResumeData;
  onCreateResume?: (tailoredResume: TailoredResume) => void;
  onUpdateResume?: (tailoredResume: TailoredResume) => void;
  onBack: () => void;
  saveError?: string | null;
  onDismissError?: () => void;
  tailoredResume?: TailoredResume;
  saveRef?: React.MutableRefObject<(() => void) | null>;
  exportPdfRef?: React.MutableRefObject<(() => void) | null>;
  defaultResumeTitle?: string;
  jobDescriptionFromModal?: string;
  headerResumeTitle?: string;
  onHeaderResumeTitleChange?: (title: string) => void;
}

export const EditResumePage = forwardRef<HTMLDivElement, EditResumePageProps>(({ resumeData, onCreateResume, onUpdateResume, onBack, saveError, onDismissError, tailoredResume, saveRef, exportPdfRef, defaultResumeTitle, jobDescriptionFromModal, headerResumeTitle, onHeaderResumeTitleChange }, ref) => {
  const [resumeTitle, setResumeTitle] = useState(
    tailoredResume?.resumeTitle || defaultResumeTitle || ''
  );

  // Sync with header resume title
  useEffect(() => {
    if (headerResumeTitle && headerResumeTitle !== resumeTitle) {
      setResumeTitle(headerResumeTitle);
    }
  }, [headerResumeTitle, resumeTitle]);

  // Update header when local title changes
  const updateResumeTitle = (newTitle: string) => {
    setResumeTitle(newTitle);
    if (onHeaderResumeTitleChange) {
      onHeaderResumeTitleChange(newTitle);
    }
  };
  const [personalInfo, setPersonalInfo] = useState(tailoredResume ? { ...tailoredResume.resumeData.personalInfo } : { ...resumeData.personalInfo });
  const [education, setEducation] = useState(tailoredResume ? [...tailoredResume.resumeData.education] : [...resumeData.education]);
  const [experiences, setExperiences] = useState(tailoredResume ? [...tailoredResume.resumeData.experiences] : [...resumeData.experiences]);
  const [skills, setSkills] = useState(tailoredResume ? [...tailoredResume.resumeData.skills] : [...resumeData.skills]);
  const [jobTitle, setJobTitle] = useState(tailoredResume?.jobTitle || '');
  const [company, setCompany] = useState(tailoredResume?.company || '');
  const [jobDescription, setJobDescription] = useState(
    tailoredResume?.jobDescription || jobDescriptionFromModal || ''
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<TailoredResume | null>(null);
  const [resumeTitleInput, setResumeTitleInput] = useState<string | undefined>(undefined);
  const [candidate, setCandidate] = useState<CandidateDetails | null>(null);
  const [fetchingCandidate, setFetchingCandidate] = useState(true);
  const [aiSections, setAiSections] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const [jobDescEdited, setJobDescEdited] = useState(false);

  // Expand/collapse state for each section
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    education: true,
    experience: true,
    skills: true,
    job: true,
  });

  // Reusable expandable section
  const ExpandableSection: React.FC<{
    id: keyof typeof expandedSections;
    title: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
    required?: boolean;
  }> = ({ id, title, children, className = '', icon, required }) => (
    <div className={className + ' border-b last:border-b-0 pb-4 mb-4 last:mb-0 last:pb-0'}>
      <button
        type="button"
        className="flex items-center w-full gap-2 py-2 px-0 group focus:outline-none"
        onClick={() => setExpandedSections(s => ({ ...s, [id]: !s[id] }))}
        aria-expanded={expandedSections[id]}
      >
        {icon}
        <span className="text-md font-semibold text-gray-900 flex-1 text-left">{title}{required && <span className="text-red-500 ml-1">*</span>}</span>
        {expandedSections[id] ? (
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-transform" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-transform" />
        )}
      </button>
      {expandedSections[id] && <div className="pt-2">{children}</div>}
    </div>
  );

  const extractKeywords = (text: string): string[] => {
    const commonSkills = [
      'react', 'javascript', 'typescript', 'python', 'java', 'node.js', 'aws', 'docker',
      'kubernetes', 'sql', 'mongodb', 'postgresql', 'git', 'agile', 'scrum', 'ci/cd',
      'html', 'css', 'vue', 'angular', 'express', 'django', 'flask', 'spring', 'bootstrap',
      'tailwind', 'sass', 'webpack', 'babel', 'jest', 'cypress', 'selenium', 'jenkins',
      'leadership', 'management', 'communication', 'problem solving', 'teamwork', 'azure',
      'gcp', 'terraform', 'ansible', 'redis', 'elasticsearch', 'graphql', 'rest api',
      'microservices', 'devops', 'machine learning', 'data analysis', 'project management'
    ];
    
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    return commonSkills.filter(skill => 
      words.some(word => word.includes(skill) || skill.includes(word))
    );
  };

  const generatePreview = async () => {
    if (!resumeTitle.trim()) return;
    // Always update the professional summary before generating preview
    await handleGenerateSummary();
    setIsGenerating(true);
    
    // Extract keywords from job description
    const jobKeywords = jobDescription ? extractKeywords(jobDescription) : [];
    
    // Find matching skills from tailored skills
    const userSkillNames = skills.map(s => s.name.toLowerCase());
    const matchedSkills = jobKeywords.filter(keyword => 
      userSkillNames.some(skillName => 
        skillName.includes(keyword) || keyword.includes(skillName)
      )
    );
    
    // Prioritize experiences based on skill matches
    const prioritizedExperiences = experiences.map(exp => {
      const expSkillMatches = exp.skills.filter(skill => 
        matchedSkills.some(matched => 
          skill.toLowerCase().includes(matched) || matched.includes(skill.toLowerCase())
        )
      );
      return { ...exp, matchScore: expSkillMatches.length };
    }).sort((a, b) => b.matchScore - a.matchScore);
    
    // Create tailored summary
    const tailoredSummary = personalInfo.summary + 
      (matchedSkills.length > 0 ? ` Experienced in ${matchedSkills.slice(0, 5).join(', ')}.` : '');
    
    // Create tailored resume
    const tailoredResume: TailoredResume = {
      id: crypto.randomUUID(),
      resumeTitle,
      jobTitle,
      company,
      jobDescription,
      createdAt: new Date().toISOString(),
      matchedSkills,
      prioritizedExperiences,
      resumeData: {
        ...resumeData,
        personalInfo: {
          ...personalInfo,
          summary: tailoredSummary
        },
        experiences: prioritizedExperiences,
        education,
        skills
      }
    };
    
    setTimeout(() => {
      setIsGenerating(false);
      setPreviewData(tailoredResume);
    }, 2000);
  };

  const handleSave = () => {
    // If previewData exists, use it. Otherwise, generate a minimal preview on the fly.
    let tailored: TailoredResume;
    if (previewData) {
      tailored = {
        ...previewData,
        resumeData: {
          ...previewData.resumeData,
          personalInfo: {
            ...previewData.resumeData.personalInfo
          }
        }
      };
    } else {
      // Minimal preview logic (same as generatePreview, but synchronous and without loading states)
      const jobKeywords = jobDescription ? extractKeywords(jobDescription) : [];
      const userSkillNames = skills.map(s => s.name.toLowerCase());
      const matchedSkills = jobKeywords.filter(keyword =>
        userSkillNames.some(skillName =>
          skillName.includes(keyword) || keyword.includes(skillName)
        )
      );
      const prioritizedExperiences = experiences.map(exp => {
        const expSkillMatches = exp.skills.filter(skill =>
          matchedSkills.some(matched =>
            skill.toLowerCase().includes(matched) || matched.includes(skill.toLowerCase())
          )
        );
        return { ...exp, matchScore: expSkillMatches.length };
      }).sort((a, b) => b.matchScore - a.matchScore);
      const tailoredSummary = personalInfo.summary +
        (matchedSkills.length > 0 ? ` Experienced in ${matchedSkills.slice(0, 5).join(', ')}.` : '');
      tailored = {
        id: tailoredResume?.id || crypto.randomUUID(),
        resumeTitle,
        jobTitle,
        company,
        jobDescription,
        createdAt: tailoredResume?.createdAt || new Date().toISOString(),
        matchedSkills,
        prioritizedExperiences,
        resumeData: {
          ...resumeData,
          personalInfo: {
            ...personalInfo,
            summary: tailoredSummary
          },
          experiences: prioritizedExperiences,
          education,
          skills
        }
      };
    }
    if (tailoredResume && onUpdateResume) {
      onUpdateResume(tailored);
    } else if (onCreateResume) {
      onCreateResume(tailored);
    }
    onBack();
  };

  const handleGenerate = async () => {
    if (!candidate) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateResumeSections(candidate, jobDescription);
      setAiSections(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate sections.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!jobDescription) return;
    setIsSummaryLoading(true);
    try {
      const generated = await generateProfessionalSummary(jobDescription);
      setSummary(generated);
      setPersonalInfo(prev => ({ ...prev, summary: generated })); // <-- update summary in personal info
    } catch (e) {
      setSummary('Could not generate summary.');
      setPersonalInfo(prev => ({ ...prev, summary: 'Could not generate summary.' }));
    } finally {
      setIsSummaryLoading(false);
    }
  };

  // Update the useEffect that triggers handleGenerateSummary
  useEffect(() => {
    // Only auto-generate summary if this is a new resume (not editing an existing one)
    if (!tailoredResume && jobDescription) {
      handleGenerateSummary();
    } else if (!tailoredResume) {
      setSummary('');
      setPersonalInfo(prev => ({ ...prev, summary: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobDescription, tailoredResume]);

  // Add a useEffect to auto-populate company and job title for new resumes
  useEffect(() => {
    if (!tailoredResume && jobDescription && !company && !jobTitle) {
      (async () => {
        const { company: extractedCompany, jobTitle: extractedJobTitle } = await extractCompanyAndJobTitle(jobDescription);
        if (extractedCompany) setCompany(extractedCompany);
        if (extractedJobTitle) setJobTitle(extractedJobTitle);
        // Also extract tools and skills, considering existing skills
        const existingSkillNames = skills.map(s => s.name);
        const { tools, skills: extractedSkills } = await extractToolsAndSkills(jobDescription, existingSkillNames);
        const allNewSkills = Array.from(new Set([...(tools || []), ...(extractedSkills || [])]));
        // Only add skills that don't already exist
        const newSkillsToAdd = allNewSkills.filter(name => !existingSkillNames.includes(name));
        if (newSkillsToAdd.length > 0) {
          const newSkillObjects = newSkillsToAdd.map(name => ({ 
            name, 
            id: crypto.randomUUID(), 
            category: '', 
            level: 'Intermediate' as Skill['level'] 
          }));
          setSkills([...skills, ...newSkillObjects]);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobDescription, tailoredResume]);

  const isProfileIncomplete = !personalInfo.fullName || !personalInfo.email || experiences.length === 0;

  useEffect(() => {
    const fetchCandidate = async () => {
      setFetchingCandidate(true);
      try {
        const resumeData = await ResumeService.loadResumeData();
        // Map ResumeData to CandidateDetails for Gemini
        const candidateDetails: CandidateDetails = {
          name: resumeData.personalInfo.fullName,
          email: resumeData.personalInfo.email,
          phone: resumeData.personalInfo.phone,
          education: resumeData.education.map(e => `${e.degree} in ${e.field} from ${e.institution} (${e.graduationDate})`).join('; '),
          experience: resumeData.experiences.map(e => `${e.position} at ${e.company} (${e.startDate} - ${e.endDate || 'Present'}): ${e.description}`).join('; '),
          skills: resumeData.skills.map(s => s.name).join(', '),
        };
        setCandidate(candidateDetails);
      } catch (err) {
        setError('Failed to fetch candidate details.');
      } finally {
        setFetchingCandidate(false);
      }
    };
    fetchCandidate();
  }, []);

  useImperativeHandle(saveRef, () => handleSave, [handleSave]);
  useImperativeHandle(exportPdfRef, () => () => {
    const element = document.querySelector('.resume-print-area');
    if (element) {
      html2pdf().set({
        margin: [0.5, 0.5, 0.5, 0.5], // Add some margin for better appearance
        filename: 'resume.pdf',
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true,
          putOnlyUsedFonts: true
        },
        // Use html2pdf renderer for selectable text instead of html2canvas
        html2canvas: false,
        imageTimeout: 0,
        removeContainer: true,
        // Enable better text rendering
        enableLinks: true,
        // Add font embedding for better text support
        fontEmbedding: true
      }).from(element).save();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-red-900 mb-1">Error Saving Resume</h4>
            <p className="text-sm text-red-800">{saveError}</p>
          </div>
          {onDismissError && (
            <button
              onClick={onDismissError}
              className="ml-4 text-sm text-red-700 hover:text-red-900 underline"
            >
              Dismiss
            </button>
          )}
        </div>
      )}
      {/* Header */}
      
      {/* Profile Incomplete Warning */}
      {isProfileIncomplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 mb-1">Profile Incomplete</h4>
              <p className="text-sm text-amber-800 mb-2">
                Please complete your candidate details before creating a tailored resume.
              </p>
              <button
                onClick={onBack}
                className="text-sm text-amber-700 hover:text-amber-900 underline"
              >
                Go to Candidate Details
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Column: Resume Title, Candidate Details, Job Details, Actions */}
        <div className="w-[340px] bg-white border-r border-gray-200 shadow-sm space-y-4 flex-shrink-0 overflow-y-auto fixed left-0 top-[64px] bottom-0 h-[calc(100vh-64px)] p-6">
          {/* Resume Title (always visible, not expandable) */}
           
          {/* Resume Title (always visible, or could be collapsible if desired) */}
          <ExpandableSection
            id="personal"
            title="Personal Information"
            
            required
          >
            <PersonalInfoForm data={personalInfo} onChange={setPersonalInfo} />
          </ExpandableSection>
          <ExpandableSection
            id="education"
            title="Education"
            
          >
            <EducationForm education={education} onChange={setEducation} />
          </ExpandableSection>
          <ExpandableSection
            id="experience"
            title="Work Experience"
           
          >
            <ExperienceForm experiences={experiences} onChange={setExperiences} />
          </ExpandableSection>
          <ExpandableSection
            id="skills"
            title="Skills & Technologies"
            
          >
            <SkillsForm skills={skills} onChange={setSkills} />
          </ExpandableSection>
          <ExpandableSection
            id="job"
            title={<span>Job Details <span className='text-xs text-gray-400'>(Optional)</span></span>}
            
          >
            <JobDetailsForm
              jobTitle={jobTitle}
              company={company}
              jobDescription={jobDescription}
              onJobTitleChange={setJobTitle}
              onCompanyChange={setCompany}
              onJobDescriptionChange={setJobDescription}
              jobDescEdited={jobDescEdited}
              setJobDescEdited={setJobDescEdited}
            />
          </ExpandableSection>
          {/* Actions (Generate Preview, etc.) remain outside sections */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={generatePreview}
              disabled={!resumeTitle.trim() || isGenerating || isProfileIncomplete || !jobDescEdited}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                   Regenerate
                </>
              )}
            </button>
            {/* 
            <button onClick={handleGenerate} disabled={loading || !candidate} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" />
                  Sections
                </>
              )}
            </button> */}
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Error</h4>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          {aiSections && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">AI-Generated Resume Sections</h4>
                  <pre className="text-sm text-green-800 whitespace-pre-wrap break-words">
                    {aiSections}
                  </pre>
                </div>
              </div>
            </div>
          )}
          {/* {(summary || isSummaryLoading) && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
              {isSummaryLoading ? (
                <p className="text-gray-500 italic">Generating summary...</p>
              ) : (
                <p className="text-gray-800 whitespace-pre-line">{summary}</p>
              )}
            </div>
          )} */}
        </div>
        {/* Right Column: Resume Preview */}
        <div className="flex-1 min-w-0 max-w-[900px] ml-[340px] flex items-start justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 h-[calc(100vh-64px)] overflow-auto">
          <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-lg p-8 mt-0 mb-8 flex items-center justify-center min-h-[80vh]">
            {fetchingCandidate ? (
              <div className="flex items-center justify-center h-full w-full">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-lg text-gray-600">Loading candidate details...</span>
              </div>
            ) : (
              <ResumePreview
                resumeData={{
                  ...resumeData,
                  personalInfo,
                  education,
                  experiences,
                  skills
                }}
                jobTitle={jobTitle}
                company={company}
                matchedSkills={previewData?.matchedSkills || []}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
