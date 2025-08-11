import React, { useState, useEffect } from 'react';
import { Certification } from '../types/resume';
import { Plus, X, Calendar } from 'lucide-react';

interface CertificationsFormProps {
  certifications: Certification[];
  onChange: (certifications: Certification[]) => void;
}

export const CertificationsForm: React.FC<CertificationsFormProps> = ({ certifications, onChange }) => {
  const [localCerts, setLocalCerts] = useState<Certification[]>(certifications);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  useEffect(() => { setLocalCerts(certifications); }, [certifications]);

  const addCertification = () => {
    const newCert: Certification = {
      id: crypto.randomUUID(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: ''
    };
    const newArr = [...localCerts, newCert];
    setLocalCerts(newArr);
    onChange(newArr);
    setExpandedId(newCert.id);
  };

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    const updated = localCerts.map(cert => cert.id === id ? { ...cert, [field]: value } : cert);
    setLocalCerts(updated);
    onChange(updated);
  };

  const removeCertification = (id: string) => {
    const updated = localCerts.filter(cert => cert.id !== id);
    setLocalCerts(updated);
    onChange(updated);
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={addCertification}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>
      <div className="space-y-4">
        {localCerts.map((cert) => (
          <div key={cert.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Summary row, always visible */}
            <div
              className={`p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between`}
              onClick={() => setExpandedId(expandedId === cert.id ? null : cert.id)}
            >
              <div>
                <div className="font-medium text-sm text-gray-900">{cert.name || 'New Certification'}</div>
                <div className="text-xs text-gray-600">{cert.issuer}{cert.date && ` • ${cert.date}`}</div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); removeCertification(cert.id); }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Expanded form for editing */}
            {expandedId === cert.id && (
              <div className="p-4 border-t border-gray-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Certification Name *</label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={e => updateCertification(cert.id, 'name', e.target.value)}
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g. AWS Certified Solutions Architect"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Issuer *</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={e => updateCertification(cert.id, 'issuer', e.target.value)}
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g. Amazon Web Services"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Issue Date *</label>
                    <input
                      type="month"
                      value={cert.date}
                      onChange={e => updateCertification(cert.id, 'date', e.target.value)}
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="YYYY-MM"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="month"
                      value={cert.expiryDate || ''}
                      onChange={e => updateCertification(cert.id, 'expiryDate', e.target.value)}
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="YYYY-MM"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Credential ID</label>
                    <input
                      type="text"
                      value={cert.credentialId || ''}
                      onChange={e => updateCertification(cert.id, 'credentialId', e.target.value)}
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g. 1234567890"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {localCerts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No certifications added yet.</p>
          <p className="text-sm">Click "Add Certification" to get started.</p>
        </div>
      )}
    </div>
  );
};
