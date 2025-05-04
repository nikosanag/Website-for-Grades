export interface GradeDistribution {
    grade: number;
    count: number;
}

export interface CourseGrades {
    courseName: string;
    total: number | null;
    q1: number | null;
    q2: number | null;
    q3: number | null;
    q4: number | null;
    totalDistribution: GradeDistribution[];
    q1Distribution: GradeDistribution[];
    q2Distribution?: GradeDistribution[];
    q3Distribution?: GradeDistribution[];
    q4Distribution?: GradeDistribution[];
}

export const studentDetailedGrades: CourseGrades[] = [
    {
        courseName: "physics",
        total: 8.5,
        q1: 9.0,
        q2: 7.0,
        q3: 10.0,
        q4: 8.0,
        totalDistribution: [
            { grade: 0, count: 0 },
            { grade: 1, count: 0 },
            { grade: 2, count: 0 },
            { grade: 3, count: 1 },
            { grade: 4, count: 2 },
            { grade: 5, count: 4 },
            { grade: 6, count: 8 },
            { grade: 7, count: 6 },
            { grade: 8, count: 4 },
            { grade: 9, count: 2 },
            { grade: 10, count: 1 }
        ],
        q1Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 9 ? 1 : 0 })),
        q2Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 7 ? 1 : 0 })),
        q3Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 10 ? 1 : 0 })),
        q4Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 8 ? 1 : 0 }))
    },
    {
        courseName: "software",
        total: 7.2,
        q1: 6.0,
        q2: 8.0,
        q3: 7.0,
        q4: 7.0,
        totalDistribution: [
            { grade: 0, count: 0 },
            { grade: 1, count: 0 },
            { grade: 2, count: 1 },
            { grade: 3, count: 2 },
            { grade: 4, count: 3 },
            { grade: 5, count: 5 },
            { grade: 6, count: 7 },
            { grade: 7, count: 8 },
            { grade: 8, count: 4 },
            { grade: 9, count: 2 },
            { grade: 10, count: 0 }
        ],
        q1Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 6 ? 1 : 0 })),
        q2Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 8 ? 1 : 0 })),
        q3Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 7 ? 1 : 0 })),
        q4Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 7 ? 1 : 0 }))
    },
    {
        courseName: "mathematics",
        total: 9.1,
        q1: 9.0,
        q2: 9.0,
        q3: 9.0,
        q4: 8.0,
        totalDistribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 9 ? 3 : 1 })),
        q1Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 9 ? 1 : 0 })),
        q2Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 9 ? 1 : 0 })),
        q3Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 9 ? 1 : 0 })),
        q4Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 8 ? 1 : 0 }))
    },
    {
        courseName: "biology",
        total: 6.8,
        q1: 7.0,
        q2: 6.0,
        q3: 7.0,
        q4: 6.0,
        totalDistribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 7 ? 2 : 1 })),
        q1Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 7 ? 1 : 0 })),
        q2Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 6 ? 1 : 0 })),
        q3Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 7 ? 1 : 0 })),
        q4Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 6 ? 1 : 0 }))
    },
    {
        courseName: "chemistry",
        total: 8.0,
        q1: 8.0,
        q2: 7.0,
        q3: 9.0,
        q4: 8.0,
        totalDistribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 8 ? 2 : 1 })),
        q1Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 8 ? 1 : 0 })),
        q2Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 7 ? 1 : 0 })),
        q3Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 9 ? 1 : 0 })),
        q4Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 8 ? 1 : 0 }))
    },
    {
        courseName: "history",
        total: 7.5,
        q1: 7.0,
        q2: 8.0,
        q3: 6.0,
        q4: 8.0,
        totalDistribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 7 ? 2 : 1 })),
        q1Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 7 ? 1 : 0 })),
        q2Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 8 ? 1 : 0 })),
        q3Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 6 ? 1 : 0 })),
        q4Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 8 ? 1 : 0 }))
    },
    {
        courseName: "Computer Networks",
        total: 8.2,
        q1: 8.5,
        q2: 7.8,
        q3: 8.3,
        q4: null,
        totalDistribution: [
            { grade: 0, count: 0 },
            { grade: 1, count: 0 },
            { grade: 2, count: 0 },
            { grade: 3, count: 1 },
            { grade: 4, count: 2 },
            { grade: 5, count: 3 },
            { grade: 6, count: 4 },
            { grade: 7, count: 5 },
            { grade: 8, count: 6 },
            { grade: 9, count: 2 },
            { grade: 10, count: 1 }
        ],
        q1Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 8 ? 1 : 0 })),
        q2Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 7 ? 1 : 0 })),
        q3Distribution: Array(11).fill(null).map((_, i) => ({ grade: i, count: i === 8 ? 1 : 0 }))
    }
];