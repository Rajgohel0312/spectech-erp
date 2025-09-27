import { mockAcademicData } from "../data/mockAcademicData";
import { getSemesterFromRoll } from "./feesHelpers";

// Default structure
const DEFAULT_FEE_STRUCTURE = [
  { key: "Tuition", amount: 50000 },
  { key: "Hostel", amount: 20000 },
  { key: "Exam", amount: 2000 },
];

export const seedFees = () => {
  let allFees = [];
  let structure = {};

  mockAcademicData.forEach((college) => {
    structure[college.name] = structure[college.name] || {};

    college.departments.forEach((dept) => {
      structure[college.name][dept.name] = structure[college.name][dept.name] || {};

      dept.semesters.forEach((sem) => {
        // Seed Fee Structure per semester
        structure[college.name][dept.name][sem.name] = DEFAULT_FEE_STRUCTURE;

        // Seed Fee Records for each student
        sem.students.forEach((student) => {
          const semNo = getSemesterFromRoll(student.rollNo);

          const totalFee = DEFAULT_FEE_STRUCTURE.reduce((a, b) => a + b.amount, 0);
          const paid = Math.floor(Math.random() * (totalFee + 1));
          const pending = totalFee - paid;

          allFees.push({
            studentId: student.rollNo,
            name: student.name,
            email: student.email,
            collegeName: college.name,
            deptName: dept.name,
            semester: semNo,
            totalFee,
            paid,
            pending,
            receipts: paid
              ? [
                  {
                    id: `${student.rollNo}-${Date.now()}`,
                    date: "2025-01-15",
                    amount: paid,
                    mode: "Seed",
                    txnId: `SEED-${Math.random().toString(36).slice(2, 8)}`,
                  },
                ]
              : [],
          });
        });
      });
    });
  });

  // Save both
  localStorage.setItem("feeRecords", JSON.stringify(allFees));
  localStorage.setItem("feeStructure", JSON.stringify(structure));

  console.log("✅ Fees seeded successfully", {
    records: allFees.length,
    colleges: Object.keys(structure),
  });
};
