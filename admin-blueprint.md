# Admin Application Blueprint

This blueprint outlines the architecture, pages, and components for the Administrator-facing side of the application. It includes the "hope function" (intended purpose and functionality) of each component designed to manage the overall competition.

## 1. Admin Authentication

### Pages
*   **`AdminLogin.tsx`**
    *   **Hope Function:** A highly secure, isolated login portal specifically designed for system administrators and competition organizers to access the backend management system.

---

## 2. Admin Dashboard & Management

### Layouts
*   **`AdminLayout.tsx`** (located in `/src/components/Admin/`)
    *   **Hope Function:** The structural wrapper for the admin experience. It provides a specialized sidebar and navigation tailored for administrative tools, distinct from the user dashboard.

### Pages
*   **`AdminDashboard.tsx`**
    *   **Hope Function:** The primary control center for administrators. It provides a bird's-eye view of the competition, displaying high-level statistics, recent registrations, and overall system health.
*   **`AdminContestants.tsx`**
    *   **Hope Function:** A master database view allowing admins to see, search, filter, and manage *all* contestants across *all* registered schools.
*   **`AdminCategories.tsx`**
    *   **Hope Function:** An interface for admins to manage the competition's structure. Allows them to create, edit, or remove event categories, age tiers (Junior, Intermediate, Senior), and supported languages.
*   **`AdminSchoolProfile.tsx`**
    *   **Hope Function:** A detailed, drill-down view of a specific school. Allows admins to review a school's contact info, verify their status, and see all contestants registered under that specific institution.
*   **`AdminLogs.tsx`**
    *   **Hope Function:** An audit trail and system log viewer. Allows admins to track user actions, system errors, and administrative changes for security and troubleshooting purposes.
*   **`AdminOther.tsx`**
    *   **Hope Function:** A catch-all page for miscellaneous administrative settings, global configurations, or secondary tools that don't fit into the main categories.

### Admin Components (`/src/components/Admin/`)
*   **`StatsPanel.tsx`**
    *   **Hope Function:** A visual component used on the Admin Dashboard to display key performance indicators (KPIs) such as "Total Schools Registered," "Total Contestants," and "Pending Approvals" using charts or metric cards.
*   **`SchoolsTable.tsx`**
    *   **Hope Function:** A data grid component specifically designed to list all registered schools, showing their registration status, contact person, and total number of entries, with quick actions to view their detailed profile.
*   **`ui/` (Directory)**
    *   **Hope Function:** Contains reusable, admin-specific UI elements (like specialized buttons, data tables, or modal dialogs) that maintain a consistent administrative design language, potentially distinct from the public user UI.
