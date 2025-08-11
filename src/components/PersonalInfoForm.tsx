import React, { useState } from 'react';
import { PersonalInfo } from '../types/resume';
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onChange }) => {
  const [local, setLocal] = useState(data);
  React.useEffect(() => { setLocal(data); }, [data]);
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    setLocal(prev => ({ ...prev, [field]: value }));
  };
  const handleBlur = (field: keyof PersonalInfo) => {
    if (local[field] !== data[field]) onChange(local);
  };

  return (
    <div className="space-y-4">
      {/* Section title removed, handled by parent */}

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={local.fullName}
            onChange={e => handleChange('fullName', e.target.value)}
            onBlur={() => handleBlur('fullName')}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            value={local.email}
            onChange={e => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            value={local.phone}
            onChange={e => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            type="text"
            value={local.location}
            onChange={e => handleChange('location', e.target.value)}
            onBlur={() => handleBlur('location')}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="City, State, Country"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Portfolio/Website
          </label>
          <input
            type="url"
            value={local.portfolio || ''}
            onChange={e => handleChange('portfolio', e.target.value)}
            onBlur={() => handleBlur('portfolio')}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Professional Summary *
        </label>
        <textarea
          value={local.summary}
          onChange={e => handleChange('summary', e.target.value)}
          onBlur={() => handleBlur('summary')}
          rows={4}
          className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
        />
        <p className="text-xs text-gray-500 mt-1">
          This summary will be tailored for each job application based on the job description.
        </p>
      </div>
    </div>
  );
};