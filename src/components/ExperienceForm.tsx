import React, { useState } from 'react';
import { Experience } from '../types/resume';
import { Briefcase, Plus, X, Calendar, Building, Pencil } from 'lucide-react';
// Remove react-datepicker and date-fns imports

interface ExperienceFormProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ experiences, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [localExps, setLocalExps] = useState(experiences);
  React.useEffect(() => { setLocalExps(experiences); }, [experiences]);

  const [skillsState, setSkillsState] = useState<{
    [expId: string]: {
      newSkill: string;
      editingSkillIdx?: number;
      editingSkillValue?: string;
    };
  }>({});

  const addExperience = () => {
    const newExperience: Experience = {
      id: crypto.randomUUID(), // Use UUID
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [''],
      skills: [],
      location: '' // Added location
    };
    const newArr = [...localExps, newExperience];
    setLocalExps(newArr);
    onChange(newArr);
    setExpandedId(newExperience.id);
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setLocalExps(localExps.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };
  const blurExperience = (id: string) => {
    const idx = experiences.findIndex(e => e.id === id);
    if (idx !== -1 && JSON.stringify(localExps[idx]) !== JSON.stringify(experiences[idx])) {
      onChange(localExps);
    }
  };

  const removeExperience = (id: string) => {
    onChange(experiences.filter(exp => exp.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const addAchievement = (id: string) => {
    const experience = experiences.find(exp => exp.id === id);
    if (experience) {
      updateExperience(id, 'achievements', [...experience.achievements, '']);
    }
  };

  const updateAchievement = (expId: string, index: number, value: string) => {
    const experience = experiences.find(exp => exp.id === expId);
    if (experience) {
      const newAchievements = [...experience.achievements];
      newAchievements[index] = value;
      updateExperience(expId, 'achievements', newAchievements);
    }
  };

  const removeAchievement = (expId: string, index: number) => {
    const experience = experiences.find(exp => exp.id === expId);
    if (experience && experience.achievements.length > 1) {
      const newAchievements = experience.achievements.filter((_, i) => i !== index);
      updateExperience(expId, 'achievements', newAchievements);
    }
  };

  // Helper to parse YYYY-MM to Date
  // Remove parseMonthYear and formatMonthYear functions

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
          className={`w-full text-sm pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white cursor-pointer ${disabled ? 'bg-gray-100 text-gray-400' : ''}`}
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
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((experience) => (
          <div key={experience.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedId(expandedId === experience.id ? null : experience.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-sm text-gray-900">
                    {experience.position || 'New Position'} 
                    {experience.company && ` at ${experience.company}`}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeExperience(experience.id);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {expandedId === experience.id && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={localExps.find(e => e.id === experience.id)?.position || ''}
                      onChange={e => updateExperience(experience.id, 'position', e.target.value)}
                      onBlur={() => blurExperience(experience.id)}
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Company *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={localExps.find(e => e.id === experience.id)?.company || ''}
                        onChange={e => updateExperience(experience.id, 'company', e.target.value)}
                        onBlur={() => blurExperience(experience.id)}
                        className="w-full text-sm pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="e.g. TechCorp Inc."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <div className="relative">
                      <MonthYearPicker
                        value={localExps.find(e => e.id === experience.id)?.startDate || ''}
                        onChange={val => {
                          updateExperience(experience.id, 'startDate', val);
                          blurExperience(experience.id);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <div className="relative">
                      <MonthYearPicker
                        value={localExps.find(e => e.id === experience.id)?.endDate || ''}
                        onChange={val => {
                          updateExperience(experience.id, 'endDate', val);
                          blurExperience(experience.id);
                        }}
                        disabled={localExps.find(e => e.id === experience.id)?.current}
                      />
                    </div>
                    <label className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={localExps.find(e => e.id === experience.id)?.current}
                        onChange={(e) => {
                          onChange(
                            localExps.map(exp =>
                              exp.id === experience.id
                                ? {
                                    ...exp,
                                    current: e.target.checked,
                                    endDate: e.target.checked ? '' : exp.endDate
                                  }
                                : exp
                            )
                          );
                        }}
                        onBlur={() => blurExperience(experience.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Currently employed here</span>
                    </label>
                  </div>
                </div>
                {/* Location input full width below the grid */}
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={localExps.find(e => e.id === experience.id)?.location || ''}
                    onChange={e => updateExperience(experience.id, 'location', e.target.value)}
                    onBlur={() => blurExperience(experience.id)}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g. New York, NY or Remote"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Job Description
                  </label>
                  <textarea
                    value={localExps.find(e => e.id === experience.id)?.description || ''}
                    onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                    onBlur={() => blurExperience(experience.id)}
                    rows={3}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Brief description of your role and responsibilities..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Key Achievements
                    </label>
                    <button
                      onClick={() => addAchievement(experience.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      + Add Achievement
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(localExps.find(e => e.id === experience.id)?.achievements || []).map((achievement, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) => updateAchievement(experience.id, index, e.target.value)}
                          onBlur={() => blurExperience(experience.id)}
                          className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Describe a specific achievement with metrics when possible"
                        />
                        {(localExps.find(e => e.id === experience.id)?.achievements || []).length > 1 && (
                          <button
                            onClick={() => removeAchievement(experience.id, index)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Relevant Skills
                  </label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    <input
                      type="text"
                      value={skillsState[experience.id]?.newSkill || ''}
                      onChange={e => {
                        setSkillsState(s => ({
                          ...s,
                          [experience.id]: {
                            ...s[experience.id],
                            newSkill: e.target.value
                          }
                        }));
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          const exp = localExps.find(e => e.id === experience.id);
                          const newSkill = skillsState[experience.id]?.newSkill;
                          if (exp && newSkill && newSkill.trim()) {
                            const updatedSkills = [...(exp.skills || []), newSkill.trim()];
                            // Update local state
                            updateExperience(experience.id, 'skills', updatedSkills);
                            // Immediately update parent
                            const updatedExps = localExps.map(e => e.id === experience.id ? { ...e, skills: updatedSkills } : e);
                            setLocalExps(updatedExps);
                            onChange(updatedExps);
                            // Clear newSkill
                            setSkillsState(s => ({
                              ...s,
                              [experience.id]: { ...s[experience.id], newSkill: '' }
                            }));
                          }
                        }
                      }}
                      placeholder="Add a skill..."
                      className="flex-1 min-w-48 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div className="grid gap-2">
                    {(localExps.find(e => e.id === experience.id)?.skills || []).map((skill, idx) => {
                      const editingSkillIdx = skillsState[experience.id]?.editingSkillIdx;
                      const editingSkillValue = skillsState[experience.id]?.editingSkillValue || '';
                      return (
                        <div key={idx} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 min-w-0">
                          {editingSkillIdx === idx ? (
                            <input
                              type="text"
                              className="font-medium text-sm text-gray-900 flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={editingSkillValue}
                              autoFocus
                              onChange={e => {
                                setSkillsState(s => ({
                                  ...s,
                                  [experience.id]: {
                                    ...s[experience.id],
                                    editingSkillValue: e.target.value
                                  }
                                }));
                              }}
                              onBlur={() => {
                                if (editingSkillValue && editingSkillValue.trim() && editingSkillIdx !== undefined) {
                                  const updatedSkills = (localExps.find(e => e.id === experience.id)?.skills || []).map((s, i) => i === editingSkillIdx ? editingSkillValue.trim() : s);
                                  updateExperience(experience.id, 'skills', updatedSkills);
                                  const updatedExps = localExps.map(e => e.id === experience.id ? { ...e, skills: updatedSkills } : e);
                                  setLocalExps(updatedExps);
                                  onChange(updatedExps);
                                  setSkillsState(s => ({
                                    ...s,
                                    [experience.id]: { ...s[experience.id], editingSkillIdx: undefined, editingSkillValue: '' }
                                  }));
                                } else {
                                  setSkillsState(s => ({
                                    ...s,
                                    [experience.id]: { ...s[experience.id], editingSkillIdx: undefined, editingSkillValue: '' }
                                  }));
                                }
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  if (editingSkillValue && editingSkillValue.trim() && editingSkillIdx !== undefined) {
                                    const updatedSkills = (localExps.find(e => e.id === experience.id)?.skills || []).map((s, i) => i === editingSkillIdx ? editingSkillValue.trim() : s);
                                    updateExperience(experience.id, 'skills', updatedSkills);
                                    const updatedExps = localExps.map(e => e.id === experience.id ? { ...e, skills: updatedSkills } : e);
                                    setLocalExps(updatedExps);
                                    onChange(updatedExps);
                                    setSkillsState(s => ({
                                      ...s,
                                      [experience.id]: { ...s[experience.id], editingSkillIdx: undefined, editingSkillValue: '' }
                                    }));
                                  }
                                } else if (e.key === 'Escape') {
                                  setSkillsState(s => ({
                                    ...s,
                                    [experience.id]: { ...s[experience.id], editingSkillIdx: undefined, editingSkillValue: '' }
                                  }));
                                }
                              }}
                            />
                          ) : (
                            <span
                              className="font-medium text-sm text-gray-900 flex-1 group cursor-pointer flex items-center"
                              onClick={() => {
                                setSkillsState(s => ({
                                  ...s,
                                  [experience.id]: { ...s[experience.id], editingSkillIdx: idx, editingSkillValue: skill }
                                }));
                              }}
                            >
                              {skill}
                              <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Pencil className="w-3 h-3 text-gray-300 hover:text-gray-500" onClick={e => {
                                  e.stopPropagation();
                                  setSkillsState(s => ({
                                    ...s,
                                    [experience.id]: { ...s[experience.id], editingSkillIdx: idx, editingSkillValue: skill }
                                  }));
                                }} />
                              </span>
                            </span>
                          )}
                          <button
                            onClick={() => {
                              const exp = localExps.find(e => e.id === experience.id);
                              if (exp) {
                                const updatedSkills = exp.skills.filter((_, i) => i !== idx);
                                updateExperience(experience.id, 'skills', updatedSkills);
                                const updatedExps = localExps.map(e => e.id === experience.id ? { ...e, skills: updatedSkills } : e);
                                setLocalExps(updatedExps);
                                onChange(updatedExps);
                              }
                            }}
                            className="text-gray-400 text-sm hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {experiences.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No work experience added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      )}
    </div>
  );
};