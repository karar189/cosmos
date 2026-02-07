# CORE3 Platform

The main CORE3 platform application - currently in active development.

**Status:** 🚧 Under Construction

## Overview

CORE3 Platform is where users interact with the Probability of Loss (PoL) metric, view project rankings, manage workspaces, and access regulatory tools.

### Current State

- ✅ Basic Next.js 14 App Router setup
- ✅ Theme integration from `@core3/ui-components`
- ✅ Under construction page
- ✅ 404 page (styled like landing page)
- 🚧 Main features in development

## Preliminary Page Structure

> **Note:** This structure is in progress and subject to change based on scoping.

```
app/
├── (rankings)/                   # Public rankings and scores
│   ├── (projects)/              # Project rankings
│   │   ├── page.tsx             # Projects list/grid
│   │   └── [projectId]/
│   │       └── page.tsx         # Individual project PoL profile
│   └── (exchanges)/             # Exchange rankings
│       ├── page.tsx             # Exchanges list/grid
│       └── [exchangeId]/
│           └── page.tsx         # Exchange PoL profile
│
├── (workspaces)/                # Authenticated workspaces
│   ├── (regulator)/             # Regulator workspace
│   │   ├── dashboard/
│   │   ├── oversight/
│   │   └── reports/
│   ├── (project)/               # Project owner workspace
│   │   ├── dashboard/
│   │   ├── pol-score/
│   │   ├── improvements/
│   │   └── verification/
│   ├── (exchange)/              # Exchange workspace
│   │   ├── dashboard/
│   │   ├── listings/
│   │   └── compliance/
│   ├── (investor)/              # Investor workspace
│   │   ├── portfolio/
│   │   ├── watchlist/
│   │   └── alerts/
│   └── (researcher)/            # Researcher workspace
│       ├── data/
│       ├── analytics/
│       └── export/
│
├── (authorization)/             # Auth pages
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── verify-email/
│
├── (settings)/                  # User/org settings
│   ├── profile/
│   ├── organization/
│   ├── billing/
│   └── api-keys/
│
├── layout.tsx                   # Root layout
├── not-found.tsx                # 404 page
└── (main-page)/                 # Coming soon page
    └── page.tsx
```

## Quick Start

```bash
# Development
pnpm dev:platform
# → http://localhost:3001

# Build
pnpm --filter @core3/platform build

# Type check
pnpm --filter @core3/platform typecheck
```

## Current Features

### Under Construction Page

**Route:** `/` (main-page)

Matches landing page 404 styling:
- CORE3 logo
- "CORE3 Platform" heading
- "Coming Soon" message
- "GO TO HOMEPAGE" button
- Same gradient background and animations

### 404 Page

**Route:** `/not-found`

Identical to landing page 404:
- "Signal lost, trust intact"
- Full animation and styling
- Links back to homepage

## Configuration

### Local Config

Platform has app-specific config:

```
.eslintrc.cjs              # ESLint config (at app root)
```

**ESLint:** `.eslintrc.cjs` at app root, can be customized for platform-specific rules

## Component Organization

### Shared Components

Uses components from `@core3/ui-components`:

```typescript
import { 
  ThemeRegistry,     // Theme wrapper
  Core3Button,       // Primary button
  BaseModal,         // Modals
  DataTable,         // Data tables
  // ... more as needed
} from '@core3/ui-components';
```

### Platform Components Structure

```
src/components/
├── layouts/              # Page layout components
│   ├── PlatformLayout/   # Main platform wrapper (header/footer)
│   ├── WorkspaceLayout/  # Workspace page layout
│   ├── ExchangeLayout/   # Exchange details layout
│   ├── ProjectLayout/    # Project details layout
│   └── AuthLayout/       # Authentication pages layout
├── common/               # Common/shared UI components
│   ├── PlatformSearch/   # Global search component
│   ├── SearchModal/      # Search modal dialog
│   ├── BadgeRankScore/   # Score/rank badge display
│   ├── Sidebar/          # Shared sidebar components
│   ├── ExampleLabel/     # Example/demo labels
│   └── SocialFraudInfo/  # Social fraud information
├── workspaces/           # Workspace-specific components
│   └── WorkspaceSidebar/ # Workspace navigation sidebar
├── exchanges/            # Exchange-specific components
│   ├── ExchangeRatingsTable/
│   ├── ExchangeSidebar/
│   └── ExchangesRatingCard/
├── projects/             # Project-specific components
│   ├── ProjectRatingsTable/
│   ├── ProjectSidebar/
│   └── ProjectsPolCard/
├── charts/               # Chart components
│   ├── PriceChart/
│   ├── PolCategoriesChart/
│   └── TVLChart/
└── forms/                # Form components
    ├── Login/
    ├── Signup/
    └── AccessForm/
```

### Import Examples

```typescript
// Layouts
import { PlatformLayout } from '@/components/layouts/PlatformLayout';
import { ExchangeLayout } from '@/components/layouts/ExchangeLayout';

// Common components  
import { PlatformSearch } from '@/components/common/PlatformSearch';
import { BadgeRankScore } from '@/components/common/BadgeRankScore';

// Domain-specific
import { ExchangeRatingsTable } from '@/components/exchanges/ExchangeRatingsTable';
import { ProjectRatingsTable } from '@/components/projects/ProjectRatingsTable';
import { WorkspaceSidebar } from '@/components/workspaces/WorkspaceSidebar';
```

## Adding New Pages

