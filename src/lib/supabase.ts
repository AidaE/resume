import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      candidates: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          email: string;
          phone: string;
          location: string;
          linkedin: string | null;
          portfolio: string | null;
          summary: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string;
          email?: string;
          phone?: string;
          location?: string;
          linkedin?: string | null;
          portfolio?: string | null;
          summary?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          location?: string;
          linkedin?: string | null;
          portfolio?: string | null;
          summary?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      experiences: {
        Row: {
          id: string;
          candidate_id: string;
          company: string;
          position: string;
          start_date: string;
          end_date: string | null;
          current: boolean;
          description: string | null;
          achievements: string[];
          skills: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          company?: string;
          position?: string;
          start_date?: string;
          end_date?: string | null;
          current?: boolean;
          description?: string | null;
          achievements?: string[];
          skills?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          company?: string;
          position?: string;
          start_date?: string;
          end_date?: string | null;
          current?: boolean;
          description?: string | null;
          achievements?: string[];
          skills?: string[];
          created_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          candidate_id: string;
          name: string;
          category: string;
          level: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          name: string;
          category?: string;
          level?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          name?: string;
          category?: string;
          level?: string;
          created_at?: string;
        };
      };
      education: {
        Row: {
          id: string;
          candidate_id: string;
          institution: string;
          degree: string;
          field: string;
          graduation_date: string;
          gpa: string | null;
          honors: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          institution: string;
          degree: string;
          field: string;
          graduation_date: string;
          gpa?: string | null;
          honors?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          institution?: string;
          degree?: string;
          field?: string;
          graduation_date?: string;
          gpa?: string | null;
          honors?: string | null;
          created_at?: string;
        };
      };
      certifications: {
        Row: {
          id: string;
          candidate_id: string;
          name: string;
          issuer: string;
          date: string;
          expiry_date: string | null;
          credential_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          name: string;
          issuer: string;
          date: string;
          expiry_date?: string | null;
          credential_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          name?: string;
          issuer?: string;
          date?: string;
          expiry_date?: string | null;
          credential_id?: string | null;
          created_at?: string;
        };
      };
      languages: {
        Row: {
          id: string;
          candidate_id: string;
          name: string;
          proficiency: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          name: string;
          proficiency?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          name?: string;
          proficiency?: string;
          created_at?: string;
        };
      };
      tailored_resumes: {
        Row: {
          id: string;
          candidate_id: string;
          job_title: string;
          company: string | null;
          job_description: string;
          matched_skills: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          job_title: string;
          company?: string | null;
          job_description: string;
          matched_skills?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          job_title?: string;
          company?: string | null;
          job_description?: string;
          matched_skills?: string[];
          created_at?: string;
        };
      };
    };
  };
};