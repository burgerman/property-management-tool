# Property Management Building Visualization Tool

A lightweight, high-performance web application designed for property managers to visually inspect suite occupancy, drill down into room statuses, view dynamic tenant profile attributes, and monitor building analytics for residential towers (Floors 3–21).

![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.1-purple) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-cyan)

---

## 🌟 Key Features

- 🏢 **Building Layout Elevation View (Floors 3–21)**: Scrollable vertical 2D building elevation displaying all 114 suites and 456 rooms with color-coded occupancy statuses.
- 🎨 **Occupancy Status Color Coding**:
  - 🔴 **Vacant (Red)**: Suites with 0 occupied or secured rooms.
  - 🟡 **Occupied (Yellow)**: Suites with active resident tenants.
  - 🟢 **Secured (Green)**: Leases signed prior to tenant move-in.
- 📁 **Excel Data Source Upload & Refresh**: Upload custom `.xlsx`, `.xls`, or `.csv` workbooks using SheetJS (`xlsx`). Drag & drop uploader with column validation and live raw dataset preview.
- ⚡ **Dynamic Column Mapping**: Tenant profile views automatically map and render **all workbook columns & custom attributes** dynamically without hardcoded field limitations.
- 📊 **Dedicated Statistics & Analytics Dashboard**: Detailed metrics for unit counts (vacant vs occupied vs secured), financial summaries, suite layout breakdowns (5-Bed, 4-Bed, 3-Bed), and floor-by-floor breakdown tables.
- 📥 **Sample Excel Export**: One-click download of a pre-populated sample `.xlsx` workbook (`building_tenants_test_data.xlsx`).

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom Glassmorphism
- **Excel Processing**: SheetJS (`xlsx`)
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) installed.

### 2. Installation
```bash
# Clone repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd management_tool

# Install dependencies
npm install
```

### 3. Development Server
Start the local development server:
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📄 Data Schema Format

The application parses unit numbers automatically from the **Unit** column (format `SSRR-B` or `FSSR-B` e.g. `0301-1` or `2106-5`).

| Column | Description | Example |
| :--- | :--- | :--- |
| **Unit** | Room identifier | `0301-1`, `2106-5` |
| **Tenant ID** | Tenant reference code | `T100245` |
| **Name** | Tenant full name | `John Smith` |
| **Email** | Contact email | `john@email.com` |
| **Phone** | Contact phone | `555-123-4567` |
| **Rent** | Monthly rent | `950` |
| **Status** | Move-in status | `Occupied`, `Secured` |
| **Custom Columns** | Any extra workbook fields | `Parking Spot`, `Pet Info`, etc. |

---

## 📄 License
MIT License
