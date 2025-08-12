import React from 'react';
import { ResumeData } from '../types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export type ResumeTemplate = 'modern' | 'classic' | 'minimal' | 'professional';

interface ResumePreviewProps {
  resumeData: ResumeData;
  jobTitle?: string;
  company?: string;
  matchedSkills?: string[];
  template?: ResumeTemplate;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ 
  resumeData, 
  jobTitle, 
  company, 
  matchedSkills = [],
  template = 'modern'
}) => {
  const { personalInfo, experiences, education, skills, certifications, languages } = resumeData;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getSkillsByCategory = () => {
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof skills>);
  };

  const groupedSkills = getSkillsByCategory();

  const renderTemplate = () => {
    switch (template) {
      case 'classic':
        return <ClassicTemplate />;
      case 'minimal':
        return <MinimalTemplate />;
      case 'professional':
        return <ProfessionalTemplate />;
      default:
        return <ModernTemplate />;
    }
  };

  // Modern Template (Current default)
  const ModernTemplate = () => (
    <>
      <style>{`
        .resume-print-area * {
          font-family: 'Satoshi', sans-serif !important;
        }
      `}</style>
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{personalInfo.fullName}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-600">
            {personalInfo.email}
          </a>
          <span className="text-gray-400">|</span>
          <span>{personalInfo.phone}</span>
          <span className="text-gray-400">|</span>
          <span>{personalInfo.location}</span>
          {personalInfo.portfolio && (
            <>
              <span className="text-gray-400">|</span>
              <a href={personalInfo.portfolio} className="hover:text-blue-600" target="_blank" rel="noopener noreferrer">
                {personalInfo.portfolio}
              </a>
            </>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Experience</h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={exp.id} className={index > 0 ? 'border-t border-gray-100 pt-6' : ''}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                    {exp.location && (
                      <p className="text-sm text-gray-500">{exp.location}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                </div>
                
                {exp.description && (
                  <p className="text-gray-700 mb-3">{exp.description}</p>
                )}
                
                {exp.achievements.filter(a => a.trim()).length > 0 && (
                  <ul className="space-y-1 mb-3">
                    {exp.achievements.filter(a => a.trim()).map((achievement, i) => (
                      <li key={i} className="text-gray-700 text-sm flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {exp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {exp.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          matchedSkills.includes(skill.toLowerCase()) 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Education</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                    <p className="text-blue-600 font-medium">{edu.institution}</p>
                    {edu.location && (
                      <p className="text-sm text-gray-500">{edu.location}</p>
                    )}
                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                    {edu.honors && <p className="text-sm text-gray-600">{edu.honors}</p>}
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(edu.graduationDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills & Technologies</h2>
          <div className="space-y-3">
            {/* Skills Section */}
            {(() => {
              const skillItems = skills.filter(s => s.category === 'skill' || !s.category);
              if (skillItems.length > 0) {
                return (
                  <div>
                    <h4 className="font-medium text-gray-700 text-sm mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillItems.map((skill) => (
                        <span 
                          key={skill.id} 
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            matchedSkills.includes(skill.name.toLowerCase()) 
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}
            
            {/* Technologies Section */}
            {(() => {
              const techItems = skills.filter(s => s.category === 'technology');
              if (techItems.length > 0) {
                return (
                  <div>
                    <h4 className="font-medium text-gray-700 text-sm mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {techItems.map((skill) => (
                        <span 
                          key={skill.id} 
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            matchedSkills.includes(skill.name.toLowerCase()) 
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h2>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-blue-600 font-medium">{cert.issuer}</p>
                  {cert.credentialId && <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>}
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Issued: {formatDate(cert.date)}</p>
                  {cert.expiryDate && <p>Expires: {formatDate(cert.expiryDate)}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Languages</h2>
          <div className="flex flex-wrap gap-3">
            {languages.map((lang) => (
              <div key={lang.id} className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{lang.name}</span>
                <span className="text-sm text-gray-600">({lang.proficiency})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  // Classic Template (Teal accent with different layout)
  const ClassicTemplate = () => (
    <>
      <style>{`
        .resume-print-area * {
          font-family: 'Satoshi', sans-serif !important;
        }
        .classic-header {
          background: linear-gradient(90deg, #0f766e 0%, #14b8a6 100%);
          color: white;
          padding: 24px 32px;
          margin: -32px -32px 24px -32px;
        }
        .classic-section {
          border-left: 4px solid #0f766e;
          padding-left: 16px;
          margin-bottom: 24px;
        }
      `}</style>
      
      {/* Header with teal background */}
      <div className="classic-header">
        <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName}</h1>
        <p className="text-xl font-medium mb-3">{jobTitle || 'Professional'}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <span>{personalInfo.location}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <a href={`mailto:${personalInfo.email}`} className="hover:underline">
            {personalInfo.email}
          </a>
          {personalInfo.portfolio && (
            <>
              <span>•</span>
              <a href={personalInfo.portfolio} className="hover:underline" target="_blank" rel="noopener noreferrer">
                Portfolio
              </a>
            </>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <div className="classic-section">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="classic-section">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Work Experience</h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={exp.id} className={index > 0 ? 'border-t border-gray-200 pt-6' : ''}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-teal-600 font-semibold">{exp.company}</p>
                    {exp.location && (
                      <p className="text-sm text-gray-500">{exp.location}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                </div>
                
                {exp.description && (
                  <p className="text-gray-700 mb-3">{exp.description}</p>
                )}
                
                {exp.achievements.filter(a => a.trim()).length > 0 && (
                  <ul className="space-y-1 mb-3">
                    {exp.achievements.filter(a => a.trim()).map((achievement, i) => (
                      <li key={i} className="text-gray-700 text-sm flex items-start">
                        <span className="text-teal-600 mr-2 font-bold">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {exp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {exp.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          matchedSkills.includes(skill.toLowerCase()) 
                            ? 'bg-teal-100 text-teal-700 border border-teal-200' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="classic-section">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Education</h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={edu.id} className={index > 0 ? 'border-t border-gray-200 pt-4' : ''}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-teal-600 font-semibold">{edu.institution}</p>
                    {edu.location && (
                      <p className="text-sm text-gray-500">{edu.location}</p>
                    )}
                  </div>
                                     <p className="text-sm text-gray-500 font-medium">
                     {formatDate(edu.graduationDate)}
                   </p>
                 </div>
                 {edu.gpa && (
                   <p className="text-gray-700 text-sm mt-1">GPA: {edu.gpa}</p>
                 )}
                 {edu.honors && (
                   <p className="text-gray-700 text-sm mt-1">{edu.honors}</p>
                 )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="classic-section">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Skills & Technologies</h2>
          <div className="space-y-4">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill, i) => (
                    <span 
                      key={i} 
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        matchedSkills.includes(skill.name.toLowerCase()) 
                          ? 'bg-teal-100 text-teal-700 border border-teal-200' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="classic-section">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Licenses & Certifications</h2>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="border-l-4 border-teal-500 pl-4">
                <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                <p className="text-teal-600 font-semibold">{cert.issuer}</p>
                <p className="text-sm text-gray-500">
                  {cert.date} {cert.expiryDate && `- ${cert.expiryDate}`}
                  {cert.credentialId && ` • ID: ${cert.credentialId}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className="classic-section">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Languages</h2>
          <div className="flex flex-wrap gap-4">
            {languages.map((lang) => (
              <div key={lang.id} className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{lang.name}</span>
                <span className="text-sm text-gray-500">({lang.proficiency})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  // Minimal Template (Clean and simple)
  const MinimalTemplate = () => (
    <>
      <style>{`
        .resume-print-area * {
          font-family: 'Satoshi', sans-serif !important;
        }
        .minimal-section {
          margin-bottom: 32px;
        }
        .minimal-header {
          text-align: center;
          margin-bottom: 40px;
        }
      `}</style>
      
      {/* Centered Header */}
      <div className="minimal-header">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{personalInfo.fullName}</h1>
        <p className="text-xl text-gray-600 mb-3">{jobTitle || 'Professional'}</p>
        <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-500">
          <span>{personalInfo.location}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <a href={`mailto:${personalInfo.email}`} className="hover:text-gray-700">
            {personalInfo.email}
          </a>
          {personalInfo.portfolio && (
            <>
              <span>•</span>
              <a href={personalInfo.portfolio} className="hover:text-gray-700" target="_blank" rel="noopener noreferrer">
                Portfolio
              </a>
            </>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <div className="minimal-section">
          <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="minimal-section">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center uppercase tracking-wider">Work Experience</h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={exp.id} className={index > 0 ? 'border-t border-gray-200 pt-8' : ''}>
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.position}</h3>
                  <p className="text-lg text-gray-600 mb-1">{exp.company}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                  {exp.location && (
                    <p className="text-sm text-gray-500">{exp.location}</p>
                  )}
                </div>
                
                {exp.description && (
                  <p className="text-gray-700 mb-4 text-center">{exp.description}</p>
                )}
                
                {exp.achievements.filter(a => a.trim()).length > 0 && (
                  <ul className="space-y-2 max-w-2xl mx-auto">
                    {exp.achievements.filter(a => a.trim()).map((achievement, i) => (
                      <li key={i} className="text-gray-700 text-sm text-center">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
                
                {exp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {exp.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          matchedSkills.includes(skill.toLowerCase()) 
                            ? 'bg-gray-200 text-gray-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="minimal-section">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center uppercase tracking-wider">Education</h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={edu.id} className={index > 0 ? 'border-t border-gray-200 pt-6' : ''}>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{edu.degree}</h3>
                  <p className="text-lg text-gray-600 mb-1">{edu.institution}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(edu.graduationDate)}
                  </p>
                  {edu.location && (
                    <p className="text-sm text-gray-500">{edu.location}</p>
                  )}
                </div>
                {edu.gpa && (
                  <p className="text-gray-700 text-sm mt-2 text-center">GPA: {edu.gpa}</p>
                )}
                {edu.honors && (
                  <p className="text-gray-700 text-sm mt-2 text-center">{edu.honors}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="minimal-section">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center uppercase tracking-wider">Skills & Technologies</h2>
          <div className="space-y-6">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {categorySkills.map((skill, i) => (
                    <span 
                      key={i} 
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        matchedSkills.includes(skill.name.toLowerCase()) 
                          ? 'bg-gray-200 text-gray-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="minimal-section">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center uppercase tracking-wider">Licenses & Certifications</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {certifications.map((cert) => (
              <div key={cert.id} className="text-center">
                <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                <p className="text-gray-600">{cert.issuer}</p>
                <p className="text-sm text-gray-500">
                  {cert.date} {cert.expiryDate && `- ${cert.expiryDate}`}
                  {cert.credentialId && ` • ID: ${cert.credentialId}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className="minimal-section">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center uppercase tracking-wider">Languages</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {languages.map((lang) => (
              <div key={lang.id} className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{lang.name}</span>
                <span className="text-sm text-gray-500">({lang.proficiency})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  // Professional Template (Two-column layout)
  const ProfessionalTemplate = () => (
    <>
      <style>{`
        .resume-print-area * {
          font-family: 'Satoshi', sans-serif !important;
        }
        .professional-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 32px;
        }
        .sidebar {
          background-color: #f8fafc;
          padding: 24px;
          border-radius: 8px;
        }
        .main-content {
          padding-left: 0;
        }
      `}</style>
      
      {/* Header */}
      <div className="border-b-4 border-blue-600 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{personalInfo.fullName}</h1>
        <p className="text-xl text-blue-600 font-semibold mb-3">{jobTitle || 'Professional'}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>{personalInfo.location}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-600">
            {personalInfo.email}
          </a>
          {personalInfo.portfolio && (
            <>
              <span>•</span>
              <a href={personalInfo.portfolio} className="hover:text-blue-600" target="_blank" rel="noopener noreferrer">
                Portfolio
              </a>
            </>
          )}
        </div>
      </div>

      <div className="professional-grid">
        {/* Sidebar */}
        <div className="sidebar">
          {/* Professional Summary */}
          {personalInfo.summary && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Summary</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Skills</h2>
              <div className="space-y-3">
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-1">
                      {categorySkills.map((skill, i) => (
                        <span 
                          key={i} 
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            matchedSkills.includes(skill.name.toLowerCase()) 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Education</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-semibold text-gray-900 text-sm">{edu.degree}</h3>
                    <p className="text-blue-600 text-sm font-medium">{edu.institution}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(edu.graduationDate)}
                    </p>
                    {edu.gpa && (
                      <p className="text-gray-600 text-xs mt-1">GPA: {edu.gpa}</p>
                    )}
                    {edu.honors && (
                      <p className="text-gray-600 text-xs mt-1">{edu.honors}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Certifications</h2>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <h3 className="font-semibold text-gray-900 text-sm">{cert.name}</h3>
                    <p className="text-blue-600 text-sm font-medium">{cert.issuer}</p>
                    <p className="text-xs text-gray-500">
                      {cert.date} {cert.expiryDate && `- ${cert.expiryDate}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Languages</h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id}>
                    <span className="font-semibold text-gray-900 text-sm">{lang.name}</span>
                    <span className="text-xs text-gray-500 ml-1">({lang.proficiency})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Experience */}
          {experiences.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide">Professional Experience</h2>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className={index > 0 ? 'border-t border-gray-200 pt-6' : ''}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                        <p className="text-blue-600 font-semibold">{exp.company}</p>
                        {exp.location && (
                          <p className="text-sm text-gray-500">{exp.location}</p>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 font-medium">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </p>
                    </div>
                    
                    {exp.description && (
                      <p className="text-gray-700 mb-3">{exp.description}</p>
                    )}
                    
                    {exp.achievements.filter(a => a.trim()).length > 0 && (
                      <ul className="space-y-1 mb-3">
                        {exp.achievements.filter(a => a.trim()).map((achievement, i) => (
                          <li key={i} className="text-gray-700 text-sm flex items-start">
                            <span className="text-blue-600 mr-2 font-bold">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {exp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {exp.skills.map((skill, i) => (
                          <span 
                            key={i} 
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              matchedSkills.includes(skill.toLowerCase()) 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex justify-center items-start w-full h-full">
      <div
        className="resume-print-area bg-white"
        style={{
          width: '210mm',
          minHeight: '297mm',
          maxWidth: '100%',
          fontFamily: 'Satoshi, sans-serif',
          boxShadow: '0 0 0 #000',
          margin: 0,
          padding: '32px',
          overflow: 'visible',
          borderRadius: 0,
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};