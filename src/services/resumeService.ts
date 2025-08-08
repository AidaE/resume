import { supabase } from '../lib/supabase';
import { ResumeData, TailoredResume, PersonalInfo, Experience, Education, Skill, Certification, Language } from '../types/resume';

export class ResumeService {
  private static candidateId: string | null = null;

  // Utility method to validate user authentication
  private static async validateUser(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated. Please sign in to continue.');
    }
    return user.id;
  }

  static async ensureCandidate(): Promise<string> {
    await this.validateUser();
    
    if (this.candidateId) return this.candidateId;

    // Use upsert to handle race conditions
    const { data: candidate, error } = await supabase
      .from('candidates')
      .upsert(
        { user_id: (await this.validateUser()) },
        { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        }
      )
      .select('id')
      .single();

    if (error) {
      console.error('Error ensuring candidate:', error);
      throw new Error('Failed to create or retrieve candidate profile');
    }

    if (!candidate?.id || typeof candidate.id !== 'string') {
      throw new Error('Invalid candidate id returned from database');
    }

    this.candidateId = candidate.id;
    return this.candidateId;
  }

  static async loadResumeData(): Promise<ResumeData> {
    const candidateId = await this.ensureCandidate();

    // Load all data in parallel
    const [
      candidateResult,
      experiencesResult,
      skillsResult,
      educationResult,
      certificationsResult,
      languagesResult
    ] = await Promise.all([
      supabase.from('candidates').select('*').eq('id', candidateId).single(),
      supabase.from('experiences').select('*').eq('candidate_id', candidateId).order('start_date', { ascending: false }),
      supabase.from('skills').select('*').eq('candidate_id', candidateId).order('category'),
      supabase.from('education').select('*').eq('candidate_id', candidateId).order('graduation_date', { ascending: false }),
      supabase.from('certifications').select('*').eq('candidate_id', candidateId).order('date', { ascending: false }),
      supabase.from('languages').select('*').eq('candidate_id', candidateId).order('name')
    ]);

    const candidate = candidateResult.data;
    console.log('DEBUG candidateResult.data:', candidate); // Debug log
    if (!candidate) throw new Error('Candidate not found');

    const personalInfo: PersonalInfo = {
      fullName: candidate.full_name,
      email: candidate.email,
      phone: candidate.phone,
      location: candidate.location,
      portfolio: candidate.portfolio || '',
      summary: candidate.summary
    };

    const experiences: Experience[] = (experiencesResult.data || []).map(exp => ({
      id: exp.id,
      company: exp.company,
      position: exp.position,
      startDate: exp.start_date,
      endDate: exp.end_date || '',
      current: exp.current,
      description: exp.description || '',
      achievements: exp.achievements || [],
      skills: exp.skills || []
    }));

    const skills: Skill[] = (skillsResult.data || []).map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      level: skill.level as Skill['level']
    }));

    const education: Education[] = (educationResult.data || []).map(edu => ({
      id: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      graduationDate: edu.graduation_date,
      gpa: edu.gpa || '',
      honors: edu.honors || ''
    }));

    const certifications: Certification[] = (certificationsResult.data || []).map(cert => ({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
      expiryDate: cert.expiry_date || '',
      credentialId: cert.credential_id || ''
    }));

    const languages: Language[] = (languagesResult.data || []).map(lang => ({
      id: lang.id,
      name: lang.name,
      proficiency: lang.proficiency as Language['proficiency']
    }));

    return {
      personalInfo,
      experiences,
      education,
      skills,
      certifications,
      languages
    };
  }

  static async savePersonalInfo(personalInfo: PersonalInfo): Promise<void> {
    const candidateId = await this.ensureCandidate();
    console.log('DEBUG savePersonalInfo candidateId:', candidateId);
    console.log('DEBUG savePersonalInfo data:', personalInfo);

    const { error } = await supabase
      .from('candidates')
      .update({
        full_name: personalInfo.fullName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        location: personalInfo.location,
        portfolio: personalInfo.portfolio || null,
        summary: personalInfo.summary
      })
      .eq('id', candidateId);

    if (error) {
      console.error('DEBUG savePersonalInfo error:', error);
      throw error;
    }
  }

  static async saveExperiences(experiences: Experience[]): Promise<void> {
    const candidateId = await this.ensureCandidate();

    // Delete existing experiences
    await supabase.from('experiences').delete().eq('candidate_id', candidateId);

    if (experiences.length === 0) return;

    // Insert new experiences
    const { error } = await supabase
      .from('experiences')
      .insert(experiences.map(exp => ({
        id: exp.id,
        candidate_id: candidateId,
        company: exp.company,
        position: exp.position,
        start_date: exp.startDate,
        end_date: exp.endDate || null,
        current: exp.current,
        description: exp.description,
        achievements: exp.achievements,
        skills: exp.skills
      })));

    if (error) {
      console.error('DEBUG saveExperiences error:', error);
      throw error;
    }
  }

  static async saveSkills(skills: Skill[]): Promise<void> {
    const candidateId = await this.ensureCandidate();

    // Delete existing skills
    await supabase.from('skills').delete().eq('candidate_id', candidateId);

    if (skills.length === 0) return;

    // Insert new skills
    const { error } = await supabase
      .from('skills')
      .insert(skills.map(skill => ({
        id: skill.id,
        candidate_id: candidateId,
        name: skill.name,
        category: skill.category,
        level: skill.level
      })));

    if (error) {
      console.error('DEBUG saveSkills error:', error);
      throw error;
    }
  }

  static async saveEducation(education: Education[]): Promise<void> {
    const candidateId = await this.ensureCandidate();

    // Delete existing education
    await supabase.from('education').delete().eq('candidate_id', candidateId);

    if (education.length === 0) return;

    // Insert new education
    const { error } = await supabase
      .from('education')
      .insert(education.map(edu => ({
        id: edu.id,
        candidate_id: candidateId,
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        graduation_date: edu.graduationDate,
        gpa: edu.gpa || null,
        honors: edu.honors || null
      })));

    if (error) {
      console.error('DEBUG saveEducation error:', error);
      throw error;
    }
  }

  static async saveCertifications(certifications: Certification[]): Promise<void> {
    const candidateId = await this.ensureCandidate();

    // Delete existing certifications
    await supabase.from('certifications').delete().eq('candidate_id', candidateId);

    if (certifications.length === 0) return;

    // Insert new certifications
    const { error } = await supabase
      .from('certifications')
      .insert(certifications.map(cert => ({
        id: cert.id,
        candidate_id: candidateId,
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date,
        expiry_date: cert.expiryDate || null,
        credential_id: cert.credentialId || null
      })));

    if (error) {
      console.error('DEBUG saveCertifications error:', error);
      throw error;
    }
  }

  static async saveLanguages(languages: Language[]): Promise<void> {
    const candidateId = await this.ensureCandidate();

    // Delete existing languages
    await supabase.from('languages').delete().eq('candidate_id', candidateId);

    if (languages.length === 0) return;

    // Insert new languages
    const { error } = await supabase
      .from('languages')
      .insert(languages.map(lang => ({
        id: lang.id,
        candidate_id: candidateId,
        name: lang.name,
        proficiency: lang.proficiency
      })));

    if (error) {
      console.error('DEBUG saveLanguages error:', error);
      throw error;
    }
  }

  static async saveResumeData(resumeData: ResumeData): Promise<void> {
    await this.savePersonalInfo(resumeData.personalInfo);
    await this.saveExperiences(resumeData.experiences);
    await this.saveEducation(resumeData.education);
    await this.saveSkills(resumeData.skills);
    await this.saveCertifications(resumeData.certifications);
    await this.saveLanguages(resumeData.languages);
  }

  static async loadTailoredResumes(): Promise<TailoredResume[]> {
    const candidateId = await this.ensureCandidate();

    const { data, error } = await supabase
      .from('tailored_resumes')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const resumeData = await this.loadResumeData();

    return (data || []).map(resume => ({
      id: resume.id,
      resumeTitle: resume.resume_title || '',
      jobTitle: resume.job_title,
      company: resume.company || '',
      jobDescription: resume.job_description,
      createdAt: resume.created_at,
      matchedSkills: resume.matched_skills || [],
      prioritizedExperiences: resumeData.experiences,
      resumeData
    }));
  }

  static async saveTailoredResume(tailoredResume: Omit<TailoredResume, 'resumeData'>): Promise<void> {
    const candidateId = await this.ensureCandidate();

    const { error } = await supabase
      .from('tailored_resumes')
      .upsert({
        id: tailoredResume.id,
        candidate_id: candidateId,
        resume_title: tailoredResume.resumeTitle || '',
        job_title: tailoredResume.jobTitle || '',
        company: tailoredResume.company || null,
        job_description: tailoredResume.jobDescription || '',
        matched_skills: tailoredResume.matchedSkills
      }, { onConflict: 'id' });

    if (error) throw error;
  }

  static async deleteTailoredResume(id: string): Promise<void> {
    const { error } = await supabase
      .from('tailored_resumes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Clear cached candidate ID when user signs out
  static clearCache(): void {
    this.candidateId = null;
  }
}