// ========== Utilities for Academic Management ==========

// Find student with college, dept, sem info
export const getStudentData = (studentId, data) => {
  for (const college of data) {
    for (const dept of college.departments) {
      for (const sem of dept.semesters) {
        const student = sem.students.find((s) => s.id === studentId);
        if (student) {
          return { college, dept, sem, student };
        }
      }
    }
  }
  return null;
};

// Find courses taught by faculty
export const getFacultyCourses = (facultyName, data) => {
  const courses = [];
  for (const college of data) {
    for (const dept of college.departments) {
      for (const sem of dept.semesters) {
        sem.courses.forEach((c) => {
          if (c.faculty === facultyName) {
            courses.push({ college, dept, sem, course: c });
          }
        });
      }
    }
  }
  return courses;
};

// Promote all students from one semester to next
export const promoteSemester = (collegeId, deptId, semId, data) => {
  const college = data.find((c) => c.id === collegeId);
  if (!college) return;

  const dept = college.departments.find((d) => d.id === deptId);
  if (!dept) return;

  const semIndex = dept.semesters.findIndex((s) => s.id === semId);
  if (semIndex === -1 || semIndex === dept.semesters.length - 1) return;

  // Move students
  const currentSem = dept.semesters[semIndex];
  const nextSem = dept.semesters[semIndex + 1];

  nextSem.students.push(...currentSem.students);
  currentSem.students = [];
};
