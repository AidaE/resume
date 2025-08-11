import React from 'react';
import { PersonalInfoForm } from './PersonalInfoForm';
import { ExperienceForm } from './ExperienceForm';
import { SkillsForm } from './SkillsForm';
import { EducationForm } from './EducationForm';
import { CertificationsForm } from './CertificationsForm';
import { LanguagesForm } from './LanguagesForm';
import { ResumeData, PersonalInfo, Experience, Skill, Education, Certification, Language } from '../types/resume';
import { ArrowLeft, User, Briefcase, Code, GraduationCap, Award, Languages } from 'lucide-react';

interface CandidateDetailsPageProps {
  resumeData: ResumeData;
  onPersonalInfoChange: (personalInfo: PersonalInfo) => void;
  onExperiencesChange: (experiences: Experience[]) => void;
  onEducationChange: (education: Education[]) => void;
  onSkillsChange: (skills: Skill[]) => void;
  onCertificationsChange: (certifications: Certification[]) => void;
  onLanguagesChange: (languages: Language[]) => void;
  onBack: () => void;
  onSave: () => void; // Added onSave prop
}

export const CandidateDetailsPage: React.FC<CandidateDetailsPageProps> = ({
  resumeData,
  onPersonalInfoChange,
  onExperiencesChange,
  onEducationChange,
  onSkillsChange,
  onCertificationsChange,
  onLanguagesChange,
  onBack,
  onSave
}) => {
  const [activeSection, setActiveSection] = React.useState<'personal' | 'experience' | 'education' | 'skills' | 'certifications' | 'languages'>('personal');

  const sections = [
    { id: 'personal' as const, label: 'Personal Info', icon: User },
    { id: 'experience' as const, label: 'Experience', icon: Briefcase },
    { id: 'education' as const, label: 'Education', icon: GraduationCap },
    { id: 'skills' as const, label: 'Skills', icon: Code },
    { id: 'certifications' as const, label: 'Licenses & Certifications', icon: Award },
    { id: 'languages' as const, label: 'Languages', icon: Languages },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      

      <div className="flex gap-6">
        {/* Section Navigation */}
        <div className="w-64 bg-white rounded-lg border border-gray-200 p-1 h-fit shadow-sm">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </nav>

         
        </div>

        {/* Form Content */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          {activeSection === 'personal' && (
            <PersonalInfoForm
              data={resumeData.personalInfo}
              onChange={onPersonalInfoChange}
            />
          )}
          
          {activeSection === 'experience' && (
            <ExperienceForm
              experiences={resumeData.experiences}
              onChange={onExperiencesChange}
            />
          )}
          
          {activeSection === 'education' && (
            <EducationForm
              education={resumeData.education}
              onChange={onEducationChange}
            />
          )}
          
          {activeSection === 'skills' && (
            <SkillsForm
              skills={resumeData.skills}
              onChange={onSkillsChange}
            />
          )}

          {activeSection === 'certifications' && (
            <CertificationsForm
              certifications={resumeData.certifications}
              onChange={onCertificationsChange}
            />
          )}

          {activeSection === 'languages' && (
            <LanguagesForm
              languages={resumeData.languages}
              onChange={onLanguagesChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};