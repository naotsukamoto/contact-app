# CLAUDE.md - AI Assistant Guide for contact-app

## Project Overview

**ConCon** is a contact lens inventory tracking and exchange date notification app (コンタクトレンズ交換日通知). Users track their left/right eye contact lens stock, set exchange dates, and receive daily email reminders when lenses are due for replacement. The UI is in Japanese and targets Japanese users.

## Tech Stack

- **Frontend:** React 18 + TypeScript 4.8, bootstrapped with Create React App
- **Styling:** styled-components, @mui/material (Skeleton), @emotion
- **State Management:** Recoil (global atoms), React Query 3 (server state)
- **Routing:** React Router DOM 6
- **Backend:** Firebase (Firestore, Auth, Cloud Functions, Hosting)
- **Auth Providers:** Google OAuth, Twitter OAuth
- **Scheduled Jobs:** Firebase Cloud Functions with Pub/Sub (daily email via nodemailer)
- **Date Handling:** date-fns with Japanese locale

## Project Structure

```
contact-app/
├── public/                     # Static assets, PWA manifest, login button images
├── src/
│   ├── components/
│   │   ├── atoms/              # Button, CountButton, InputDate, QuestionTooltip,
│   │   │                       #   Sentense, ToggleButton, UserName
│   │   ├── molecules/          # ExchangeDay, Inventory, SettingWithToogle, Title
│   │   ├── organisms/          # SkeletonComponent (loading placeholder)
│   │   ├── pages/              # Home, Login, Signup, Settings, Guide
│   │   ├── router/             # Router (routes), RouteAuthGuard (protected routes)
│   │   ├── styles/             # Elements (shared styled-components)
│   │   ├── templates/          # Layout (outlet wrapper)
│   │   └── theme/              # Theme configuration
│   ├── converters/             # Firestore data converters (userConverter, stockOfContactsConverter)
│   ├── grobalStates/           # Recoil atoms (userInfoAtom, contactManageTypeAtom, loadingAtom)
│   ├── types/                  # TypeScript types (UserDocument, StockOfContactsDocument)
│   ├── utils/                  # Utility functions (calcInventoryDeadline, toastFunc)
│   ├── App.tsx                 # Root: RecoilRoot + QueryClientProvider + BrowserRouter
│   ├── index.tsx               # Entry point
│   └── firebase.ts             # Firebase init, Auth, Firestore, OAuth providers
├── functions/                  # Firebase Cloud Functions (Node.js 16 backend)
│   ├── src/index.ts            # sendMail: daily Pub/Sub scheduled email notifications
│   ├── package.json            # Separate dependency tree
│   └── tsconfig.json           # ES2017 target
├── firebase.json               # Firebase hosting, functions, Firestore, emulator config
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Firestore index definitions
├── tsconfig.json               # Strict mode, ES5 target, react-jsx
└── .github/workflows/release.yml  # CI: build + deploy to Firebase on push to main
```

## Commands

### Frontend (root directory)

```bash
npm start          # Start dev server (port 3000)
npm run build      # Production build to /build
npm test           # Run tests (Jest, interactive watch mode)
npm run deploy     # Build + deploy to Firebase Hosting
```

### Cloud Functions (`functions/` directory)

```bash
npm run lint       # ESLint (JS/TS)
npm run build      # Compile TypeScript
npm run serve      # Build + start Firebase emulators (functions only)
npm run deploy     # Deploy functions to Firebase
npm run logs       # View Firebase function logs
```

### Firebase Emulators

```bash
firebase emulators:start  # Start all emulators (functions:5001, firestore:8080, hosting:5002, pubsub:8085)
```

## Architecture & Patterns

### Component Architecture (Atomic Design)

