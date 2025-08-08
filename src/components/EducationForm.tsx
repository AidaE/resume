import React, { useState } from 'react';
import { Education } from '../types/resume';
import { GraduationCap, Plus, X, Calendar } from 'lucide-react';

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ education, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [localEdus, setLocalEdus] = useState(education);
  React.useEffect(() => { setLocalEdus(education); }, [education]);

  const addEducation = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: '',
      honors: ''
    };
    const newArr = [...localEdus, newEducation];
    setLocalEdus(newArr);
    onChange(newArr);
    setExpandedId(newEducation.id);
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setLocalEdus(localEdus.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };
  const blurEducation = (id: string) => {
    const idx = education.findIndex(e => e.id === id);
    if (idx !== -1 && JSON.stringify(localEdus[idx]) !== JSON.stringify(education[idx])) {
      onChange(localEdus);
    }
  };

  const removeEducation = (id: string) => {
    onChange(education.filter(edu => edu.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>
      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {edu.degree || 'New Degree'}{edu.field && ` in ${edu.field}`}
                    {edu.institution && ` at ${edu.institution}`}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {edu.graduationDate}
                  </p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); removeEducation(edu.id); }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {expandedId === edu.id && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Institution *</label>
                    <input
                      type="text"
                      value={localEdus.find(e => e.id === edu.id)?.institution || ''}
                      onChange={e => updateEducation(edu.id, 'institution', e.target.value)}
                      onBlur={() => blurEducation(edu.id)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g. Harvard University"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
                    <input
                      type="text"
                      value={localEdus.find(e => e.id === edu.id)?.degree || ''}
                      onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                      onBlur={() => blurEducation(edu.id)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g. Bachelor of Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study *</label>
                    <input
                      type="text"
                      value={localEdus.find(e => e.id === edu.id)?.field || ''}
                      onChange={e => updateEducation(edu.id, 'field', e.target.value)}
                      onBlur={() => blurEducation(edu.id)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="month"
                        value={localEdus.find(e => e.id === edu.id)?.graduationDate || ''}
                        onChange={e => updateEducation(edu.id, 'graduationDate', e.target.value)}
                        onBlur={() => blurEducation(edu.id)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                    <input
                      type="text"
                      value={localEdus.find(e => e.id === edu.id)?.gpa || ''}
                      onChange={e => updateEducation(edu.id, 'gpa', e.target.value)}
                      onBlur={() => blurEducation(edu.id)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g. 3.8/4.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Honors</label>
                    <input
                      type="text"
                      value={localEdus.find(e => e.id === edu.id)?.honors || ''}
                      onChange={e => updateEducation(edu.id, 'honors', e.target.value)}
                      onBlur={() => blurEducation(edu.id)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g. Summa Cum Laude"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {education.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No education added yet.</p>
          <p className="text-sm">Click "Add Education" to get started.</p>
        </div>
      )}
    </div>
  );
}; 