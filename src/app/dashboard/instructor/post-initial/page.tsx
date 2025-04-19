'use client';

import { useState } from 'react';
import { instructorInitialGradesMeta } from '@/app/lib/instructorInitialGrades';
import { TextInput } from '@/app/ui/inputs/TextInput';
import { Button } from '@/app/ui/common/Button';

export default function PostInitialGradesPage() {
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
      setMessage(`✅ File "${file.name}" ready to parse`);
    }
  };

  const handleSubmitFile = () => {
    if (!fileName) {
      setMessage('❌ Please upload a file first.');
      return;
    }
    setMessage(`📤 Submitted file: ${fileName}`);
  };

  const handleConfirm = () => {
    console.log('Confirm payload:', formData);
    setMessage(`✅ Grades confirmed for ${formData.instructorCourse}`);
  };

  const handleCancel = () => {
    setFormData({});
    setMessage('⚠️ Grade submission cancelled.');
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📝 Post Initial Grades</h1>
          <p className="text-gray-600">This is where instructors upload initial grades for a course.</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Initial Grades Posting</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full">
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileUpload}
                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
            <Button onClick={handleSubmitFile} className="w-full sm:w-auto">
              Submit initial grades
            </Button>
          </div>
        </div>

        {/* File Parsing Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">XLSX File Parsing</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {instructorInitialGradesMeta.map((field) => (
              <TextInput
                key={field.key}
                placeholder={field.placeholder}
                value={formData[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                type={field.type}
                className="w-full"
              />
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={handleConfirm} className="w-full sm:w-auto">
              Confirm
            </Button>
            <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
              Cancel
            </Button>
          </div>
        </div>

        {/* Message Area */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className={`text-sm ${message.includes('❌') ? 'text-red-600' : 
                                    message.includes('✅') ? 'text-green-600' : 
                                    message.includes('⚠️') ? 'text-yellow-600' : 'text-gray-600'}`}>
            {message || 'Message area'}
          </div>
        </div>
      </div>
    
  </div>
  );
}