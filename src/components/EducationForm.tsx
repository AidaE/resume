import React, { useState } from 'react';
import { Education } from '../types/resume';
import { GraduationCap, Plus, X, Calendar } from 'lucide-react';
import { format, parse } from 'date-fns';


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
      honors: '',
      location: '' // Added location
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

  // Helper to parse YYYY-MM to Date
  const parseMonthYear = (val: string) => {
    if (!val || !/^\d{4}-\d{2}$/.test(val)) return null;
    const parsed = parse(val + '-01', 'yyyy-MM-dd', new Date());
    return isNaN(parsed.getTime()) ? null : parsed;
  };
  const formatMonthYear = (date: Date | null) => {
    if (!date || isNaN(date.getTime())) return '';
    return format(date, 'yyyy-MM');
  };

  // Custom MonthYearPicker component
  const MonthYearPicker: React.FC<{
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
  }> = ({ value, onChange, disabled }) => {
    const [open, setOpen] = useState(false);
    const [year, setYear] = useState(() => {
      if (value && /^\d{4}-\d{2}$/.test(value)) return parseInt(value.split('-')[0], 10);
      return new Date().getFullYear();
    });
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const selectedMonth = value && /^\d{4}-\d{2}$/.test(value) ? parseInt(value.split('-')[1], 10) - 1 : null;
    return (
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          readOnly
          value={value}
          onClick={() => !disabled && setOpen(v => !v)}
          className={`w-full pl-9 text-sm pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white cursor-pointer ${disabled ? 'bg-gray-100 text-gray-400' : ''}`}
          placeholder="YYYY-MM"
          disabled={disabled}
        />
        {open && !disabled && (
          <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 p-3" style={{ minWidth: 220 }}>
            <div className="flex items-center justify-between mb-2">
              <button className="px-2 py-1 text-gray-500 hover:text-gray-700" onClick={() => setYear(y => y - 1)}>&lt;</button>
              <span className="font-semibold">{year}</span>
              <button className="px-2 py-1 text-gray-500 hover:text-gray-700" onClick={() => setYear(y => y + 1)}>&gt;</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {months.map((m, i) => (
                <button
                  key={m}
                  className={`px-2 py-1 rounded text-sm ${selectedMonth === i && parseInt(value.split('-')[0], 10) === year ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'}`}
                  onClick={() => {
                    onChange(`${year}-${String(i + 1).padStart(2, '0')}`);
                    setOpen(false);
                  }}
                  type="button"
                >
                  {m}
                </button>
              ))}
            </div>
            <button className="mt-2 text-xs text-gray-500 hover:text-gray-700 underline" onClick={() => { onChange(''); setOpen(false); }}>Clear</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm"
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
                  <h4 className="font-medium text-sm text-gray-900">
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">Institution *</label>
                    <input
                      type="text"
                      value={localEdus.find(e => e.id === edu.id)?.institution || ''}
                      onChange={e => updateEducation(edu.id, 'institution', e.target.value)}
                      onBlur={() => blurEducation(edu.id)}
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g. Harvard University"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Degree *</label>
                    <input
                      type="text"
                      value={localEdus.find(e => e.id === edu.id)?.degree || ''}
                      onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                      onBlur={() => blurEducation(edu.id)}
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g. Bachelor of Science"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Field of Study *</label>
                    <input
                      type="text"
                      value={localEdus.find(e => e.id === edu.id)?.field || ''}
                      onChange={e => updateEducation(edu.id, 'field', e.target.value)}
                      onBlur={() => blurEducation(edu.id)}
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Graduation Date *</label>
                    <div className="relative">
                      <MonthYearPicker
                        value={localEdus.find(e => e.id === edu.id)?.graduationDate || ''}
                        onChange={val => {
                          updateEducation(edu.id, 'graduationDate', val);
                          blurEducation(edu.id);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={localEdus.find(e => e.id === edu.id)?.location || ''}
                      onChange={e => updateEducation(edu.id, 'location', e.target.value)}
                      onBlur={() => blurEducation(edu.id)}
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g. Boston, MA or Remote"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">GPA</label>
                    <input
                      type="text"
                      value={localEdus.find(e => e.id === edu.id)?.gpa || ''}
                      onChange={e => updateEducation(edu.id, 'gpa', e.target.value)}
                      onBlur={() => blurEducation(edu.id)}
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g. 3.8/4.0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Honors</label>
                    <input
                      type="text"
                      value={localEdus.find(e => e.id === edu.id)?.honors || ''}
                      onChange={e => updateEducation(edu.id, 'honors', e.target.value)}
                      onBlur={() => blurEducation(edu.id)}
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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