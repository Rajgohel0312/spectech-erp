// Common helpers for Finance module

export const getSemesterFromRoll = (rollNo = "") => {
  // Expect formats like "CSE1-001", "ME6-045"
  const m = rollNo.match(/^[A-Za-z]+(\d+)-/);
  const s = m ? parseInt(m[1], 10) : 1;
  return isNaN(s) ? 1 : s;
};

export const groupByHierarchy = (feeRecords = []) => {
  // college -> dept -> sem -> [records]
  const grouped = {};
  feeRecords.forEach((r) => {
    const sem = getSemesterFromRoll(r.studentId);
    grouped[r.collegeName] = grouped[r.collegeName] || {};
    grouped[r.collegeName][r.deptName] = grouped[r.collegeName][r.deptName] || {};
    grouped[r.collegeName][r.deptName][`Semester ${sem}`] =
      grouped[r.collegeName][r.deptName][`Semester ${sem}`] || [];
    grouped[r.collegeName][r.deptName][`Semester ${sem}`].push(r);
  });
  return grouped;
};

export const calcTotals = (list = []) => {
  const total = list.reduce((a, b) => a + (b.totalFee || 0), 0);
  const collected = list.reduce((a, b) => a + (b.paid || 0), 0);
  const pending = list.reduce((a, b) => a + (b.pending || 0), 0);
  return { total, collected, pending };
};

export const uniq = (arr) => [...new Set(arr)];

export const toCSV = (rows, headers) => {
  const head = headers.join(",");
  const body = rows
    .map((r) =>
      headers
        .map((h) => {
          const v = r[h] ?? "";
          const s = String(v).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(",")
    )
    .join("\n");
  return `${head}\n${body}`;
};

export const downloadCSV = (filename, csv) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
