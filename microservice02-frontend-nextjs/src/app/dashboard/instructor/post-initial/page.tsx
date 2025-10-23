'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/common/Button';
import BackToDashboardButton from '../BackToDashboardButton';

export default function PostInitialGradesPage() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('Please select an Excel file and click Proceed.');
  const [parsingComplete, setParsingComplete] = useState(false);
  const [confirmEnabled, setConfirmEnabled] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state for spinner
  
  // Define API endpoints - this allows easier configuration
  // Using 5001 as an alternative port based on the error
  const GRADE_SERVICE_URL = process.env.NEXT_PUBLIC_GRADE_SERVICE_URL || 'http://localhost:3008';
  const XLSX_TRANSFORM_URL = process.env.NEXT_PUBLIC_XLSX_TRANSFORM_URL || 'http://localhost:8000';
  
  // Debug log API endpoints on component mount and check services
  useEffect(() => {
    console.log('DEBUG - Grade service URL:', GRADE_SERVICE_URL);
    console.log('DEBUG - XLSX Transform URL:', XLSX_TRANSFORM_URL);
    
    // Test if the services are available
    const checkServices = async () => {
      // Check XLSX service
      try {
        await fetch(`${XLSX_TRANSFORM_URL}/health`, { 
          method: 'GET',
          mode: 'no-cors' // This might be needed for simple availability check
        });
        console.log('DEBUG - XLSX service check attempt complete');
      } catch (err) {
        console.error('DEBUG - XLSX service unavailable:', err);
      }
      
      // Check grade service
      try {
        await fetch(`${GRADE_SERVICE_URL}/health`, { 
          method: 'GET',
          mode: 'no-cors' // This might be needed for simple availability check
        });
        console.log('DEBUG - Grade service check attempt complete');
      } catch (err) {
        console.error('DEBUG - Grade service unavailable:', err);
      }
    };
    
    checkServices();
  }, [GRADE_SERVICE_URL, XLSX_TRANSFORM_URL]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setMessage(`✅ File "${uploadedFile.name}" selected. Click "Proceed" to upload and parse the file.`);
      
      // Reset states if a new file is selected
      setParsingComplete(false);
      setConfirmEnabled(false);
    }
  };
  const handleConfirm = async () => {
    if (!confirmEnabled) {
      setMessage('❌ Please complete all fields before confirming.');
      return;
    }
    
    // Get course name and student count for the message
    const courseName = formData.instructorInitialCourse || '';
    const studentCount = formData.instructorInitialGradeCount || '';
    const rawData = formData.rawData || '[]';
    
    try {
      // Start loading
      setIsLoading(true);
      setMessage('⏳ Submitting grades to grade service. Please wait...');
      
      // Get authentication token from localStorage
      const token = localStorage.getItem('token');
      
      // Debug log: Check token presence and format
      console.log('DEBUG - Token present:', !!token);
      console.log('DEBUG - Token first 10 chars:', token ? `${token.substring(0, 10)}...` : 'No token');
      
      if (!token) {
        throw new Error('Authentication token missing. Please log in again.');
      }      // Debug log: Show data being sent
      console.log('DEBUG - Sending data to grade service:', JSON.parse(rawData).length, 'records');
      console.log('DEBUG - Sample record:', JSON.parse(rawData)[0]);
      console.log('DEBUG - Full raw data to be sent:', rawData.substring(0, 200) + '...');
        // Send the parsed data to the grade service microservice
      console.log('DEBUG - Attempting to connect to:', `${GRADE_SERVICE_URL}/api/grades/upload`);
      
      // Parse the raw data and wrap it in a 'grades' property as expected by the API
      const parsedData = JSON.parse(rawData);
      const formattedData = { grades: parsedData };
      console.log('DEBUG - Formatted data for grade service:', { 
        gradesCount: parsedData.length, 
        firstItem: parsedData[0] 
      });
      
      const response = await fetch(`${GRADE_SERVICE_URL}/api/grades/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-observatory-auth': token, // Authentication header
        },
        body: JSON.stringify(formattedData), // Properly formatted data for grade service
      });
      
      // Debug: Verify the response object structure
      console.log('DEBUG - Response received, type:', typeof response);
      console.log('DEBUG - Response status:', response.status, response.statusText);
      console.log('DEBUG - Response headers:', Object.fromEntries([...response.headers.entries()]));
      
      
      // Debug log: Response status
      console.log('DEBUG - Grade service response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('DEBUG - Error response from grade service:', errorText);
        throw new Error(`Grade submission failed: ${errorText}`);
      }
      
      // Debug log: Success response
      console.log('DEBUG - Grade submission successful');
      
      // Show success message
      setMessage(`✅ Initial grades for ${courseName} (${studentCount}) submitted successfully.`);
      
      // Reset the form state
      setFormData({});
      setFile(null);
      setParsingComplete(false);
      setConfirmEnabled(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('DEBUG - Exception during grade submission:', err);
      setMessage(`❌ Failed to submit grades: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitFile = async () => {
    try {
      if (!file) {
        setMessage('❌ No file uploaded. Please choose an Excel file first.');
        return;
      }
      
      // Start loading
      setIsLoading(true);
      setMessage('⏳ Uploading and processing your file. Please wait...');
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${XLSX_TRANSFORM_URL}/api/grades/uploadXlsxOpen`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Parsing failed: ${errorText}`);
      }
      const data = await response.json();
      
      // Process the data and extract summary information
      if (Array.isArray(data) && data.length > 0) {
        // Extract course name, period, and count students
        const course = data[0].course || 'N/A';
        const period = data[0].period || 'N/A';
        const count = data.length;
        
        // Calculate grade statistics if finalScore is available
        let avgGrade = 'N/A';
        let passRate = 'N/A';
        
        const gradesAvailable = data.filter(item => item.finalScore !== undefined && item.finalScore !== null);
        if (gradesAvailable.length > 0) {
          // Calculate average grade
          const sum = gradesAvailable.reduce((acc, curr) => acc + Number(curr.finalScore), 0);
          avgGrade = (sum / gradesAvailable.length).toFixed(2);
          
          // Calculate pass rate (assuming passing grade is >= 5 in a 0-10 scale)
          const passing = gradesAvailable.filter(item => Number(item.finalScore) >= 5).length;
          passRate = `${((passing / gradesAvailable.length) * 100).toFixed(1)}%`;
        }
        
        // Set the extracted data to display in the form
        setFormData({
          instructorInitialCourse: course,
          instructorInitialPeriod: period,
          instructorInitialGradeCount: `${count} students`,
          instructorInitialAvgGrade: avgGrade,
          instructorInitialPassRate: passRate,
          // Store the full data for confirmation
          rawData: JSON.stringify(data)
        });
        
        // Set success message with the extracted information
        setParsingComplete(true);
        setConfirmEnabled(true);
        setMessage(`✅ File parsed successfully. Found ${count} students in course "${course}" for exam period "${period}". Please review the information above and click "Confirm" to proceed.`);
      } else {
        throw new Error('No valid data found in the file');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setMessage(`❌ Failed to parse file: ${errorMessage}. Please check the file format.`);
      setParsingComplete(false);
      setConfirmEnabled(false);
    } finally {
      // Always stop loading
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({});
    setFile(null);
    setParsingComplete(false);
    setConfirmEnabled(false);
    setMessage('⚠️ Initial grade submission cancelled.');
  };
  // No longer needed for this implementation

  // Effect to fade out error messages after 2.5 seconds
  useEffect(() => {
    if (message.startsWith('❌')) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 2500); // 2500ms = 2.5 seconds
      
      // Clean up the timer when component unmounts or message changes
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="space-y-8">
      <BackToDashboardButton />
      <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold">📝 Post Initial Grades</h1>
          <p>This is where instructors upload initial grades for a course.</p>
        </div>

        {/* Upload Section */}
        <div className="bg-gray-200 p-4 rounded-md space-y-4">
          <h2 className="font-medium text-sm">INITIAL GRADES POSTING</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmitFile();
          }} className="flex gap-4 items-center">
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileUpload}
              className="border border-gray-400 rounded px-2 py-1 bg-white"
              style={{ display: 'none' }}
              id="fileUpload"
            />
            <label htmlFor="fileUpload" className="cursor-pointer border border-gray-400 rounded px-2 py-1 bg-white text-gray-700">
              {file ? file.name : 'Choose File'}
            </label>
            <Button type="submit" disabled={!file || isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Proceed"}
            </Button>
          </form>
        </div>

        {/* File Parsing Section - Hidden until parsing is complete */}
        <div 
          className={`bg-gray-200 p-4 rounded-md space-y-4 transition-all duration-500 ease-in-out ${
            parsingComplete 
              ? "opacity-100 max-h-[1000px] transform scale-100" 
              : "opacity-0 max-h-0 overflow-hidden transform scale-95"
          }`}
        >
          <h2 className="font-medium text-sm">XLSX FILE SUMMARY</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Display summary information in a clear grid layout */}
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Course</h3>
              <p className="text-base font-medium">{formData.instructorInitialCourse || 'N/A'}</p>
            </div>
            
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Exam Period</h3>
              <p className="text-base font-medium">{formData.instructorInitialPeriod || 'N/A'}</p>
            </div>
            
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Student Count</h3>
              <p className="text-base font-medium">{formData.instructorInitialGradeCount || 'N/A'}</p>
            </div>
            
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Average Grade</h3>
              <p className="text-base font-medium">{formData.instructorInitialAvgGrade || 'N/A'}</p>
            </div>
            
            <div className="bg-white p-3 rounded-md shadow-sm col-span-1 md:col-span-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Pass Rate</h3>
              <p className="text-base font-medium">{formData.instructorInitialPassRate || 'N/A'}</p>
            </div>
          </div>          <div className="flex gap-4">
            <Button onClick={handleConfirm} disabled={!confirmEnabled || isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : "Confirm"}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>Cancel</Button>
          </div>
        </div>
        
        {/* Message & Announcement Area */}
        <div className={`p-4 rounded-md space-y-2 transition-all duration-300 ${
          message.startsWith('✅') ? 'bg-green-50 border border-green-200' : 
          message.startsWith('❌') ? 'bg-red-50 border border-red-200' :
          message.startsWith('⚠️') ? 'bg-yellow-50 border border-yellow-200' :
          message.startsWith('⏳') ? 'bg-blue-50 border border-blue-200' :
          'bg-gray-100'
        }`}>
          <h2 className="font-medium text-sm">NOTIFICATIONS</h2>
          {/* Status message */}
          <p className={`text-base font-medium ${
            message.startsWith('✅') ? 'text-green-700' : 
            message.startsWith('❌') ? 'text-red-700' :
            message.startsWith('⚠️') ? 'text-yellow-700' :
            message.startsWith('⏳') ? 'text-blue-700' :
            'text-gray-700'
          }`}>{message || 'No messages to display'}</p>
        </div>
      </div>
    </div>
  );
}
