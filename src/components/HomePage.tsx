import React, { FC, useState } from 'react';
import { TailoredResume } from '../types/resume';
import { Plus, FileText, Calendar, Building, User, Trash2, MoreVertical, Edit3, BarChart3 } from 'lucide-react';

interface HomePageProps {
  tailoredResumes: TailoredResume[];
  onCreateResume: () => void;
  onEditCandidateDetails: () => void;
  onViewResume: (resume: TailoredResume) => void;
  onDeleteResume: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  tailoredResumes,
  onCreateResume,
  onEditCandidateDetails,
  onViewResume,
  onDeleteResume
}) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Quick actions</h1>
         
        </div>
        <div className="flex gap-3">
          {/* Buttons can go here */}
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Number of Resumes Card */}
  <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition-shadow">
    <div className="flex items-start gap-4">
      {/* Icon */}
      <div className="min-w-12 min-h-12 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
        <BarChart3 className="w-6 h-6 text-blue-600" />
      </div>
      {/* Text */}
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-0">Number of Resumes</h3>
        <p className="text-sm text-gray-600">
          You've created {tailoredResumes.length} resume{tailoredResumes.length !== 1 ? 's' : ''} so far.
        </p>
      </div>
    </div>
  </div>

  {/* Edit Your Details Card */}
  <div 
    className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition-shadow cursor-pointer hover:border-gray-300"
    onClick={onEditCandidateDetails}
  >
    <div className="flex items-start gap-4">
      {/* Icon */}
      <div className="min-w-12 min-h-12 w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
        <User className="w-6 h-6 text-green-600" />
      </div>
      {/* Text */}
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-0">Edit Your Details</h3>
        <p className="text-sm text-gray-600">
        Keep your information up to date.
        </p>
      </div>
    </div>
  </div>

  {/* Create a New Resume Card */}
  <div 
    className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition-shadow cursor-pointer hover:border-gray-300"
    onClick={onCreateResume}
  >
    <div className="flex items-start gap-4">
      {/* Icon */}
      <div className="min-w-12 min-h-12 w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
        <FileText className="w-6 h-6 text-purple-600" />
      </div>
      {/* Text */}
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-0">Create a New Resume</h3>
        <p className="text-sm text-gray-600">
        Generate a tailored resume for any job.
        </p>
      </div>
    </div>
  </div>
</div>


 {/* Header */}
 <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Resumes</h1>
          {/* <p className="text-gray-600 mt-1">Manage tailored resumes for different job applications</p> */}
        </div>
        <div className="flex gap-3">
          {/* Buttons can go here */}
        </div>
      </div>
      {/* Resume List */}
      {tailoredResumes.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resume copies yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create your first tailored resume by clicking the "Create Resume" button above. 
            You can customize it for specific job applications.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onEditCandidateDetails}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4" />
              Set Up Profile First
            </button>
            <button
              onClick={onCreateResume}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create First Resume
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {tailoredResumes.map((resume) => (
            <CardWithMenu
              key={resume.id}
              resume={resume}
              onViewResume={onViewResume}
              onDeleteResume={onDeleteResume}
            />
          ))}
        </div>
      )}
    </div>
  );
};

type CardWithMenuProps = {
  resume: TailoredResume;
  onViewResume: (resume: TailoredResume) => void;
  onDeleteResume: (id: string) => void;
};

const CardWithMenu: FC<CardWithMenuProps> = ({ resume, onViewResume, onDeleteResume }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleMenuToggle = () => {
    setMenuOpen((open) => !open);
    // Reset delete confirmation when menu opens/closes
    setShowDeleteConfirmation(false);
  };

  const handleDeleteClick = () => {
    if (showDeleteConfirmation) {
      // Second click - actually delete
      setMenuOpen(false);
      setShowDeleteConfirmation(false);
      onDeleteResume(resume.id);
    } else {
      // First click - show confirmation
      setShowDeleteConfirmation(true);
    }
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl px-5 pt-4 pb-3 hover:shadow-xs transition-shadow relative cursor-pointer"
      onClick={() => onViewResume(resume)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              {/* Resume title */}
              <div className="text-md font-bold text-blue-900 mb-2 truncate">
                {resume.resumeTitle || resume.jobTitle}
              </div>

              {/* Insights - unified dark gray */}
              <div className="flex items-center gap-4 flex-wrap text-sm text-gray-700 mb-2">
                {resume.company && (
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4 text-gray-700" />
                    <span className="">{resume.company}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-700" />
                  <span>
                    {new Date(resume.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span>{resume.matchedSkills.length} skills matched</span>
                </div> */}
              </div>

              {/* Skill tags */}
              
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex items-center gap-2 ml-4 relative">
          <div className="relative" onClick={handleMenuClick}>
            <button
              onClick={handleMenuToggle}
              className="flex items-center justify-center w-6 h-6 rounded-lg hover:bg-gray-100"
              aria-label="More actions"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full text-left rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  {showDeleteConfirmation ? 'Really delete?' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
