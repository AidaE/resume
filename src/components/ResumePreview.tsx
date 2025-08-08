import React from 'react';
import { ResumeData } from '../types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface ResumePreviewProps {
  resumeData: ResumeData;
  jobTitle?: string;
  company?: string;
  matchedSkills?: string[];
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ 
  resumeData, 
  jobTitle, 
  company, 
  matchedSkills = [] 
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
        <style>{`
          .resume-print-area * {
            font-family: 'Satoshi', sans-serif !important;
          }
        `}</style>
        {/* Header */}
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{personalInfo.fullName}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-600">
                {personalInfo.email}
              </a>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{personalInfo.phone}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{personalInfo.location}</span>
            </div>
            {personalInfo.portfolio && (
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <a href={personalInfo.portfolio} className="hover:text-blue-600" target="_blank" rel="noopener noreferrer">
                  {personalInfo.portfolio}
                </a>
              </div>
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
      </div>
      {/* No export button in visual preview */}
    </div>
  );
};