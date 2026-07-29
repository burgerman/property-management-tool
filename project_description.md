# Property Management Building Visualization Tool (MVP)

## Overview

Build a lightweight web application that provides a visual overview of all units in a residential building.

The application allows the property management team to:

- Quickly understand the occupancy status of every suite.
- Drill down into a suite to view all rooms.
- Click a room to view the tenant's basic information.
- Refresh the data from an Excel workbook.

This is an **MVP (Minimum Viable Product)**. Focus on rapid implementation, clean architecture, and extensibility instead of production-grade features.

---

# Goals

The application should enable property managers to answer questions like:

- Which suites are vacant?
- Which suites are occupied?
- Which rooms are available?
- Who lives in a specific room?
- When does a tenant's lease expire?

The application is **read-only**.

---

# Data Source

The application uses **one Excel workbook** as its only data source.

No database is required.

Each row represents one tenant currently associated with a room.

Example schema:

| Column | Description |
|---------|-------------|
| Unit | Room identifier (e.g. `0301-1`) |
| Tenant ID | Unique tenant identifier |
| Name | Tenant name |
| Email | Email address |
| Phone | Phone number |
| Birth Year | Birth year |
| Rent | Monthly rent |
| Lease Start Date | Lease start date |
| Lease End Date | Lease end date |

Example:

| Unit | Name | Rent |
|------|------|------|
| 0301-1 | John Smith | 900 |
| 0301-2 | Alice Brown | 925 |
| 0302-1 | David Lee | 950 |

---

# Building Layout

The building contains floors **3 through 21**.

Total floors:

- 3
- 4
- ...
- 21

Each floor contains six suites.

| Suite | Bedrooms |
|--------|-----------|
| 01 | 5 |
| 02 | 4 |
| 03 | 3 |
| 04 | 3 |
| 05 | 4 |
| 06 | 5 |

Each bedroom corresponds to one rentable room.

Examples:

### Suite 0301 (5 Bedrooms)

- 0301-1
- 0301-2
- 0301-3
- 0301-4
- 0301-5

### Suite 0302 (4 Bedrooms)

- 0302-1
- 0302-2
- 0302-3
- 0302-4

### Suite 0303 (3 Bedrooms)

- 0303-1
- 0303-2
- 0303-3

---

# Occupancy Status

The application determines the status of each suite by comparing:

- Expected number of rooms
- Existing tenant records

Three statuses are supported.

## 1. Vacant (Red)

No rooms in the suite contain tenants.

Example:

Suite **0303**

```
0303-1  Empty
0303-2  Empty
0303-3  Empty
```

Display:

**Red**

---

## 2. Secured (Green)

Some rooms have signed leases but tenants have not yet moved in.

This can later be determined using a move-in status field.

Display:

**Green**

---

## 3. Occupied (Yellow)

At least one tenant is currently living in the suite.

Example:

```
0301-1 Occupied
0301-2 Occupied
0301-3 Empty
0301-4 Occupied
0301-5 Empty
```

Display:

**Yellow**

---

# User Interface

Display a simplified building view.

Example:

```
Floor 21

+-------+-------+-------+
| 2101  | 2102  | 2103  |
+-------+-------+-------+
| 2104  | 2105  | 2106  |
+-------+-------+-------+

Floor 20

+-------+-------+-------+
| 2001  | 2002  | 2003  |
+-------+-------+-------+
| 2004  | 2005  | 2006  |
+-------+-------+-------+

...
```

Requirements:

- Floors displayed vertically.
- Scrollable interface.
- Every suite rendered as a colored card.
- Color indicates suite status.

---

# Suite Details

Clicking a suite opens its details.

Example:

```
Suite 0301

Room 1   Occupied
Room 2   Occupied
Room 3   Vacant
Room 4   Occupied
Room 5   Vacant
```

Requirements:

- Every room is displayed.
- Vacant rooms are clearly indicated.
- Occupied rooms are clickable.

---

# Tenant Details

Clicking an occupied room displays the tenant information.

Example:

```
Tenant Information

Name: John Smith
Tenant ID: T100245
Email: john@email.com
Phone: 555-123-4567
Birth Year: 1998
Rent: $950
Lease Start: 2025-09-01
Lease End: 2026-08-31
```

If the room is vacant:

```
Vacant Room
```

---

# Functional Requirements

The MVP should support the following features:

- Read tenant information from an Excel workbook.
- Parse room identifiers automatically.
- Infer suite occupancy based on tenant records.
- Render every floor (3–21).
- Render every suite.
- Color-code suites.
- Open suite details on click.
- Display room occupancy.
- Display tenant details.
- Refresh data after the Excel workbook changes.

---

# Non-Functional Requirements

- Lightweight.
- Fast startup.
- Responsive UI.
- Modern appearance.
- Local execution.
- Read-only.
- No authentication.
- No database.
- Easy to maintain.
- Modular codebase.

---

# Suggested Technology Stack

## Frontend

- React
- TypeScript
- Vite

## UI

- Tailwind CSS

## Excel Parsing

- SheetJS (`xlsx`)

## State Management

- React Hooks

## Icons

- Lucide React

---

# Project Structure

```
src/
│
├── components/
│   ├── BuildingView
│   ├── FloorView
│   ├── SuiteCard
│   ├── RoomList
│   └── TenantPanel
│
├── hooks/
│
├── services/
│   └── excelParser.ts
│
├── types/
│
├── utils/
│
└── App.tsx
```

---

# MVP Scope

Implement only the following features:

- Load tenant data from an Excel workbook.
- Visualize the building layout.
- Color-code suites by occupancy status.
- View rooms within a suite.
- View tenant information for occupied rooms.
- Refresh the Excel data manually.

Do **not** implement:

- Authentication
- User management
- Databases
- Cloud storage
- Editing tenant information
- Lease management workflows
- Notifications
- Reporting
- Analytics
- Search or filtering
- Role-based permissions

Keep the implementation simple, modular, and easy to extend in future iterations.