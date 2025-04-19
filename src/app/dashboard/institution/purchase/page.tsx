'use client';

import { useState } from 'react';
import { creditsFormFields } from '@/app/lib/institutionCreditsFormFields';
import { TextInput } from '@/app/ui/inputs/TextInput';
import { Button } from '@/app/ui/common/Button';

export default function PurchaseCreditsPage() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!formData.institution || !formData.etcs) {
      setMessage('❌ Institution and credit amount are required.');
      return;
    }

    console.log('Purchase Payload:', formData);
    setMessage(`✅ ${formData.etcs} ETCS credits requested for ${formData.institution}`);
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6 space-y-6 text-gray-800">
      <div className="bg-gray-200 p-4 rounded-md">
        <h2 className="text-md font-semibold mb-4">Buy credits (form needs to be designed)</h2>

        <div className="space-y-4">
          {creditsFormFields.map((field) => (
            <TextInput
              key={field.key}
              placeholder={field.placeholder || ''}
              value={formData[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              type={field.type}
            />
          ))}

          <Button onClick={handleSubmit}>Submit Credit Purchase</Button>
        </div>
      </div>

      <div className="bg-gray-200 p-4 rounded-md text-sm text-gray-700">
        {message || 'Message area'}
      </div>
    </div>
  );
}
