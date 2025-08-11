import React, { useState, useEffect } from 'react';
import { Language } from '../types/resume';
import { Plus, X, Globe } from 'lucide-react';

interface LanguagesFormProps {
  languages: Language[];
  onChange: (languages: Language[]) => void;
}

const PROFICIENCY_OPTIONS: Language['proficiency'][] = [
  'Elementary',
  'Limited Working',
  'Professional Working',
  'Full Professional',
  'Native',
];

export const LanguagesForm: React.FC<LanguagesFormProps> = ({ languages, onChange }) => {
  const [localLangs, setLocalLangs] = useState<Language[]>(languages);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  useEffect(() => { setLocalLangs(languages); }, [languages]);

  const addLanguage = () => {
    const newLang: Language = {
      id: crypto.randomUUID(),
      name: '',
      proficiency: 'Elementary',
    };
    const newArr = [...localLangs, newLang];
    setLocalLangs(newArr);
    onChange(newArr);
    setExpandedId(newLang.id);
  };

  const updateLanguage = (id: string, field: keyof Language, value: any) => {
    const updated = localLangs.map(lang => lang.id === id ? { ...lang, [field]: value } : lang);
    setLocalLangs(updated);
    onChange(updated);
  };

  const removeLanguage = (id: string) => {
    const updated = localLangs.filter(lang => lang.id !== id);
    setLocalLangs(updated);
    onChange(updated);
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={addLanguage}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Language
        </button>
      </div>
      <div className="space-y-4">
        {localLangs.map((lang) => (
          <div key={lang.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Summary row, always visible */}
            <div
              className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between"
              onClick={() => setExpandedId(expandedId === lang.id ? null : lang.id)}
            >
              <div>
                <div className="font-medium text-sm text-gray-900">{lang.name || 'New Language'}</div>
                <div className="text-xs text-gray-600">{lang.proficiency}</div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); removeLanguage(lang.id); }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Expanded form for editing */}
            {expandedId === lang.id && (
              <div className="p-4 border-t border-gray-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Language Name *</label>
                    <input
                      type="text"
                      value={lang.name}
                      onChange={e => updateLanguage(lang.id, 'name', e.target.value)}
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g. English, Spanish, Mandarin"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Proficiency *</label>
                    <select
                      value={lang.proficiency}
                      onChange={e => updateLanguage(lang.id, 'proficiency', e.target.value as Language['proficiency'])}
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      {PROFICIENCY_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {localLangs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No languages added yet.</p>
          <p className="text-sm">Click "Add Language" to get started.</p>
        </div>
      )}
    </div>
  );
};
