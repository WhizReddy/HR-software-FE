# People Hub HR Platform - Frontend Thesis Chapter Notes

These notes help connect the implemented frontend code to the English Bachelor
thesis chapters. They should be used as guidance, not copied as final thesis
text without editing.

## Chapter 1: Introduction - What The System Solves

People Hub addresses common HR process fragmentation in small organizations.
The frontend gives HR staff a single workspace for employee records, candidate
tracking, interview scheduling, leave requests, payroll review, events,
notifications, inventory, and asset holdings. It also provides public career
and recruitment pages so external applicants can submit CVs and confirm their
applications by email.

The problem statement can emphasize:
- manual HR tracking across spreadsheets, email, and disconnected tools;
- difficulty following candidate status and interview dates;
- lack of central visibility for leave, payroll records, events, and assets;
- need for role-based access between HR/Admin users and normal employees.

## Chapter 2: Theoretical Background

Relevant concepts supported by the code:
- HRIS: the system centralizes HR operations such as employee data, vacation,
  payroll review, recruitment, and asset management.
- Web applications: the frontend is a Vite SPA using React and TypeScript.
- REST APIs: Axios calls backend REST endpoints for auth, applicants, users,
  events, vacation, salary, assets, and notifications.
- RBAC: route access is controlled by `PrivateRoute`, `RoleRoute`, and role
  helpers.
- JWT: the frontend stores and sends backend-issued JWT bearer tokens.
- NoSQL: MongoDB is backend-owned; frontend code consumes document-shaped API
  responses.
- Testing: Vitest and React Testing Library validate UI and route behavior.
- CI/CD: GitHub Actions runs install, lint, tests, and build; Vercel hosts the
  frontend.

## Chapter 3: Methodology And Requirements

Functional requirements visible in the frontend:
- users can sign in and reset passwords;
- HR/Admin users can access the workspace dashboard and HR modules;
- normal users can access self-service views only where permitted;
- applicants can view public career posts and submit applications;
- applicants can confirm their application through a tokenized link;
- HR/Admin users can list candidates, view candidate details, schedule and
  reschedule interviews, update notes, and send candidate emails;
- HR/Admin users can manage vacations, payroll, events, inventory, and assets;
- users can see notifications and mark them as read.

Non-functional requirements visible in the frontend:
- responsive layouts for public and workspace pages;
- lazy route loading with a chunk-load boundary;
- URL-backed table state where implemented;
- form validation before submission;
- production build through Vite;
- automated lint and test checks.

## Chapter 4: System Architecture

Frontend:
- React 18, TypeScript, Vite;
- React Router for public and protected routes;
- shared UI components for tables, modals, drawers, navigation, and layout;
- Axios API clients;
- TanStack Query for server state where used;
- Valibot and TanStack React Form for validation.

Backend integration:
- the frontend reads `VITE_API_URL` for backend calls;
- protected requests send `Authorization: Bearer <token>`;
- public routes call public backend endpoints without requiring login;
- file uploads are submitted to backend endpoints with multipart data.

Deployment:
- frontend: Vercel;
- backend: Render;
- database and file storage are backend dependencies.

## Chapter 5: Implementation

Implemented frontend modules:
- Authentication: `src/features/auth`.
- Routing and layout: `src/app/router.tsx`, `PrivateRoute`, `RoleRoute`,
  sidebar, header, breadcrumbs.
- Dashboard: attendance, work queue, interviews, calendar, events, team preview.
- Employees: directory table, filters, profile navigation.
- Candidates: candidate table, status/phase workflows.
- View Candidate: details, interview dates, notes, candidate emails.
- Interview: interview-board workflow.
- Career: public career board and internal career-post management.
- Recruitment: public application form and CV upload.
- Vacation: HR overview and employee self-service views.
- Payroll: HR payroll tables and individual user payroll route.
- Events: event listing, create/edit, media upload, map integration.
- Notifications: dropdown, unread handling, mark read, mark all read.
- Inventory/Holdings: assets, assignment, return, self-service holdings.

## Chapter 6: Security And Testing

Security mechanisms visible in frontend code:
- route guards for authenticated sections;
- role-aware route restrictions;
- local token expiry handling;
- logout on private API `401`;
- no committed API secrets in source;
- environment variables used for API URL and Google Maps key.

Testing evidence:
- auth provider and route guard tests;
- login page tests;
- Axios auth behavior tests;
- table/filter/pagination helper tests;
- recruitment validation and page tests;
- notification behavior tests;
- holdings modal tests;
- candidate interview behavior tests;
- career page tests.

Security limitations to state honestly:
- JWT is stored in `localStorage`;
- no MFA;
- no full penetration testing evidence;
- frontend guards improve UX but backend authorization remains the real security
  boundary.

## Chapter 7: Results And Discussion

The implemented frontend demonstrates a working HR platform interface with:
- separated public and private workflows;
- HR/Admin workspace navigation;
- applicant submission and confirmation support;
- candidate/interview workflow support;
- employee self-service restrictions;
- operational dashboard and notifications;
- production build and CI checks.

Discussion should mention that the project is functional for thesis
demonstration, but production use would need more security hardening, monitoring,
audit logging, and broader end-to-end testing.

## Chapter 8: Conclusions And Future Work

The system shows how a full-stack HR platform can be built with a modern SPA
frontend and a NestJS REST backend. It centralizes core HR workflows and provides
a public recruitment entry point.

Realistic future work:
- HTTP-only cookie authentication;
- more granular permissions;
- audit logs for sensitive HR changes;
- stronger reporting/analytics;
- end-to-end tests with real browser flows;
- accessibility review;
- drag-and-drop library replacement in the interview module;
- improved production observability and error tracking.
