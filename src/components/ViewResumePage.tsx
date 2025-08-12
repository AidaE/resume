import React from 'react';
import { TailoredResume } from '../types/resume';
import { CreateResumePage } from './CreateResumePage';

interface ViewResumePageProps {
  resume: TailoredResume;
  onBack: () => void;
  onUpdateResume: (resume: TailoredResume) => void;
  saveError?: string | null;
  onDismissError?: () => void;
  saveRef?: React.MutableRefObject<(() => void) | null>;
  exportPdfRef?: React.MutableRefObject<(() => void) | null>;
}

export const ViewResumePage: React.FC<ViewResumePageProps> = ({ resume, onBack, onUpdateResume, saveError, onDismissError, saveRef, exportPdfRef }) => {
  return (
            <CreateResumePage
      resumeData={resume.resumeData}
      tailoredResume={resume}
      onUpdateResume={onUpdateResume}
      onBack={onBack}
      saveError={saveError}
      onDismissError={onDismissError}
      saveRef={saveRef}
      exportPdfRef={exportPdfRef}
    />
  );
};