# People Hub HR Platform - Frontend Thesis Code Evidence

This document records the implemented frontend evidence for the Bachelor thesis.
It is based on the current React/Vite repository and should be kept factual.

## Project Overview

People Hub is a full-stack HR management and recruitment platform. This
repository contains the frontend application built with React, TypeScript,
Vite, React Router, TanStack Query, TanStack React Form, Valibot, Axios,
Tailwind CSS, Vitest, and React Testing Library.

The frontend supports:
- public authentication and recruitment pages;
- an HR/Admin workspace for employees, candidates, interviews, vacation,
  payroll, events, inventory, holdings, notifications, and dashboard views;
- role-aware routing for HR/Admin users and normal employee self-service;
- table search, filters, pagination, and URL state where implemented;
- file upload flows for CVs, profile images, and event media through the backend.

## Frontend Architecture

The application entry point is `src/app/router.tsx`, which defines lazy-loaded
React Router routes. Feature code is organized mainly under:
- `src/Pages`: dashboard and business modules.
- `src/features/auth`: login, reset password, auth context, and routing guards.
- `src/Components`: shared UI such as tables, drawer, modal, public navigation,
  sidebar, header, and error boundary.
- `src/Helpers`: Axios, URL/filter helpers, navigation, formatting, and table
  backend filter helpers.
- `src/hooks`: shared hooks such as `useUrlTableState`, `usePageMeta`, and
  responsive helpers.
- `src/Schemas`: Valibot schemas for form validation.
- `src/types`: shared API and table types.

Vite builds the SPA, TypeScript checks the code, and the production deployment
is configured for Vercel.

## Backend Architecture

The frontend consumes a NestJS backend deployed separately. The backend exposes
REST endpoints for authentication, users, applicants, assets, vacation, salary,
events, notifications, notes, Firebase file access, and health checks. The
frontend keeps API contracts stable and sends JWT bearer tokens through Axios
for protected requests.

## Database Model Summary

Database persistence is backend-owned through MongoDB/Mongoose. Frontend code
uses typed data shapes and response handling for users, applicants, assets,
vacations, salaries, events, notifications, and paginated responses. The
frontend does not directly access MongoDB.

## Authentication And Authorization

Authentication is implemented with:
- login page: `src/features/auth/pages/LoginPage.tsx`;
- auth context: `src/features/auth/context/AuthProvider.tsx`;
- login form hook: `src/features/auth/hooks/useLoginForm.ts`;
- protected route wrapper: `src/features/auth/routing/PrivateRoute.tsx`;
- role route wrapper: `src/features/auth/routing/RoleRoute.tsx`;
- access helpers: `src/features/auth/lib/access.ts`;
- Axios client: `src/Helpers/Axios.tsx`.

After login, the frontend stores:
- `access_token`;
- `user_role`;
- `user`.

The `AuthProvider` restores this local session, checks JWT expiry, schedules
automatic logout, clears local storage on logout, and listens for the
`auth:logout` event.

Axios adds the bearer token to protected requests. On `401` responses from
private requests, Axios dispatches `auth:logout`. Public auth requests such as
sign-in, forgot password, and reset password are excluded from that automatic
logout behavior.

## Public Routes Vs Protected Routes

Public routes in `src/app/router.tsx`:
- `/` - login;
- `/career` - public careers board;
- `/recruitment` - public applicant form;
- `/applicant/confirm` - applicant email confirmation route;
- `/forgot-password` - forgot password flow;
- `/reset-password` - reset password flow.

Protected routes are nested under `PrivateRoute`. Examples:
- `/dashboard`;
- `/employees`;
- `/profile/:id`;
- `/view/:id`;
- `/holdings`;
- `/vacation`;
- `/vacation/:id`;
- `/payroll`;
- `/payroll/user/:id`;
- `/candidates`;
- `/events`;
- `/interview`;
- `/career-posts`;
- `/historic`;
- `/inventory`.

## Role-Based Access Control

`RoleRoute` restricts HR/Admin-only routes and supports self-access routes
where appropriate. Normal users are redirected away from HR-only areas and can
use self-service views such as holdings, own vacation, own payroll, and own
profile when the route parameter matches the logged-in user.

The sidebar also hides HR/Admin workspace navigation from normal users.

## Recruitment Workflow

The public recruitment page is implemented in `src/Pages/Recruitment`. It uses
Valibot/TanStack form validation and sends applicant form data and CV upload to
the backend public applicant endpoint. The UI includes submit state handling and
clearer failure states for upload/submission errors.

## Candidate Confirmation Flow

`src/Pages/Recruitment/Component/EmailConfirmation` handles the confirmation
route used by applicant email links. The frontend reads the token from the URL
and calls the backend confirmation endpoint.

## Two-Phase Interview Scheduling And Rescheduling

Candidate and interview pages support first and second interview phases:
- candidates list: `src/Pages/Candidates/Candidates.tsx`;
- candidate detail: `src/Pages/VIewCandidats/ViewCandidats.tsx`;
- interview board: `src/Pages/Interview/Interview.tsx`;
- interview context: `src/Pages/Interview/Hook/InterviewContext.tsx`.

The candidate detail page supports interview date updates, including first and
second interview rescheduling, by reusing the applicant update endpoint.

## Interview Notes And Custom Candidate Email Flow

Candidate detail code supports notes updates and custom candidate email fields
that are sent through the applicant update flow. The backend is responsible for
persisting notes and sending email templates.

## Employee And HR Modules

