# User Application Blueprint

This blueprint outlines the architecture, pages, and components for the User-facing side of the application (Login, Registration, and Dashboard). It includes the "hope function" (intended purpose and functionality) of each component.

## 1. Authentication & Onboarding

### Pages
*   **`Login.tsx`**
    *   **Hope Function:** Provides a secure entry point for existing users (schools/coordinators) to access their dashboard using their credentials.
*   **`Register.tsx`**
    *   **Hope Function:** Guides new users through a multi-step onboarding process to register their school and create an account for the competition.
*   **`ForgotPassword.tsx`**
    *   **Hope Function:** Allows users who have lost their password to securely recover or reset their account access.

### Components (`/src/components/register/`)
*   **`SchoolDetails.tsx`**
    *   **Hope Function:** Captures essential information about the registering school (name, address, zone, etc.) during the onboarding process.
*   **`ProfessionalDetails.tsx`**
    *   **Hope Function:** Collects contact and professional information for the Teacher-in-Charge (TIC) or primary coordinator representing the school.
*   **`AccountSecurity.tsx`**
    *   **Hope Function:** Handles the creation of secure login credentials (email, password) to finalize the user's account setup.

---

## 2. Main User Dashboard

### Layouts
*   **`AuthLayout.tsx`**
    *   **Hope Function:** Serves as the structural wrapper for all authentication pages, providing a consistent branded background and layout.
*   **`DashboardLayout.tsx`**
    *   **Hope Function:** The main structural wrapper for the logged-in user experience. It provides the persistent sidebar navigation and top bar across all dashboard views.
*   **`LoadingScreen.tsx`**
    *   **Hope Function:** Displays a smooth, branded loading animation during initial app load or heavy route transitions to improve perceived performance.

### Pages
*   **`Dashboard.tsx`**
    *   **Hope Function:** The central hub for the user. It provides an overview of their registered contestants, quick actions, and a searchable data table of their entries.
*   **`AddContestant.tsx`**
    *   **Hope Function:** A dedicated, full-page form allowing users to register a new contestant, capturing their personal details, category, and age group (Junior, Intermediate, Senior).
*   **`Categories.tsx`**
    *   **Hope Function:** Displays all available competition categories, providing users with details on what events they can register students for.
*   **`Rules.tsx`**
    *   **Hope Function:** A comprehensive guide outlining the competition's rules, regulations, age boundaries, and downloadable guidelines.
*   **`Submissions.tsx`**
    *   **Hope Function:** Allows users to track, manage, and verify the status of their submitted contestants and competition entries.
*   **`Settings.tsx`**
    *   **Hope Function:** Provides an interface for users to update their school profile, coordinator details, and account preferences.

### Dashboard Components (`/src/components/dashboard/`)
*   **`DashboardHeader.tsx`**
    *   **Hope Function:** The top section of the dashboard containing the page title and primary call-to-action buttons (e.g., "Add Contestant", "Bulk Upload").
*   **`DashboardFilters.tsx`**
    *   **Hope Function:** Provides search bars and dropdown filters to help users quickly find specific contestants in their table.
*   **`ContestantTable.tsx`**
    *   **Hope Function:** A structured data grid that displays the list of registered contestants, their IDs, categories, and contact info.
*   **`Pagination.tsx`**
    *   **Hope Function:** Breaks down large lists of contestants into manageable pages, allowing users to navigate through their data easily.

### Rules Components (`/src/components/rules/`)
*   **`RulesHeader.tsx`**
    *   **Hope Function:** Displays the title and introductory text for the rules section.
*   **`RulesTabs.tsx`**
    *   **Hope Function:** Provides interactive tabs to let users switch between different categories of rules without leaving the page.
*   **`GeneralRules.tsx`**
    *   **Hope Function:** Renders the core, overarching rules and regulations that apply to all participants.
*   **`AgeCategories.tsx`**
    *   **Hope Function:** Visually breaks down the age groups (Junior, Intermediate, Senior) and their corresponding birth year/grade requirements.
*   **`DownloadGuidelines.tsx`**
    *   **Hope Function:** Offers quick links for users to download official rulebooks or guideline documents in PDF format.
*   **`ContactInfo.tsx`**
    *   **Hope Function:** Displays support contact details (phone numbers, emails) for users who need administrative assistance.

### Settings Components (`/src/components/settings/`)
*   **`ProfileCard.tsx`**
    *   **Hope Function:** Displays a high-level visual summary of the user's current profile and school status.
*   **`SchoolInfoForm.tsx`**
    *   **Hope Function:** A form allowing users to edit and update their registered school's details.
*   **`CoordinatorDetailsForm.tsx`**
    *   **Hope Function:** A form for updating the contact information of the primary coordinator.
*   **`TicDetailsForm.tsx`**
    *   **Hope Function:** A form specifically for managing the Teacher-in-Charge's details.
