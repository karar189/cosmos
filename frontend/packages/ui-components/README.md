# @core3/ui-components

Shared component library for CORE3 applications, containing theme system, reusable components, SEO utilities, and fonts.

## 📦 What's Inside

### Theme System

- **`createTheme`** - MUI theme configuration (colors, typography, breakpoints)
- **`ThemeRegistry`** - Theme provider with Emotion cache
- **`emotionCache`** - Client-side Emotion cache setup
- **`styleSystem`** - Standardized style utilities (spacing, colors, flex, etc.)

### Components

- **`Core3Button`** - Primary button with variants (primary, secondary, animated)
- **`BaseModal`** - Generic modal with backdrop blur and animations
- **`LabelBubble`** - Pill-shaped tags/labels
- **`InfoList`** - Grid container for information items
- **`InfoListItem`** - Individual info card with count, title, description

### SEO Utilities

- **`Seo`** - SEO component wrapper
- **`defaultSEOConfig`** - Base SEO configuration
- **`organizationSchema`** - JSON-LD for organization
- **`websiteSchema`** - JSON-LD for website

### Fonts

- **`ppMori`** - PP Mori font family (headings)
- **`aeonik`** - Aeonik font family (body text)
- **`jetBrainsMono`** - JetBrains Mono font family (code)

Font files (3.8MB) stored in `public/fonts/` and symlinked to apps.

## 🚀 Usage

### Installing

```bash
# Already included if you're in the monorepo
pnpm install
```

### Importing

```typescript
// Main exports (server-safe)
import {
  ThemeRegistry,
  Seo,
  ppMori,
  aeonik,
  Core3Button,
  BaseModal,
} from '@core3/ui-components';

// styleSystem (client components only!)
import {
  spacing,
  colors,
  flex,
  typography,
} from '@core3/ui-components/styleSystem';
```

## 🎨 Storybook

View all components with live examples:

```bash
pnpm storybook
# Opens http://localhost:6006
```

**Available stories:**

- Core3Button (8 variants)
- LabelBubble (7 variants)
- BaseModal (4 variants)
- InfoListItem (6 variants)
- InfoList (4 variants)

**Total: 29 documented component variants**

## 📂 Structure

```
packages/ui-components/
├── src/
│   ├── components/           # Reusable components
│   │   ├── Button/
│   │   │   ├── Core3Button.tsx
│   │   │   ├── Core3Button.styles.ts
│   │   │   ├── Core3Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── Modal/
│   │   ├── Label/
│   │   ├── List/
│   │   └── index.ts
│   ├── theme/                # Theme system
│   │   ├── createTheme.ts
│   │   ├── ThemeRegistry.tsx
│   │   ├── styleSystem.ts
│   │   └── index.ts
│   ├── seo/                  # SEO utilities
│   │   ├── Seo.tsx
│   │   ├── next-seo.config.ts
│   │   ├── jsonld.ts
│   │   └── index.ts
│   ├── fonts/                # Font configurations
│   │   ├── fonts.ts
│   │   └── index.ts
│   ├── styleSystem.ts        # Re-export for client components
│   └── index.ts              # Main export
├── public/
│   └── fonts/                # Font files (3.8MB)
│       ├── Aeonik/
│       ├── PPMori/
│       └── JetBrainsMono/
├── .storybook/               # Storybook config
│   ├── main.ts
│   ├── preview.tsx
│   └── vite.config.ts
├── package.json
└── tsconfig.json
```

## 🔧 Adding New Components

### 1. Create Component Files

```bash
mkdir packages/ui-components/src/components/NewComponent
cd packages/ui-components/src/components/NewComponent
```

Create:

- `NewComponent.tsx`
- `NewComponent.styles.ts`
- `NewComponent.stories.tsx`
- `index.ts`

### 2. Component Template

```typescript
// NewComponent.tsx
/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import * as styles from './NewComponent.styles';

interface NewComponentProps {
  label: string;
  onClick?: () => void;
}

export default function NewComponent({ label, onClick }: NewComponentProps) {
  return (
    <div css={styles.container} onClick={onClick}>
      {label}
    </div>
  );
}
```

### 3. Styles Template

