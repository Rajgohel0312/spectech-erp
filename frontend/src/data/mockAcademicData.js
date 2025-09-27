// ========== Helpers ==========

// Generate mock students
const generateStudents = (prefix, count, startId = 1) => {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    rollNo: `${prefix}-${String(i + 1).padStart(3, "0")}`,
    name: `Student ${i + 1}`,
    email: `student${i + 1}@example.com`,
  }));
};

// Generate mock courses
const generateCourses = (prefix, startId = 1) => [
  { id: startId, code: `${prefix}101`, title: "Fundamentals", credit: 3, faculty: "Dr. Patel" },
  { id: startId + 1, code: `${prefix}102`, title: "Intermediate Concepts", credit: 4, faculty: "Prof. Sharma" },
  { id: startId + 2, code: `${prefix}201`, title: "Advanced Topics", credit: 3, faculty: "Dr. Mehta" },
];

// Generate mock exams
const generateExams = (prefix, courses, startId = 1) =>
  courses.map((c, i) => ({
    id: startId + i,
    course: `${c.code} - ${c.title}`,
    courseId: c.id,
    date: `2025-12-${10 + i}`,
    time: "10:00 AM",
    room: `${prefix}-Room-${i + 1}`,
  }));

// Generate semesters for a department
const generateSemesters = (prefix, baseStudentId, baseCourseId, baseExamId, semCount = 6, studentsPerSem = 60) =>
  Array.from({ length: semCount }, (_, i) => {
    const semId = i + 1;
    const students = generateStudents(`${prefix}${semId}`, studentsPerSem, baseStudentId + i * studentsPerSem);
    const courses = generateCourses(prefix, baseCourseId + i * 10);
    const exams = generateExams(`${prefix}${semId}`, courses, baseExamId + i * 10);
    return { id: semId, name: `Semester ${semId}`, students, courses, exams };
  });

// ========== Colleges Data ==========

export const mockAcademicData = [
  {
    id: 1,
    name: "Engineering College",
    departments: [
      {
        id: 101,
        name: "Computer Science",
        semesters: generateSemesters("CSE", 1001, 2001, 3001, 6, 70), // ~420 students
      },
      {
        id: 102,
        name: "Mechanical Engineering",
        semesters: generateSemesters("ME", 2001, 2101, 3101, 6, 65), // ~390 students
      },
      {
        id: 103,
        name: "Civil Engineering",
        semesters: generateSemesters("CE", 3001, 2201, 3201, 6, 60), // ~360 students
      },
      {
        id: 104,
        name: "Electrical Engineering",
        semesters: generateSemesters("EE", 4001, 2301, 3301, 6, 55), // ~330 students
      },
    ],
  },
  {
    id: 2,
    name: "Pharmacy College",
    departments: [
      {
        id: 201,
        name: "Pharmaceutical Sciences",
        semesters: generateSemesters("PH", 5001, 2401, 3401, 8, 40), // ~320 students
      },
    ],
  },
  {
    id: 3,
    name: "MBA College",
    departments: [
      {
        id: 301,
        name: "Business Administration",
        semesters: generateSemesters("MBA", 6001, 2501, 3501, 4, 75), // ~300 students
      },
    ],
  },
  {
    id: 4,
    name: "Science College",
    departments: [
      {
        id: 401,
        name: "Physics",
        semesters: generateSemesters("PHY", 7001, 2601, 3601, 6, 45), // ~270 students
      },
      {
        id: 402,
        name: "Chemistry",
        semesters: generateSemesters("CHEM", 7501, 2701, 3701, 6, 50), // ~300 students
      },
      {
        id: 403,
        name: "Mathematics",
        semesters: generateSemesters("MATH", 8001, 2801, 3801, 6, 55), // ~330 students
      },
    ],
  },
  {
    id: 5,
    name: "Commerce College",
    departments: [
      {
        id: 501,
        name: "Accounting",
        semesters: generateSemesters("ACC", 9001, 2901, 3901, 6, 60), // ~360 students
      },
      {
        id: 502,
        name: "Finance",
        semesters: generateSemesters("FIN", 9501, 3001, 4001, 6, 50), // ~300 students
      },
    ],
  },
  {
    id: 6,
    name: "Polytechnic College",
    departments: [
      {
        id: 601,
        name: "Automobile",
        semesters: generateSemesters("AUTO", 10001, 3101, 4101, 6, 40), // ~240 students
      },
      {
        id: 602,
        name: "Electronics",
        semesters: generateSemesters("ELEC", 10241, 3201, 4201, 6, 45), // ~270 students
      },
    ],
  },
  {
    id: 7,
    name: "Arts College",
    departments: [
      {
        id: 701,
        name: "English Literature",
        semesters: generateSemesters("ENG", 10501, 3301, 4301, 6, 35), // ~210 students
      },
      {
        id: 702,
        name: "History",
        semesters: generateSemesters("HIST", 10711, 3401, 4401, 6, 40), // ~240 students
      },
    ],
  },
];