Components follow **Atomic Design** conventions:
- **atoms/** - Smallest reusable UI elements (Button, InputDate, ToggleButton)
- **molecules/** - Combinations of atoms (Inventory, ExchangeDay, Title)
- **organisms/** - Complex composed components (SkeletonComponent)
- **pages/** - Full route-level page components (Home, Login, Settings, Guide)
- **templates/** - Layout wrappers using React Router `<Outlet />`

### React Conventions

- All components are **functional** and wrapped with `memo()` for memoization
- Component type: `React.FC<Props>` with explicit props interfaces
- Hooks used: `useState`, `useEffect`, `useCallback`, `useRecoilState`, `useRecoilValue`
- Lazy loading with `React.Suspense` for Settings and Guide pages

### State Management

- **Recoil** for global client state (located in `src/grobalStates/`):
  - `userInfoAtom` - Current user info (UserDocument)
  - `contactManageTypeAtom` - 0 (unified) or 1 (separate left/right) exchange mode
  - `loadingAtom` - Global loading state
- **React Query** for Firebase/server state caching

### Firestore Data Model

```
users/{docId}
  ├── created_at: Timestamp
  ├── email: string | null
  ├── uid: string
  ├── user_name: string | null
  └── stock_of_contacts/{stockId}   (subcollection)
      ├── exchangeDay: Timestamp
      ├── exchangeDayLeft: Timestamp
      ├── exchangeDayRight: Timestamp
      ├── left_eye: number
      ├── right_eye: number
      ├── updated_at: Timestamp
      └── deadLine: Timestamp

settings/{docId}
  ├── uid: string
  └── contactManageType: number (0 | 1)
```

Firestore converters in `src/converters/` enforce type safety with `withConverter()`.

### Routing

| Path        | Component  | Auth Required | Notes                        |
|-------------|------------|---------------|------------------------------|
| `/`         | Login      | No            | OAuth sign-in (Google/Twitter) |
| `/sign_up`  | Signup     | No            | Placeholder                  |
| `/home`     | Home       | Yes           | Main inventory management    |
| `/settings` | Settings   | Yes           | Exchange date mode toggle    |
| `/guide`    | Guide      | Yes           | User instructions            |

`RouteAuthGuard` checks `onAuthStateChanged` and redirects unauthenticated users to `/`.

### Business Logic

- **Contact lens cycle:** 2-week (14-day) replacement lenses assumed
- **Deadline calculation** (`calcInventoryDeadline`): `exchangeDay + (min(left, right) - 1) * 14 days`
- **Email notifications** (`functions/src/index.ts`): Runs daily at 20:00 JST, sends reminders when exchange dates are approaching (tomorrow or sooner)

## Environment Variables

Required in `.env` (not committed to git):

```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
```

Cloud Functions email configuration (set via Firebase config or env):

```
REACT_APP_OAUTH_AUTH_TYPE
REACT_APP_OAUTH_AUTH_USER
REACT_APP_OAUTH_AUTH_CLIENT_ID
REACT_APP_OAUTH_AUTH_CLIENT_SECRET
REACT_APP_OAUTH_AUTH_REFRESH_TOKEN
```

## Testing

- **Framework:** Jest + React Testing Library
- **Setup:** `src/setupTests.ts` imports `@testing-library/jest-dom`
- **Test files:**
  - `src/utils/calcInventoryDeadline.test.ts` - Unit tests for deadline calculation
  - `src/components/molecules/Inventory.test.tsx` - Component rendering tests
- **Run:** `npm test` (interactive watch mode)

## CI/CD

GitHub Actions workflow (`.github/workflows/release.yml`):
- **Trigger:** Push to `main` branch
- **Steps:** `npm ci` -> `npm run build` -> Deploy to Firebase Hosting
- **Project ID:** `contacts-app-bb4dd`
- **Secrets:** `GITHUB_TOKEN`, `FIREBASE_SERVICE_ACCOUNT_CONTACTS_APP_BB4DD`

## Coding Conventions

- **Language:** TypeScript with strict mode enabled
- **Styling:** Prefer styled-components for component styling; MUI for complex UI elements (Skeleton)
- **Comments:** Codebase includes Japanese comments; maintain consistency when adding new comments
- **Toast notifications:** Use `toastFunc()` from `src/utils/toastFunc.ts` for user-facing messages
- **ESLint:** `react-app` + `react-app/jest` config (root); `google` + `@typescript-eslint` (functions)
- **No Prettier config** - uses CRA defaults
- **Import style:** Named exports for components (`export const ComponentName`)
