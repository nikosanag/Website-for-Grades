// /app/lib/instructorStats.ts

export const instructorStatsTable = [
    {
      instructorCourse: 'physics',
      instructorPeriod: 'fall 2024',
      instructorInitialGrades: '2025-02-22',
      instructorFinalGrades: '2025-02-28'
    },
    {
      instructorCourse: 'software',
      instructorPeriod: 'fall 2024',
      instructorInitialGrades: '2025-02-01',
      instructorFinalGrades: ''
    },
    {
      instructorCourse: 'mathematics',
      instructorPeriod: 'fall 2024',
      instructorInitialGrades: '2025-02-02',
      instructorFinalGrades: '2025-02-14'
    }
  ];
  
  export const instructorChartData = {
    main: {
      title: 'physics - spring 2025 - total',
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      values: [0, 0, 0, 0, 10, 8, 36, 61, 42, 12]
    },
    questions: [
      {
        title: 'physics - spring 2025 - Q1',
        labels: ['1', '2', '3', '4', '5'],
        values: [2, 4, 8, 12, 6]
      },
      {
        title: 'physics - spring 2025 - Q2',
        labels: ['1', '2', '3', '4', '5'],
        values: [1, 6, 9, 7, 3]
      },
      {
        title: 'physics - spring 2025 - Q3',
        labels: ['1', '2', '3', '4', '5'],
        values: [0, 0, 3, 2, 1]
      },
      {
        title: 'physics - spring 2025 - Q4',
        labels: ['1', '2', '3', '4', '5'],
        values: [1, 2, 1, 1, 0]
      }
    ]
  };
  