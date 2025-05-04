// /app/lib/studentCourseDetails.ts

import { ChartQuestion } from './studentStats';

export interface StudentCourseDetail {
  studentCourse: string;
  studentPeriod: string;
  studentGradingStatus: 'open' | 'closed';
  studentReviewSubmitted: boolean;
  studentGradeDetails: {
    total: string;
    Q1: string;
    Q2: string;
    Q3: string;
    Q4: string;
  };
  questionGrades: ChartQuestion[];
  reviewRequest?: {
    message: string;
    submittedAt?: string;
    messages?: {
      sender: 'student' | 'instructor';
      message: string;
      timestamp: string;
    }[];
  };
}

export const studentCourseDetails: StudentCourseDetail[] = [
  {
    studentCourse: 'physics',
    studentPeriod: 'fall 2024',
    studentGradingStatus: 'open',
    studentReviewSubmitted: false,
    studentGradeDetails: { total: '8.5', Q1: '9', Q2: '7', Q3: '10', Q4: '8' },
    questionGrades: [
      { title: 'Q1', labels: ['1','2','3','4','5'], values: [1,2,3,4,5] },
      { title: 'Q2', labels: ['1','2','3','4','5'], values: [2,3,4,3,2] },
      { title: 'Q3', labels: ['1','2','3','4','5'], values: [0,1,2,3,4] },
      { title: 'Q4', labels: ['1','2','3','4','5'], values: [1,1,2,2,3] }
    ]
  },
  {
    studentCourse: 'software',
    studentPeriod: 'fall 2024',
    studentGradingStatus: 'closed',
    studentReviewSubmitted: true,
    studentGradeDetails: { total: '7.2', Q1: '6', Q2: '8', Q3: '7', Q4: '7' },
    questionGrades: [
      { title: 'Q1', labels: ['1','2','3','4','5'], values: [2,3,5,7,9] }
    ],
    reviewRequest: {
      message: "Regarding Q1, I think my implementation was correct but maybe misunderstood.",
      submittedAt: "2024-12-15T09:20:00Z",
      messages: [
        {
          sender: 'student',
          message: "Regarding Q1, I think my implementation was correct but maybe misunderstood.",
          timestamp: "2024-12-15T09:20:00Z"
        },
        {
          sender: 'instructor',
          message: "After reviewing your code, there were some edge cases not handled properly.",
          timestamp: "2024-12-16T11:30:00Z"
        },
        {
          sender: 'student',
          message: "Could you please point out which edge cases specifically?",
          timestamp: "2024-12-16T13:45:00Z"
        },
        {
          sender: 'instructor',
          message: "Your solution didn't handle negative inputs and empty arrays. Check the test cases provided in the assignment.",
          timestamp: "2024-12-16T15:20:00Z"
        }
      ]
    }
  },
  {
    studentCourse: 'mathematics',
    studentPeriod: 'fall 2024',
    studentGradingStatus: 'closed',
    studentReviewSubmitted: false,
    studentGradeDetails: { total: '9.1', Q1: '9', Q2: '9', Q3: '9', Q4: '8' },
    questionGrades: [
      { title: 'Q1', labels: ['1','2','3','4','5'], values: [3,3,3,3,3] },
      { title: 'Q2', labels: ['1','2','3','4','5'], values: [0,2,4,6,8] },
      { title: 'Q3', labels: ['1','2','3','4','5'], values: [5,4,3,2,1] },
      { title: 'Q4', labels: ['1','2','3','4','5'], values: [1,3,5,7,9] }
    ]
  },
  {
    studentCourse: 'biology',
    studentPeriod: 'spring 2025',
    studentGradingStatus: 'open',
    studentReviewSubmitted: false,
    studentGradeDetails: { total: '6.8', Q1: '7', Q2: '6', Q3: '7', Q4: '6' },
    questionGrades: [
      { title: 'Q1', labels: ['1','2','3','4','5'], values: [2,3,5,3,2] }
    ]
  },
  {
    studentCourse: 'chemistry',
    studentPeriod: 'spring 2025',
    studentGradingStatus: 'open',
    studentReviewSubmitted: false,
    studentGradeDetails: { total: '8.0', Q1: '8', Q2: '7', Q3: '9', Q4: '8' },
    questionGrades: [
      { title: 'Q1', labels: ['1','2','3','4','5'], values: [1,3,5,3,1] },
      { title: 'Q2', labels: ['1','2','3','4','5'], values: [0,0,1,0,0] },
      { title: 'Q3', labels: ['1','2','3','4','5'], values: [2,2,2,2,2] },
      { title: 'Q4', labels: ['1','2','3','4','5'], values: [5,4,3,2,1] }
    ]
  },
  {
    studentCourse: 'history',
    studentPeriod: 'fall 2024',
    studentGradingStatus: 'closed',
    studentReviewSubmitted: false,
    studentGradeDetails: { total: '7.5', Q1: '7', Q2: '8', Q3: '6', Q4: '8' },
    questionGrades: [
      { title: 'Q1', labels: ['1','2','3','4','5'], values: [1,1,1,1,1] },
      { title: 'Q2', labels: ['1','2','3','4','5'], values: [5,4,3,2,1] },
      { title: 'Q3', labels: ['1','2','3','4','5'], values: [2,3,2,3,2] },
      { title: 'Q4', labels: ['1','2','3','4','5'], values: [4,4,4,4,4] }
    ]
  },
  {
    studentCourse: 'Computer Networks',
    studentPeriod: 'spring 2025',
    studentGradingStatus: 'open',
    studentReviewSubmitted: false,
    studentGradeDetails: { total: '8.2', Q1: '8.5', Q2: '7.8', Q3: '8.3', Q4: '-' },
    questionGrades: [
      { title: 'Q1', labels: ['1','2','3','4','5'], values: [1,2,3,2,1] },
      { title: 'Q2', labels: ['1','2','3','4','5'], values: [2,2,2,2,2] },
      { title: 'Q3', labels: ['1','2','3','4','5'], values: [1,2,3,2,1] }
    ]
  },
  {
    studentCourse: 'physics',
    studentPeriod: 'spring 2025',
    studentGradingStatus: 'open',
    studentReviewSubmitted: true,
    studentGradeDetails: { total: '8.5', Q1: '9', Q2: '7', Q3: '10', Q4: '8' },
    questionGrades: [
      { title: 'Q1', labels: ['1','2','3','4','5'], values: [1,2,3,4,5] },
      { title: 'Q2', labels: ['1','2','3','4','5'], values: [2,3,4,3,2] },
      { title: 'Q3', labels: ['1','2','3','4','5'], values: [0,1,2,3,4] },
      { title: 'Q4', labels: ['1','2','3','4','5'], values: [1,1,2,2,3] }
    ],
    reviewRequest: {
      message: "I believe my grade for Q2 should be higher as I provided all necessary steps.",
      submittedAt: "2025-04-29T10:30:00Z",
      messages: [
        {
          sender: 'student',
          message: "I believe my grade for Q2 should be higher as I provided all necessary steps.",
          timestamp: "2025-04-29T10:30:00Z"
        },
        {
          sender: 'instructor',
          message: "I'll review your Q2 answers and get back to you soon.",
          timestamp: "2025-04-29T14:15:00Z"
        }
      ]
    }
  }
];