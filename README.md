<p align="center">
  <img src="https://res.cloudinary.com/dpv8uxc8p/image/upload/v1757764420/logo_znzxkr.png" alt="College ERP Logo" width="170"/>
</p>

<div align="center">

# 🎓 College ERP System

_A modern ERP solution for digitalizing college operations._

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![License](https://img.shields.io/badge/License-Proprietary-red)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb?logo=react&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Laravel-red?logo=laravel)
![Database](https://img.shields.io/badge/Database-MySQL-blue?logo=mysql)

</div>

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🗺️ Roadmap](#️-roadmap)
- [🛠️ Tech Stack](#-tech-stack)
- [🔒 License](#-license)
- [🌟 Vision](#-vision)

---

## ✨ Features

| Status          | Module                     | Key Features                                                                                                                                                          |
| --------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ Frontend     | 📦 **Store Module**         | Product Master (filters, sorting, CRUD), Issued History, **Purchase Order (auto-creation & detail entry)**. **Frontend completed, backend integration pending.**      |
| ✅ Frontend     | 👨‍🏫 **HR & Staff**           | Leave Management (Employee, Clerk, SuperClerk roles), Delegation, Half-day leaves, Auto balance deduction, Reports (Excel), Search & filters. **Frontend completed.** |
| ✅ Frontend     | 🧾 **Academic Management**   | Students (import by Clerks dept/sem wise), Courses, Exams with filters (college, department, semester), pagination & search. Role-based access (Admin, Faculty, Student). |
| ✅ Frontend     | 📊 **Attendance System**    | Faculty can mark attendance (date/time, course-wise). Records stored & optimized. Students can view their attendance %, warnings (<75%). Admin sees summaries + charts. |
| ✅ Frontend     | 💰 **Finance & Fees**       | Super Accountant Dashboard (college → dept → semester → student hierarchy), Dept-wise Accountant Dashboard, Fee Structure (per college/dept/sem), Payments (cash/online), Pending Fees, Reports (filters + search + pagination + CSV export), Student Fee & Receipt view. **Frontend completed.** |
| 🚀 In Progress  | 🔐 **Authentication**       | Role-based login system with first-time password setup. <br> - **Students**: RollNo + DOB (activation on first login). <br> - **Clerks/Faculty/Accountants**: Temp password from Admin, must reset on first login. <br> - **Super Roles**: Created directly in DB. <br> **Frontend completed, backend integration pending.** |                                                                                      |

---

## 🗺️ Roadmap

- [x] ✅ Store Module – **Frontend completed (Product Master, Issued History, PO Module UI)**
- [x] ✅ HR & Staff – **Frontend completed (Leave Management system)**
- [x] ✅ Academic Management – **Students (clerk imports), Courses, Exams (filters, pagination, role-based access)**
- [x] ✅ Attendance – **Faculty marking, student self-view, admin summaries & warnings**
- [x] ✅ Finance & Fees – **Dashboards, Structure, Payments, Pending, Reports, Student receipts (Frontend complete)**
- [ ] 🔐 Authentication & Role-based login – **Frontend completed, backend integration pending**
---

## 🛠️ Tech Stack

- ⚛️ **Frontend:** React + Vite, TailwindCSS
- 🖥️ **Backend:** Laravel (REST API)
- 🗄️ **Database:** MySQL
- 🎨 **UI Libraries:** React Icons, Headless UI, Recharts
- 📦 **Other Tools:** Papaparse (CSV import), FullCalendar, jsPDF, XLSX
- 💾 **Storage:** LocalStorage (for mock data in development)

---

## 🔒 License

This software is **proprietary** and developed by **SPEC TECH IT SOLUTIONS PVT LTD**.  
It is **not open source** and cannot be copied, modified, or distributed without prior written permission.

---

## 🌟 Vision

> ✨ _"This is not just software, it's a step towards digital transformation in education."_ 🚀
>
> The College ERP System is in **active development** and will continue to evolve with more modules and features.  
> Our goal is to build a **unified, modern, and scalable ERP platform** that empowers colleges to manage everything  
> from academics to administration with ease.

---