### 1. Create Route Group (if needed)

```bash
mkdir -p app/\(new-route\)
```

### 2. Create Page

```bash
touch app/\(new-route\)/page.tsx
touch app/\(new-route\)/page.styles.ts
```

### 3. Page Template

```typescript
// page.tsx
/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import { Typography } from '@mui/material';
import { Core3Button } from '@core3/ui-components';
import * as styles from './page.styles';

export default function NewPage() {
  return (
    <div css={styles.container}>
      <Typography variant="h1">Page Title</Typography>
      <Core3Button>Action</Core3Button>
    </div>
  );
}
```

```typescript
// page.styles.ts
import { css } from '@emotion/react';
import { spacing, flex } from '@core3/ui-components/styleSystem';

export const container = css`
  ${flex.column}
  ${spacing.padding.xl}
`;
```

### 4. Add Layout (if needed)

```typescript
// layout.tsx
export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>{/* Navigation */}</nav>
      <main>{children}</main>
    </div>
  );
}
```

## Planned Features

### Rankings Pages

**Projects:**
- List view with sortable PoL scores
- Filter by category, risk level
- Search functionality
- Project detail pages with full PoL breakdown

**Exchanges:**
- Exchange rankings
- Trust scores
- Listing quality metrics
- Historical data

### Workspace Features

Each workspace type will have role-specific features:

**Regulator:**
- Industry oversight dashboard
- Regulatory compliance tracking
- Report generation

**Project:**
- PoL score management
- Improvement recommendations
- Verification status
- Data submission

**Exchange:**
- Listing evaluation
- Compliance dashboard
- Risk monitoring

**Investor:**
- Portfolio tracking
- Risk alerts
- Due diligence tools

**Researcher:**
- Data access
- Analytics tools
- Export capabilities

### Authentication

- Email/password login
- Multi-factor authentication (MFA)
- Role-based access control (RBAC)
- Organization management
- Session management

### Settings

- User profile
- Organization settings
- Billing & subscriptions
- API key management
- Notification preferences

## Data Fetching

**Pattern:** TanStack React Query

```typescript
// Example: Fetch project data
import { useQuery } from '@tanstack/react-query';

function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id),
  });
}
```

## Forms

**Pattern:** TanStack Form + Zod

```typescript
import { useForm } from '@tanstack/react-form';
import { mySchema } from '@/lib/validators';

const form = useForm({
  defaultValues,
  onSubmit: async ({ value }) => await submit(value),
  validators: { onChange: mySchema },
});
```

See [Forms Guide](../../docs/FORMS.md) for patterns.

## Styling

### Using styleSystem

```typescript
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { spacing, colors, flex } from '@core3/ui-components/styleSystem';

const styles = {
  container: css`
    ${flex.column}
    ${spacing.padding.xl}
    background: ${colors.background.paper};
  `,
};
```

### Component Structure

```
components/
└── FeatureName/
    ├── FeatureName.tsx          # Component
    ├── FeatureName.styles.ts    # Styles
    └── index.ts                 # Export
```

## Charts & Tables

> 🚧 **Library selection in progress**

Planned libraries under evaluation:
- Charts: TBD
- Tables: TBD

## Authentication Flow (Planned)

```typescript
// Middleware for protected routes
export function middleware(request: NextRequest) {
  const token = request.cookies.get('session');
  
  if (!token && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/workspaces/:path*',
    '/settings/:path*',
  ],
};
```

## Environment Variables (Future)

```bash
# API
NEXT_PUBLIC_API_URL=https://api.core3.io

# Auth
NEXT_PUBLIC_AUTH_DOMAIN=auth.core3.io
NEXTAUTH_SECRET=your_secret

# Features
NEXT_PUBLIC_ENABLE_WORKSPACES=true
```

## Development Guidelines

### Route Groups

Use route groups `(name)` for:
- Organizing routes without affecting URL
- Sharing layouts
- Logical separation

**Examples:**
- `(rankings)` - Public rankings pages
- `(workspaces)` - Authenticated workspace pages
- `(authorization)` - Auth pages

### Component Reusability

Before creating a component:

1. Check if it exists in `@core3/ui-components`
2. Check if similar component can be extended
3. If truly app-specific, create in `src/components/`
4. If reusable, add to `ui-components` package

### State Management

- **Server state** - TanStack React Query
- **Form state** - TanStack Form  
- **UI state** - React useState/useReducer
- **Global state** - React Context (if needed)

## Testing (Future)

### E2E Tests

```
tests/e2e/
├── auth/
│   ├── login.spec.ts
│   └── register.spec.ts
├── rankings/
│   └── projects.spec.ts
├── workspaces/
│   └── project-dashboard.spec.ts
└── settings/
    └── profile.spec.ts
```

### Component Tests

All components should have Storybook stories for visual testing.

## Deployment (Future)

Deployment will be configured similar to landing page:

```
Dockerfile → Docker build → GCR → GKE → Ingress
```

**Planned URL:** `https://platform.core3.io` or `https://app.core3.io`

## Next Steps

1. **Design System** - Finalize UI components
2. **API Integration** - Connect to backend APIs
3. **Authentication** - Implement auth flow
4. **Rankings Pages** - Build project/exchange rankings
5. **Workspaces** - Develop role-specific dashboards
6. **Testing** - E2E tests for critical flows
7. **Deployment** - Production deployment pipeline

---

**Status Updates:** This README will be updated as features are implemented.

