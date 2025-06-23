'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/app/ui/common/Button';


interface ReviewDetail {
  _id: string;
  professorId: string;
  professorName: string;
  studentId: string;
  studentName: string;
  period: string;
  classSection: string;
  gradingScale: string;
  originalGrade: number;
  newGrade: number;
  reviewStatus: string;
  comments: string[];
}

export default function ReplyReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewId = searchParams.get('id');
  
  const [review, setReview] = useState<ReviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{success?: string; error?: string}>({});
  
  // Fetch the review details when the component loads
  useEffect(() => {
    const fetchReviewDetails = async () => {
      if (!reviewId) {
        setError('Missing review ID');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
          const token = localStorage.getItem('token');
        console.log(`Fetching details for review ID: ${reviewId}`);
        
        // Since there's no specific endpoint for a single review,
        // we'll get all instructor reviews and find the one we need
        const response = await fetch(`http://localhost:3005/api/viewInstructorReviews`, {
          headers: {
            'x-observatory-auth': token || '',
            'Accept': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch review details: ${errorText}`);
        }
          const data = await response.json();
        console.log('Fetched reviews data:', data);
        
        // Handle different API response formats
        let reviewsArray = [];
        
        // If data is directly an array
        if (Array.isArray(data)) {
          reviewsArray = data;
        } 
        // If data has a reviews property that is an array
        else if (data && data.reviews && Array.isArray(data.reviews)) {
          reviewsArray = data.reviews;
        } 
        // If data has another structure containing reviews
        else if (data && typeof data === 'object') {
          // Try to find any array in the response that might contain reviews
          const possibleArrays = Object.values(data).filter(value => Array.isArray(value));
          if (possibleArrays.length > 0) {
            // Use the first array found
            reviewsArray = possibleArrays[0];
          }
        }        // Find the specific review by ID using type assertion
        const reviewData = reviewsArray.find(
          (review: {_id?: string}) => review && typeof review === 'object' && review._id === reviewId
        ) as ReviewDetail | undefined;
        
        if (!reviewData) {
          throw new Error(`Review with ID ${reviewId} not found`);
        }
        
        console.log('Found specific review:', reviewData);
        setReview(reviewData);
          // No need to pre-populate anything
      } catch (err) {
        console.error('Error fetching review details:', err);
        setError('Could not load review details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviewDetails();
  }, [reviewId]);    const handleSubmitReply = async () => {
    if (!reviewId || !replyText) {
      setSubmitStatus({ error: 'Please provide a reply to the student' });
      return;
    }
    
    try {
      setSubmitting(true);
      setSubmitStatus({});
      const token = localStorage.getItem('token');
      
      // We need to use the same endpoint that creates reviews initially,
      // since there's no specific endpoint for updates
      const response = await fetch(`http://localhost:3005/api/postReview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-observatory-auth': token || '',
        },
        body: JSON.stringify({
          professorId: review?.professorId || '',
          professorName: review?.professorName || 'Instructor',
          studentId: review?.studentId || '',
          studentName: review?.studentName || '',
          period: review?.period || '',
          classSection: review?.classSection || '',
          gradingScale: review?.gradingScale || '0-10',
          originalGrade: review?.originalGrade || 0,
          newGrade: review?.originalGrade || 0, // Keep the same grade
          reviewStatus: 'Απαντήθηκε από διδάσκοντα',
          comment: replyText,
          sender: 'Instructor' // Explicitly set the sender as Instructor
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit reply: ${errorText}`);
      }
      
      setSubmitStatus({ success: 'Reply submitted successfully' });
      
      // Navigate back to the review requests page after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/instructor/review-requests');
      }, 2000);
    } catch (err) {
      console.error('Error submitting reply:', err);
      setSubmitStatus({ error: 'Failed to submit reply. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Reply to Review Request</h1>
        <Button 
          onClick={() => router.push('/dashboard/instructor/review-requests')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
        >
          Back to Requests
        </Button>
      </div>
      
      {loading ? (
        <div className="text-gray-500">Loading review details...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : !review ? (
        <div className="text-red-600">Review not found</div>
      ) : (
        <div className="bg-white rounded-md shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-medium mb-2">Review Details</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Course:</span> {review.classSection}</p>
                <p><span className="font-medium">Period:</span> {review.period}</p>
                <p><span className="font-medium">Student:</span> {review.studentName}</p>
                <p><span className="font-medium">Original Grade:</span> {review.originalGrade}
                {review.newGrade !== undefined && review.newGrade !== null && review.newGrade !== review.originalGrade && (
                  <span> &rarr; <span className="font-medium">New Grade:</span> {review.newGrade}</span>
                )}
                </p>
                <p><span className="font-medium">Status:</span> {review.reviewStatus}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-2">Review History</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto border rounded-md p-3 bg-gray-50">
                {review.comments && review.comments.length > 0 ? (
                  <div className="space-y-3">
                    {review.comments.map((comment, index) => {
                      // If comment is a string like '[Student] message', extract the role and message
                      let sender: 'Student' | 'Instructor' = 'Student';
                      let commentText: string = String(comment);
                      if (typeof comment === 'string') {
                        const match = comment.match(/^\[(Student|Instructor)]\s*(.*)$/i);
                        if (match) {
                          sender = match[1] === 'Instructor' ? 'Instructor' : 'Student';
                          commentText = match[2];
                        }
                      } else if (typeof comment === 'object' && comment !== null) {
                        // Use type assertion to avoid 'any' and TS errors
                        const cmt = comment as { sender?: string; text?: string };
                        if (cmt.sender === 'Instructor' || cmt.sender === 'Student') sender = cmt.sender;
                        if (typeof cmt.text === 'string') commentText = cmt.text;
                      }
                      return (
                        <div
                          key={index}
                          className={`p-3 rounded-md ${sender === 'Student' ? 'bg-blue-50' : 'bg-gray-100 ml-4'}`}
                        >
                          <p className="text-sm font-medium mb-1">{sender}:</p>
                          <p className="whitespace-pre-wrap">{commentText}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">No comments yet</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6 mt-6">
            <h2 className="text-lg font-medium mb-4">Your Reply</h2>
            
            <div className="space-y-4">              {/* New Grade input removed as requested */}
                <div>
                <label className="block mb-2 font-medium">Your Response to Student</label>
                <div className="border border-blue-200 rounded-md p-4 bg-blue-50 mb-3">                  <div className="text-sm text-blue-700 mb-2">
                    Write your response to the student&apos;s grade review request below:
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-3 border-2 border-blue-300 rounded-md h-32 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="Enter your detailed feedback explaining your decision about the grade review..."
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    Your response will be added to the review conversation history
                  </div>
                </div>
              </div>
              
              {submitStatus.success && (
                <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-md">
                  {submitStatus.success}
                </div>
              )}
              {submitStatus.error && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                  {submitStatus.error}
                </div>
              )}
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitReply}
                  disabled={submitting || !replyText}
                  className={`px-6 py-2 rounded-md ${
                    submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  type="button"
                >
                  {submitting ? 'Submitting...' : 'Submit Reply'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
