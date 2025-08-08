import React, { useState } from 'react';
import { Experience } from '../types/resume';
import { Briefcase, Plus, X, Calendar, Building } from 'lucide-react';

interface ExperienceFormProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ experiences, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [localExps, setLocalExps] = useState(experiences);
  React.useEffect(() => { setLocalExps(experiences); }, [experiences]);

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
      skills: []
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={localExps.find(e => e.id === experience.id)?.position || ''}
                      onChange={e => updateExperience(experience.id, 'position', e.target.value)}
                      onBlur={() => blurExperience(experience.id)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={localExps.find(e => e.id === experience.id)?.company || ''}
                        onChange={e => updateExperience(experience.id, 'company', e.target.value)}
                        onBlur={() => blurExperience(experience.id)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="e.g. TechCorp Inc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="month"
                        value={localExps.find(e => e.id === experience.id)?.startDate || ''}
                        onChange={e => updateExperience(experience.id, 'startDate', e.target.value)}
                        onBlur={() => blurExperience(experience.id)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="month"
                        value={localExps.find(e => e.id === experience.id)?.endDate || ''}
                        onChange={e => updateExperience(experience.id, 'endDate', e.target.value)}
                        onBlur={() => blurExperience(experience.id)}
                        disabled={localExps.find(e => e.id === experience.id)?.current}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    value={localExps.find(e => e.id === experience.id)?.description || ''}
                    onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                    onBlur={() => blurExperience(experience.id)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Brief description of your role and responsibilities..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
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
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="• Describe a specific achievement with metrics when possible"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relevant Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(localExps.find(e => e.id === experience.id)?.skills || []).join(', ')}
                    onChange={e => updateExperience(experience.id, 'skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                    onBlur={() => blurExperience(experience.id)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="React, TypeScript, Node.js, AWS, Project Management"
                  />
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