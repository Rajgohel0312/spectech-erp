// utils/generatePOpdf.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const orgInfo = {
  name: "SPEC TECH IT SOLUTIONS",
  address: "Near Patanjali Tenament, Opp. Jalanagar Bus Stand, Anand",
  contact: "Phone: +91 9876543210 | Email: info@spectech.com",
  logo: "https://res.cloudinary.com/dpv8uxc8p/image/upload/v1757764420/logo_znzxkr.png",
};

export function generatePOpdf(po) {
  const doc = new jsPDF();

  // HEADER (Logo + Org Info)
  const logoWidth = 50;
  doc.addImage(orgInfo.logo, "PNG", 14, 10, logoWidth, 0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(orgInfo.name, 200 - 14, 20, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(orgInfo.address, 200 - 14, 26, { align: "right" });
  doc.text(orgInfo.contact, 200 - 14, 32, { align: "right" });

  doc.setDrawColor(180);
  doc.line(14, 42, 196, 42);

  // TITLE
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("PURCHASE ORDER", 105, 55, { align: "center" });

  // SUPPLIER + PO INFO
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  let y = 70;

  // Supplier Details
  doc.setFont("helvetica", "bold");
  doc.text("Supplier:", 14, y);
  doc.setFont("helvetica", "normal");
  doc.text(po.supplier || "N/A", 14, y + 6);

  if (po.supplierCompany) {
    doc.text(po.supplierCompany, 14, y + 12);
    y += 6;
  }

  if (po.supplierAddress) {
    doc.text(po.supplierAddress, 14, y + 12);
    y += 6;
  }

  if (po.hasGST && po.gstNumber) {
    doc.text(`GST No: ${po.gstNumber}`, 14, y + 12);
  }

  // PO Details on right
  doc.setFont("helvetica", "bold");
  doc.text("PO Details:", 120, 70);
  doc.setFont("helvetica", "normal");
  doc.text(`PO Number: ${po.poNumber}`, 120, 76);
  doc.text(`Date: ${po.date}`, 120, 82);
  if (po.remarks) doc.text(`Remarks: ${po.remarks}`, 120, 88);

  y += 30;

  // PRODUCTS TABLE
  const productRows = po.products.map((p, i) => [
    i + 1,
    p.name,
    p.quantityWithUnit,
  ]);

  autoTable(doc, {
    startY: y,
    head: [["#", "Product", "Quantity"]],
    body: productRows,
    styles: { fontSize: 11, cellPadding: 4 },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    theme: "grid",
  });

  // FOOTER
  const finalY = doc.lastAutoTable.finalY + 25;
  doc.setFont("helvetica", "italic");
  doc.text("Authorized Signatory", 160, finalY);
  doc.line(140, finalY - 3, 196, finalY - 3);

  // Save File
  doc.save(`${po.poNumber}.pdf`);
}