Implemented HR modules include:
- dashboard: `src/Pages/Dashboard`;
- employees: `src/Pages/Employees`;
- candidate tracking: `src/Pages/Candidates` and `src/Pages/VIewCandidats`;
- interviews: `src/Pages/Interview`;
- profile: `src/Pages/Profile`.

## Vacation Module

Vacation views are implemented in `src/Pages/Vacation`. HR/Admin users can view
request lists and user leave summaries. Normal users can access their own
vacation route when permitted by `RoleRoute`.

## Payroll And Salary Module

Payroll pages are implemented in `src/Pages/Payroll`. HR/Admin users can review
payroll tables, filters, and records. Normal users can access their own payroll
route when the route parameter matches their user id.

## Events And Career Posts Module

Events are implemented in `src/Pages/Events`. Career posts reuse the career
event type and are managed through `src/Pages/Career/CareerPosts.tsx` and the
management mode in `src/Pages/Career/Career.tsx`. Public career browsing uses
the `/career` route and public career event data.

## Notifications

Notifications are implemented in `src/Pages/Notification`. The dropdown handles
loading, error/retry states, period switching, mark-read actions, mark-all-read
actions, unread counts, and navigation to relevant routes.

## File Upload And Firebase Storage

The frontend sends files to backend endpoints:
- recruitment CV upload;
- event media upload;
- profile image upload.

Firebase storage is backend-owned. The frontend does not handle Firebase
credentials.

## Forms, Validation, Tables, Filters, And URL State

Valibot and TanStack Form are used for form validation. Shared table behavior is
implemented in `src/Components/Table/Table.tsx`, with tests covering loading,
empty, pagination, reset controls, CSV export, and print/PDF behavior.

URL filter utilities are implemented in:
- `src/Helpers/urlFilters.ts`;
- `src/Helpers/tableBackendFilters.ts`;
- `src/hooks/use-url-table-state.ts`.

Implemented filters preserve relevant URL parameters such as `page`, `limit`,
`search`, `role`, `status`, `month`, `year`, `requestPage`, `requestLimit`,
`requestStatus`, `requestType`, `vacationType`, `users`, and `type`.

## Testing Strategy

Frontend tests use Vitest and React Testing Library. Covered areas include:
- auth provider and login page;
- private/role route behavior;
- Axios auth logout behavior;
- URL table state and filter helpers;
- DataTable behavior;
- recruitment form/schema behavior;
- career page behavior;
- notifications;
- holdings assign modal;
- candidate detail interview behavior;
- candidates and employees pages.

Representative test files:
- `src/features/auth/routing/PrivateRoute.test.tsx`;
- `src/features/auth/routing/RoleRoute.test.tsx`;
- `src/Helpers/Axios.test.ts`;
- `src/Components/Table/Table.test.tsx`;
- `src/Pages/Recruitment/Recruitment.test.tsx`;
- `src/Pages/VIewCandidats/ViewCandidats.test.tsx`.

## CI/CD And Deployment

The frontend deploys to Vercel. Required environment variables:
- `VITE_API_URL`;
- `VITE_GOOGLE_MAPS_API_KEY` for map features.

The GitHub Actions workflow `.github/workflows/frontend-ci.yml` runs:
- `npm ci`;
- `npm run lint`;
- `npm test`;
- `npm run build`.

## Security Considerations

Implemented frontend security-related measures:
- JWT bearer token added only through Axios for API requests;
- local session cleared on logout and private `401` responses;
- JWT expiry checked client-side for automatic logout;
- protected and role-based route wrappers;
- public auth requests excluded from automatic private-session logout;
- secrets are not stored in frontend source code.

Important limitation: the frontend currently stores JWT data in `localStorage`,
not HTTP-only cookies. The thesis should describe this accurately and may list
HTTP-only cookie auth as future work.

## Limitations And Future Improvements

Safe future improvements:
- migrate auth tokens from localStorage to HTTP-only secure cookies;
- add end-to-end browser tests for the most important HR workflows;
- add stronger accessibility audits;
- add monitoring/analytics for production errors;
- add more backend-driven filtering consistency checks;
- replace deprecated drag-and-drop dependencies in a separate controlled
  refactor.

## Important Files And Their Purpose

- `src/app/router.tsx`: route definitions, lazy loading, public/protected route
  structure.
- `src/features/auth/context/AuthProvider.tsx`: local session restore, login,
  logout, JWT expiry handling.
- `src/features/auth/routing/PrivateRoute.tsx`: authenticated layout wrapper.
- `src/features/auth/routing/RoleRoute.tsx`: role and self-access restrictions.
- `src/Helpers/Axios.tsx`: API URL, public/private Axios clients, auth header,
  401 logout handling.
- `src/Components/Table/Table.tsx`: reusable table, filters, pagination, CSV,
  print/PDF.
- `src/Pages/Dashboard/Dashboard.tsx`: HR overview, dashboard actions,
  calendar, upcoming items.
- `src/Pages/Recruitment/Recruitment.tsx`: public application form.
- `src/Pages/Career/Career.tsx`: public career board and internal career post
  management mode.
- `src/Pages/VIewCandidats/ViewCandidats.tsx`: candidate detail, notes,
  interviews, rescheduling.
- `src/Pages/Notification/Notification.tsx`: notification dropdown and actions.

## Claims To Avoid In The Thesis

Do not claim:
- that authentication uses HTTP-only cookies;
- that MFA is implemented;
- that the frontend directly stores files in Firebase;
- that every table has server-side filtering for every possible column;
- that there is complete end-to-end test coverage;
- that the system is a payroll accounting system with legal tax compliance;
- that AI features are implemented.
