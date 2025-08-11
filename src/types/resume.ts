export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  portfolio?: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  skills: string[];
  location: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
  location: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Elementary' | 'Limited Working' | 'Professional Working' | 'Full Professional' | 'Native';
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
}

export interface TailoredResume {
  id: string;
  resumeTitle?: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  createdAt: string;
  resumeData: ResumeData;
  matchedSkills: string[];
  prioritizedExperiences: Experience[];
}