# Property Management Building Visualization Tool

A high-performance, single-page web application designed for property managers to visually inspect suite and room occupancy, manage building analytics, and parse Excel tenant datasets for residential towers (**Floors 3–21**).

![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.1-purple) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-cyan)

---

## 🌟 Core Features & Single-Responsibility Views

### 1. 🏢 Building Layout View
- **Vertical Building Elevation**: Scrollable 2D elevation displaying all suites and rooms across **Floors 3–21** (18 physical floors, 13th floor skipped).
- **Suite Layout Specifications**:
  - **Suites 01 & 06**: 4-Bedroom Suites (Units `01-1` to `01-4`, `06-1` to `06-4`)
  - **Suites 02 & 05**: 5-Bedroom Suites (Units `02-1` to `02-5`, `05-1` to `05-5`)
  - **Suites 03 & 04**: 3-Bedroom Suites (Units `03-1` to `03-3`, `04-1` to `04-3`)
- **Suite Detail & Tenant Modals**: Click any suite card or room dot to inspect tenant profile details, monthly rent, contact info, and lease end dates.

### 2. 🎨 Precise Unit Color Labelling Logic
The application determines room and suite occupancy color coding based on row fields:
- 🔴 **Vacant Unit (Red Color)**:
  - Triggered if `T-Code` and `Name` fields are both empty (`""`).
  - OR if the `Status` field equals `'Notice'`.
- 🟡 **Occupied Unit (Yellow Color)**:
  - Triggered if `T-Code` and `Name` fields are both present, AND `Status` equals `'Current'`.
- 🟢 **Secured Unit (Green Color)**:
  - Triggered if at least one of `T-Code` or `Name` is present, AND `Status` equals `'Future'`.

### 3. 📊 Statistics & Analytics Dashboard
- **Key Metrics Overview**: Overall occupancy rate, total monthly revenue, average rent per room (with floating-point precision e.g. `$925.50`), and building scale totals.
- **Suite Bedroom Breakdown**: Occupancy distribution across 5-Bedroom, 4-Bedroom, and 3-Bedroom layouts.
- **Floor-by-Floor Breakdown Table**: Detailed occupied, secured, and vacant room counts per floor with quick range filtering (All, Upper 15–21, Mid 9–14, Lower 3–8).
- 📄 **Downloadable PDF & Word (.doc) Report Generator**: Export selectable statistical facets into customized offline reports without needing to re-upload files or restart the app.

### 4. 📁 Excel Data Source Manager
- **Workbook Upload & Refresh**: Drag & drop uploader for `.xlsx`, `.xls`, and `.csv` files using SheetJS (`xlsx`).
- **Dynamic Attribute Mapping**: Parses all raw workbook columns and dynamic custom fields (`Parking Spot`, `Pet Info`, etc.) without hardcoded field limits.
- **Sample Excel Export**: One-click download of sample Excel workbooks pre-populated with realistic tenant data.

---

## 📄 Data Schema Format

The parser automatically extracts unit locations from the **Unit** column (format `SSRR-B` e.g. `0301-4` or `2105-5`).

| Column Header | Description | Example Value | Validation Notes |
| :--- | :--- | :--- | :--- |
| **Unit** | Room Identifier | `0301-4`, `2105-5` | Must match valid floor (3–21) and room capacity |
| **T-Code** | Tenant ID Code | `T100245` | Used as primary tenant reference identifier |
| **Name** | Tenant Full Name | `John Smith` | Full resident name |
| **Status** | Occupancy Status | `Current`, `Future`, `Notice` | Determines unit color label (Yellow / Green / Red) |
| **Rent** | Monthly Rent | `925.50` | Supports float currency values |
| **Lease Start Date** | Lease Start | `2025-09-01` | YYYY-MM-DD date string |
| **Lease End Date** | Lease End | `2026-08-31` | YYYY-MM-DD date string |
| **Custom Columns** | Dynamic Extra Fields | `Parking Slot A-12` | Mapped dynamically into tenant profile modal |

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 + TypeScript 5.2
- **Build System**: Vite 5.1
- **Styling**: Tailwind CSS + Custom Dark Glassmorphism
- **Excel Engine**: SheetJS (`xlsx`)
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) installed.

### 2. Installation
```bash
# Clone the repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd management_tool

# Install project dependencies
npm install
```

### 3. Generate Test Excel Dataset
To generate a pre-populated test Excel file (`building_tenants_test_data.xlsx`):
```bash
node generate_test_excel.js
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 📄 License
MIT License
