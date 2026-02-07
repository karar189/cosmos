# @core3/design-tokens

Placeholder package for CORE3 design tokens. This will be expanded with standardized design tokens for colors, spacing, typography, and other design primitives.

## Current State

**Status:** 🚧 Placeholder - To be implemented

Currently exports empty objects:
```typescript
export const colors = {};
export const spacing = {};
export const typography = {};
```

## Future Structure

When implemented, this package will contain:

```
packages/design-tokens/
├── src/
│   ├── colors/
│   │   ├── brand.ts          # Brand colors
│   │   ├── semantic.ts       # Semantic colors (success, error, etc.)
│   │   └── index.ts
│   ├── spacing/
│   │   ├── scales.ts         # Spacing scale (4px, 8px, 16px...)
│   │   └── index.ts
│   ├── typography/
│   │   ├── fontSizes.ts      # Font size scale
│   │   ├── lineHeights.ts    # Line height scale
│   │   ├── fontWeights.ts    # Font weight values
│   │   └── index.ts
│   ├── breakpoints/
│   │   └── index.ts          # Responsive breakpoints
│   ├── shadows/
│   │   └── index.ts          # Box shadow values
│   ├── radii/
│   │   └── index.ts          # Border radius values
│   └── index.ts              # Main export
└── README.md
```

## Planned Usage

Once populated, usage will look like:

```typescript
import { 
  colors, 
  spacing, 
  typography,
  breakpoints 
} from '@core3/design-tokens';

// In styled components
const Button = styled.button`
  background: ${colors.brand.primary};
  padding: ${spacing.m};
  font-size: ${typography.fontSize.base};
  
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing.l};
  }
`;
```

## Implementation Plan

### Phase 1: Extract from Theme

Extract current values from `ui-components/src/theme/`:
- Colors from MUI theme
- Spacing values from styleSystem
- Typography scales
- Breakpoints

### Phase 2: Define Token System

Create token hierarchy:
```typescript
// Primitive tokens
const primitiveColors = {
  green100: '#B6F0D1',
  beige100: '#FBFAF3',
  black: '#0E0E0E',
};

// Semantic tokens (reference primitives)
const semanticColors = {
  primary: primitiveColors.green100,
  background: primitiveColors.beige100,
  text: primitiveColors.black,
};

// Component tokens (reference semantic)
const buttonColors = {
  background: semanticColors.primary,
  text: semanticColors.text,
};
```

### Phase 3: Migrate Theme

Update `ui-components/src/theme/createTheme.ts` to use tokens:

```typescript
import { colors, spacing } from '@core3/design-tokens';

export const createTheme = () => createMuiTheme({
  palette: {
    primary: { main: colors.brand.primary },
    background: { default: colors.background.default },
  },
});
```

### Phase 4: Documentation

- Document all tokens in Storybook
- Create token usage guide
- Add examples for common patterns

## Why Separate Package?

- ✅ Single source of truth for design values
- ✅ Can be used independently (e.g., for design tools)
- ✅ Platform-agnostic (not tied to React/MUI)
- ✅ Easier to maintain consistency
- ✅ Can generate tokens from design tools (Figma)

## Integration with Figma

Future: Sync design tokens from Figma using Style Dictionary or similar tools.

---

**To contribute:** Wait for Phase 1 implementation, or propose token structure in team discussion.

