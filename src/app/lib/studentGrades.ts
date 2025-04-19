// /app/lib/studentGrades.ts

export const studentGradeDetails = {
    course: 'physics',
    period: 'spring 2025',
    grades: {
      total: '8.5',
      Q1: '9',
      Q2: '7',
      Q3: '10'
    }
  };
  
  export const studentGradeHistogram = {
    title: 'physics - spring 2025 - total',
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    values: [0, 0, 0, 0, 10, 8, 36, 61, 42, 12]
  };
  
  export const studentGradeChartQ1 = {
    title: 'physics - spring 2025 - Q1',
    labels: ['1', '2', '3', '4', '5'],
    values: [2, 4, 6, 10, 3]
  };
  