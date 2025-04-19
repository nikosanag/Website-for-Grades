'use client';

import { useState } from 'react';
import { instructorFinalGradesMeta } from '@/app/lib/instructorFinalGrades';
import { TextInput } from '@/app/ui/inputs/TextInput';
import { Button } from '@/app/ui/common/Button';

export default function PostFinalGradesPage() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setMessage(`✅ File "${file.name}" uploaded`);
    }
  };

  const handleSubmitFile = () => {
    if (!fileName) {
      setMessage('❌ Please upload a final grades file first.');
      return;
    }
    setMessage(`📤 Submitted FINAL grades: ${fileName}`);
  };

  const handleConfirm = () => {
    console.log('Final grades confirmed:', formData);
    setMessage(`✅ Final grades confirmed for ${formData.instructorFinalCourse}`);
  };

  const handleCancel = () => {
    setFormData({});
    setMessage('⚠️ Final grade submission cancelled.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">✅ Post Final Grades</h1>
        <p>This is where instructors submit final grades and lock them.</p>
      </div>

      {/* Upload Section */}
      <div className="bg-gray-200 p-4 rounded-md space-y-4">
        <h2 className="font-medium text-sm">FINAL GRADES POSTING</h2>
        <div className="flex gap-4 items-center">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileUpload}
            className="border border-gray-400 rounded px-2 py-1 bg-white"
          />
          <Button onClick={handleSubmitFile}>Submit FINAL grades</Button>
        </div>
      </div>

      {/* File Parsing Section */}
      <div className="bg-gray-200 p-4 rounded-md space-y-4">
        <h2 className="font-medium text-sm">XLSX file parsing</h2>

        {instructorFinalGradesMeta.map((field) => (
          <TextInput
            key={field.key}
            placeholder={field.placeholder}
            value={formData[field.key] || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            type={field.type}
          />
        ))}

        <div className="flex gap-4">
          <Button onClick={handleConfirm}>Confirm</Button>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
        </div>
      </div>

      {/* Message Area */}
      <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-700">
        {message || 'Message area'}
      </div>
    </div>
  );
}
