export function seedAttendance() {
  const sampleRecords = [
    {
      id: 1,
      faculty: "Dr. Patel",
      course: { code: "CSE101", title: "Programming Fundamentals" },
      deptName: "Computer Science",
      semName: "Semester 1",
      total: 60,
      presentStudents: ["CSE1-001", "CSE1-002", "CSE1-003"], // ✅ present IDs
      semStudents: [
        { id: "CSE1-001", rollNo: "CSE1-001", name: "Student 1" },
        { id: "CSE1-002", rollNo: "CSE1-002", name: "Student 2" },
        { id: "CSE1-003", rollNo: "CSE1-003", name: "Student 3" },
        { id: "CSE1-004", rollNo: "CSE1-004", name: "Student 4" },
      ],
      date: "2025-09-25",
      time: "10:00 AM",
    },
    {
      id: 2,
      faculty: "Dr. Mehta",
      course: { code: "CSE102", title: "Data Structures" },
      deptName: "Computer Science",
      semName: "Semester 2",
      total: 60,
      presentStudents: ["CSE2-001", "CSE2-003"],
      semStudents: [
        { id: "CSE2-001", rollNo: "CSE2-001", name: "Student A" },
        { id: "CSE2-002", rollNo: "CSE2-002", name: "Student B" },
        { id: "CSE2-003", rollNo: "CSE2-003", name: "Student C" },
      ],
      date: "2025-09-26",
      time: "2:00 PM",
    },
  ];

  localStorage.setItem("attendanceRecords", JSON.stringify(sampleRecords));
  console.log("✅ Mock attendance seeded into localStorage");
}