```typescript
// NewComponent.styles.ts
import { css } from '@emotion/react';
import { spacing, colors } from @core3/ui-components/styleSystem;

export const container = css`
  ${spacing.padding.m}
  background: ${colors.background.paper};
  cursor: pointer;
`;
```

### 4. Stories Template

```typescript
// NewComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import NewComponent from './NewComponent';

const meta = {
  title: 'Components/NewComponent',
  component: NewComponent,
  tags: ['autodocs'],
} satisfies Meta<typeof NewComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Click me',
  },
};
```

### 5. Export

```typescript
// index.ts
export { default as NewComponent } from './NewComponent';

// components/index.ts
export * from './NewComponent';
```

### 6. Verify

```bash
pnpm storybook              # Check component renders
pnpm typecheck              # Verify types
```

## 🎭 Storybook Configuration

### Preview Decorator

All stories are wrapped with `ThemeRegistry`:

```typescript
// .storybook/preview.tsx
decorators: [
  (Story) => (
    <ThemeRegistry>
      <Story />
    </ThemeRegistry>
  ),
],
```

This ensures all components render with CORE3 theme.

### Vite Configuration

```typescript
// .storybook/vite.config.ts
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
});
```

**Required for:**

- Emotion JSX support
- Automatic React import
- Babel transformations

## 🔤 Font System

### How Fonts Work

**Font files location:** `packages/ui-components/public/fonts/`

**Apps access via symlink:**

```bash
apps/landing-page/public/fonts → ../../../packages/ui-components/public/fonts
apps/platform/public/fonts     → ../../../packages/ui-components/public/fonts
```

**Font definitions:** `src/fonts/fonts.ts`

```typescript
import localFont from 'next/font/local';

export const ppMori = localFont({
  src: [
    { path: '../../public/fonts/PPMori/PPMori-Regular.otf', weight: '400' },
    { path: '../../public/fonts/PPMori/PPMori-SemiBold.otf', weight: '600' },
  ],
  variable: '--font-pp-mori',
  display: 'swap',
});
```

**Usage in apps:**

```typescript
import { ppMori, aeonik } from '@core3/ui-components';

<html className={`${ppMori.variable} ${aeonik.variable}`}>
```

### Adding New Fonts

1. Add font files to `public/fonts/NewFont/`
2. Define in `src/fonts/fonts.ts`
3. Export from `src/fonts/index.ts`
4. Verify symlinks exist in apps
5. Use font variable in theme or HTML

## 📤 Exports

### Main Export (`@core3/ui-components`)

Server-safe exports:

- Theme system (ThemeRegistry, createTheme)
- SEO (Seo, JSON-LD schemas)
- Fonts (ppMori, aeonik, jetBrainsMono)
- Components (Core3Button, BaseModal, etc.)

### styleSystem Export (`@core3/ui-components/styleSystem`)

Client-only exports:

- Style utilities (spacing, colors, flex, typography, etc.)

**Why separate?** Emotion's `css` uses React Context, cannot be used in Server Components.

## 🛠 Development Dependencies

This package includes:

- **Storybook** - Component documentation
- **TypeScript** - Type checking
- **Motion** - Animations
- **React, MUI, Emotion** - Required for Storybook rendering

**Note:** These are `devDependencies` in ui-components but `peerDependencies` for consuming apps.

## 🔍 Peer Dependencies

Apps using this package must install:

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "next": "^14.0.0",
    "@mui/material": "^6.0.0",
    "@emotion/react": "^11.0.0",
    "@emotion/styled": "^11.0.0",
    "@emotion/cache": "^11.0.0"
  }
}
```

## 📝 Component Guidelines

### When to Create Shared Component

Create in `ui-components` if:

- ✅ Used in 2+ places
- ✅ No app-specific business logic
- ✅ Truly reusable design
- ✅ Worth documenting for other devs

Keep in app if:

- ❌ Tightly coupled to app logic
- ❌ Unique to one feature
- ❌ Rapidly changing/experimental

### Component Checklist

New shared component must have:

- [ ] TypeScript types for all props
- [ ] Emotion styles (separate file)
- [ ] Storybook stories (all variants)
- [ ] JSDoc comments
- [ ] Accessible (ARIA, keyboard nav)
- [ ] Exported from package

---

For detailed component patterns, see [Components Guide](../docs/COMPONENTS.md).
