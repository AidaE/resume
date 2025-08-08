import React, { useState, useEffect, useRef } from 'react';
import { Skill } from '../types/resume';
import { Plus, X, Pencil } from 'lucide-react';

interface SkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ skills, onChange }) => {
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const [technologiesList, setTechnologiesList] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newTech, setNewTech] = useState('');
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingTechId, setEditingTechId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
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
            placeholder="Add a skill..."
            className="flex-1 min-w-48 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            onKeyDown={e => e.key === 'Enter' && addSkill()}
          />
          {/* <button
            onClick={addSkill}
            className="pr-3 pl-2 py-1.5 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add
          </button> */}
        </div>
        <div className="grid gap-3">
          {skillsList.map(skill => (
            <div key={skill.id} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg min-w-0">
              {editingSkillId === skill.id ? (
                <input
                  type="text"
                  className="font-medium text-sm text-gray-900 flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={editingValue}
                  autoFocus
                  onChange={e => setEditingValue(e.target.value)}
                  onBlur={() => {
                    const trimmed = editingValue.trim();
                    if (trimmed && trimmed !== skill.name) {
                      const nextSkills = skillsList.map(s => s.id === skill.id ? { ...s, name: trimmed } : s);
                      setSkillsList(nextSkills);
                      syncToParent(nextSkills, technologiesList);
                    }
                    setEditingSkillId(null);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const trimmed = editingValue.trim();
                      if (trimmed && trimmed !== skill.name) {
                        const nextSkills = skillsList.map(s => s.id === skill.id ? { ...s, name: trimmed } : s);
                        setSkillsList(nextSkills);
                        syncToParent(nextSkills, technologiesList);
                      }
                      setEditingSkillId(null);
                    } else if (e.key === 'Escape') {
                      setEditingSkillId(null);
                    }
                  }}
                />
              ) : (
                <span
                  className="font-medium text-sm text-gray-900 flex-1 group cursor-pointer flex items-center"
                  onClick={() => {
                    setEditingSkillId(skill.id);
                    setEditingValue(skill.name);
                  }}
                >
                  {skill.name}
                  <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="w-3 h-3 text-gray-300 hover:text-gray-500" onClick={e => {
                      e.stopPropagation();
                      setEditingSkillId(skill.id);
                      setEditingValue(skill.name);
                    }} />
                  </span>
                </span>
              )}
              <button
                onClick={() => removeSkill(skill.id)}
                className="text-gray-400 text-sm hover:text-red-500 transition-colors"
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
            placeholder="Add technology/tool..."
            className="flex-1 min-w-48 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            onKeyDown={e => e.key === 'Enter' && addTech()}
          />
          {/* <button
            onClick={addTech}
            className="pr-3 pl-2 py-1.5 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add
          </button> */}
        </div>
        <div className="grid gap-3">
          {technologiesList.map(tech => (
            <div key={tech.id} className="flex items-center justify-between px-3 py-2 bg-white rounded-lg min-w-0">
              {editingTechId === tech.id ? (
                <input
                  type="text"
                  className="font-medium text-sm text-gray-900 flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={editingValue}
                  autoFocus
                  onChange={e => setEditingValue(e.target.value)}
                  onBlur={() => {
                    const trimmed = editingValue.trim();
                    if (trimmed && trimmed !== tech.name) {
                      const nextTechs = technologiesList.map(t => t.id === tech.id ? { ...t, name: trimmed } : t);
                      setTechnologiesList(nextTechs);
                      syncToParent(skillsList, nextTechs);
                    }
                    setEditingTechId(null);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const trimmed = editingValue.trim();
                      if (trimmed && trimmed !== tech.name) {
                        const nextTechs = technologiesList.map(t => t.id === tech.id ? { ...t, name: trimmed } : t);
                        setTechnologiesList(nextTechs);
                        syncToParent(skillsList, nextTechs);
                      }
                      setEditingTechId(null);
                    } else if (e.key === 'Escape') {
                      setEditingTechId(null);
                    }
                  }}
                />
              ) : (
                <span
                  className="font-medium text-sm text-gray-900 flex-1 group cursor-pointer flex items-center"
                  onClick={() => {
                    setEditingTechId(tech.id);
                    setEditingValue(tech.name);
                  }}
                >
                  {tech.name}
                  <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="w-3 h-3 text-gray-300 hover:text-gray-500" onClick={e => {
                      e.stopPropagation();
                      setEditingTechId(tech.id);
                      setEditingValue(tech.name);
                    }} />
                  </span>
                </span>
              )}
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