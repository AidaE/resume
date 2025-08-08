import React, { useState, useEffect, useRef } from 'react';
import { Skill } from '../types/resume';
import { Plus, X } from 'lucide-react';

interface SkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ skills, onChange }) => {
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const [technologiesList, setTechnologiesList] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newTech, setNewTech] = useState('');
  const didInit = useRef(false);

  // Only update local state from props on initial mount
  useEffect(() => {
    if (!didInit.current) {
      setSkillsList(skills.filter(s => s.category === 'skill' || !s.category));
      setTechnologiesList(skills.filter(s => s.category === 'technology'));
      didInit.current = true;
    }
    // eslint-disable-next-line
  }, []);

  const syncToParent = (nextSkills: Skill[], nextTechs: Skill[]) => {
    onChange([
      ...nextSkills.map(s => ({ ...s, category: 'skill', level: 'Intermediate' as Skill['level'] })),
      ...nextTechs.map(t => ({ ...t, category: 'technology', level: 'Intermediate' as Skill['level'] }))
    ]);
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const nextSkills = [...skillsList, { id: crypto.randomUUID(), name: newSkill.trim(), category: 'skill', level: 'Intermediate' as Skill['level'] }];
    setSkillsList(nextSkills);
    setNewSkill('');
    syncToParent(nextSkills, technologiesList);
  };

  const addTech = () => {
    if (!newTech.trim()) return;
    const nextTechs = [...technologiesList, { id: crypto.randomUUID(), name: newTech.trim(), category: 'technology', level: 'Intermediate' as Skill['level'] }];
    setTechnologiesList(nextTechs);
    setNewTech('');
    syncToParent(skillsList, nextTechs);
  };

  const removeSkill = (id: string) => {
    const nextSkills = skillsList.filter(s => s.id !== id);
    setSkillsList(nextSkills);
    syncToParent(nextSkills, technologiesList);
  };

  const removeTech = (id: string) => {
    const nextTechs = technologiesList.filter(t => t.id !== id);
    setTechnologiesList(nextTechs);
    syncToParent(skillsList, nextTechs);
  };

  return (
    <div className="space-y-6">
      {/* Skills Card */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Skills</h4>
        <div className="flex gap-2 flex-wrap mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            className="flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            onKeyDown={e => e.key === 'Enter' && addSkill()}
          />
          <button
            onClick={addSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        <div className="grid gap-3">
          {skillsList.map(skill => (
            <div key={skill.id} className="flex items-center justify-between p-3 bg-white rounded-lg min-w-0">
              <span className="font-medium text-gray-900">{skill.name}</span>
              <button
                onClick={() => removeSkill(skill.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Technologies Card */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Technologies</h4>
        <div className="flex gap-2 flex-wrap mb-4">
          <input
            type="text"
            value={newTech}
            onChange={e => setNewTech(e.target.value)}
            placeholder="Add a technology/tool"
            className="flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            onKeyDown={e => e.key === 'Enter' && addTech()}
          />
          <button
            onClick={addTech}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        <div className="grid gap-3">
          {technologiesList.map(tech => (
            <div key={tech.id} className="flex items-center justify-between p-3 bg-white rounded-lg min-w-0">
              <span className="font-medium text-gray-900">{tech.name}</span>
              <button
                onClick={() => removeTech(tech.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};