'use client';

import { useState } from 'react';
import { institutionFormFields } from '@/app/lib/institutionForm';
import { TextInput } from '@/app/ui/inputs/TextInput';
import { Button } from '@/app/ui/common/Button';

export default function RegisterInstitutionPage() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const missing = institutionFormFields.find(
      (field) => !formData[field.key]
    );

    if (missing) {
      setMessage(`❌ ${missing.label} is required.`);
    } else {
      console.log('Submitting:', formData);
      setMessage(`✅ Institution "${formData.name}" submitted successfully.`);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6 space-y-6 text-gray-800">
      <div className="bg-gray-200 p-4 rounded-md">
        <h2 className="text-md font-semibold mb-4">Register Institution</h2>

        <div className="space-y-4">
          {institutionFormFields.map((field) => (
            <TextInput
              key={field.key}
              placeholder={field.placeholder}
              value={formData[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
            />
          ))}

          <Button onClick={handleSubmit}>Submit Institution</Button>
        </div>
      </div>

      <div className="bg-gray-200 p-4 rounded-md text-sm text-gray-700">
        {message || 'Message area'}
      </div>
    </div>
  );
}
