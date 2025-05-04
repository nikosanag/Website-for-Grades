// /app/lib/studentStats.ts

export interface CourseStats {
  studentCourse: string;
  studentPeriod: string;
  studentInitialGrades: string;
  studentFinalGrades: string;
}

export interface ChartQuestion {
  title: string;
  labels: string[];
  values: number[];
}

export interface ChartData {
  main: {
    title: string;
    labels: string[];
    values: number[];
  };
  questions: ChartQuestion[];
}

export const studentStatsTable: CourseStats[] = [
  {
    studentCourse: 'physics',
    studentPeriod: 'fall 2024',
    studentInitialGrades: '2025-02-22',
    studentFinalGrades: '2025-02-28'
  },
  {
    studentCourse: 'software',
    studentPeriod: 'fall 2024',
    studentInitialGrades: '2025-02-01',
    studentFinalGrades: ''
  },
  {
    studentCourse: 'mathematics',
    studentPeriod: 'fall 2024',
    studentInitialGrades: '2025-02-02',
    studentFinalGrades: '2025-02-14'
  },
  {
    studentCourse: 'biology',
    studentPeriod: 'spring 2025',
    studentInitialGrades: '2025-03-05',
    studentFinalGrades: '2025-03-20'
  },
  {
    studentCourse: 'chemistry',
    studentPeriod: 'spring 2025',
    studentInitialGrades: '2025-03-10',
    studentFinalGrades: ''
  },
  {
    studentCourse: 'history',
    studentPeriod: 'fall 2024',
    studentInitialGrades: '2025-01-15',
    studentFinalGrades: '2025-02-01'
  }
];

export const studentChartData: Record<string, ChartData> = {
  physics: {
    main: {
      title: 'Physics - Fall 2024 - Total Grades',
      labels: ['1','2','3','4','5','6','7','8','9','10'],
      values: [0,1,2,3,5,8,15,22,19,10]
    },
    questions: [
      { title: 'Question 1', labels: ['1','2','3','4','5'], values: [5,4,3,2,1] },
      { title: 'Question 2', labels: ['1','2','3','4','5'], values: [2,3,5,3,2] },
      { title: 'Question 3', labels: ['1','2','3','4','5'], values: [1,0,2,4,5] },
      { title: 'Question 4', labels: ['1','2','3','4','5'], values: [3,2,1,2,3] }
    ]
  },
  software: {
    main: {
      title: 'Software Engineering - Fall 2024 - Total Grades',
      labels: ['1','2','3','4','5','6','7','8','9','10'],
      values: [0,0,1,4,7,12,18,20,15,8]
    },
    questions: [
      { title: 'Question 1', labels: ['1','2','3','4','5'], values: [1,4,7,4,2] },
      { title: 'Question 2', labels: ['1','2','3','4','5'], values: [0,3,6,9,12] },
      { title: 'Question 3', labels: ['1','2','3','4','5'], values: [2,2,2,2,2] },
      { title: 'Question 4', labels: ['1','2','3','4','5'], values: [5,5,5,5,5] }
    ]
  },
  mathematics: {
    main: {
      title: 'Mathematics - Fall 2024 - Total Grades',
      labels: ['1','2','3','4','5','6','7','8','9','10'],
      values: [1,2,3,5,10,12,14,11,8,4]
    },
    questions: [
      { title: 'Question 1', labels: ['1','2','3','4','5'], values: [3,3,3,3,3] },
      { title: 'Question 2', labels: ['1','2','3','4','5'], values: [0,2,4,6,8] },
      { title: 'Question 3', labels: ['1','2','3','4','5'], values: [5,4,3,2,1] },
      { title: 'Question 4', labels: ['1','2','3','4','5'], values: [1,3,5,7,9] }
    
    ]
  },
  biology: {
    main: {
      title: 'Biology - Spring 2025 - Total Grades',
      labels: ['1','2','3','4','5','6','7','8','9','10'],
      values: [0,1,1,3,7,10,14,16,9,4]
    },
    questions: [
      { title: 'Question 1', labels: ['1','2','3','4','5'], values: [2,3,5,3,2] },
      { title: 'Question 2', labels: ['1','2','3','4','5'], values: [1,1,1,1,1] },
      { title: 'Question 3', labels: ['1','2','3','4','5'], values: [0,2,2,2,0] },
      { title: 'Question 4', labels: ['1','2','3','4','5'], values: [3,0,3,0,3] }
    ]
  },
  chemistry: {
    main: {
      title: 'Chemistry - Spring 2025 - Total Grades',
      labels: ['1','2','3','4','5','6','7','8','9','10'],
      values: [0,0,2,5,6,9,13,18,11,6]
    },
    questions: [
      { title: 'Question 1', labels: ['1','2','3','4','5'], values: [1,3,5,3,1] },
      { title: 'Question 2', labels: ['1','2','3','4','5'], values: [0,0,1,0,0] },
      { title: 'Question 3', labels: ['1','2','3','4','5'], values: [2,2,2,2,2] },
      { title: 'Question 4', labels: ['1','2','3','4','5'], values: [5,4,3,2,1] }
    ]
  },
  history: {
    main: {
      title: 'History - Fall 2024 - Total Grades',
      labels: ['1','2','3','4','5','6','7','8','9','10'],
      values: [2,3,4,5,6,7,8,5,3,2]
    },
    questions: [
      { title: 'Question 1', labels: ['1','2','3','4','5'], values: [1,1,1,1,1] },
      { title: 'Question 2', labels: ['1','2','3','4','5'], values: [5,4,3,2,1] },
      { title: 'Question 3', labels: ['1','2','3','4','5'], values: [2,3,2,3,2] },
      { title: 'Question 4', labels: ['1','2','3','4','5'], values: [4,4,4,4,4] }
    ]
  }
}; //General
