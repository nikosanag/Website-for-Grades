'use client';

import { useState } from 'react';
import { userFormFields } from '@/app/lib/institutionUserForm';
import { TextInput } from '@/app/ui/inputs/TextInput';
import { Button } from '@/app/ui/common/Button';

export default function UserManagementPage() {
  const [formData, setFormData] = useState<Record<string, string>>({
    type: 'Institution representative'
  });
  const [message, setMessage] = useState('');

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddUser = () => {
    if (!formData.username || !formData.password || !formData.id) {
      setMessage('❌ All fields except type are required.');
      return;
    }

    console.log('Add User Payload:', formData);
    setMessage(`✅ User "${formData.username}" added as ${formData.type}`);
  };

  const handleChangePassword = () => {
    if (!formData.id || !formData.password) {
      setMessage('❌ Please provide user ID and new password.');
      return;
    }

    console.log('Change Password Payload:', {
      id: formData.id,
      newPassword: formData.password
    });
    setMessage(`🔐 Password changed for user ID ${formData.id}`);
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6 space-y-6 text-gray-800">
      <div className="bg-gray-200 p-4 rounded-md">
        <h2 className="text-md font-semibold mb-4">Users</h2>

        <div className="space-y-4">
          {userFormFields.map((field) => {
            if (field.type === 'select') {
              return (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1">{field.label}</label>
                  <select
                    className="w-full border border-gray-400 px-3 py-2 rounded"
                    value={formData[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  >
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            return (
              <TextInput
                key={field.key}
                placeholder={field.placeholder || ''}
                value={formData[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                type={field.type}
              />
            );
          })}

          <div className="flex gap-4">
            <Button onClick={handleAddUser}>Add user</Button>
            <Button variant="outline" onClick={handleChangePassword}>
              Change passw
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-gray-200 p-4 rounded-md text-sm text-gray-700">
        {message || 'Message area'}
      </div>
    </div>
  );
}
