# Folder Structure Documentation

## Overview
This document describes the reorganized folder structure for the TPS Attendance React App.

## Directory Structure

```
src/
├── api/                    # API endpoints and configurations
├── assets/                 # Static assets (images, fonts, etc.)
├── components/
│   ├── common/            # Shared/reusable components
│   │   ├── Toast.tsx
│   │   └── ThemeToggle.tsx
│   ├── features/          # Feature-specific components
│   │   └── attendance/    # Attendance feature components
│   │       ├── ClockButton.tsx
│   │       ├── GreetingCard.tsx
│   │       ├── LastClockInfo.tsx
│   │       ├── LocationSelector.tsx
│   │       ├── MapView.tsx
│   │       └── StatusCard.tsx
│   ├── providers/         # React context providers
│   │   └── theme-provider.tsx
│   └── ui/               # UI primitive components (shadcn/ui)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dropdown-menu.tsx
│       ├── separator.tsx
│       └── text-generate-effect.tsx
├── context/              # React contexts
│   └── AuthProvider.tsx
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── pages/                # Page-level components
│   ├── AttendancePage.tsx
│   └── LoginPage.tsx
├── services/             # Business logic services
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Import Path Conventions

### Path Aliases
- `@/` is configured as an alias for `./src`
- All imports use the `@/` prefix for cleaner paths

### Import Examples

#### Importing Pages
```typescript
import { LoginPage } from '@/pages/LoginPage'
import { AttendancePage } from '@/pages/AttendancePage'
```

#### Importing Feature Components
```typescript
import { ClockButton } from '@/components/features/attendance/ClockButton'
import { StatusCard } from '@/components/features/attendance/StatusCard'
```

#### Importing Common Components
```typescript
import { Toast } from '@/components/common/Toast'
import { ThemeToggle } from '@/components/common/ThemeToggle'
```

#### Importing Providers
```typescript
import { ThemeProvider } from '@/components/providers/theme-provider'
```

#### Importing UI Components
```typescript
import { Card, CardContent } from '@/components/ui/card'
```

#### Importing Hooks, Context, etc.
```typescript
import { useAuth } from '@/context/AuthProvider'
import { useAttendance } from '@/hooks/useAttendance'
```

## Migration Notes

### Files Moved
1. **Pages** (src/components/ → src/pages/)
   - AttendancePage.tsx
   - LoginPage.tsx

2. **Feature Components** (src/components/ → src/components/features/attendance/)
   - ClockButton.tsx
   - StatusCard.tsx
   - LocationSelector.tsx
   - MapView.tsx
   - LastClockInfo.tsx
   - GreetingCard.tsx

3. **Common Components** (src/components/ → src/components/common/)
   - Toast.tsx
   - ThemeToggle.tsx

4. **Providers** (src/components/ → src/components/providers/)
   - theme-provider.tsx

### Files Updated
- `src/App.tsx` - Updated page imports
- `src/pages/AttendancePage.tsx` - Updated all component imports
- `src/pages/LoginPage.tsx` - Updated component imports
- `src/main.tsx` - Updated provider import

## Benefits of New Structure

1. **Scalability** - Easy to add new features under `components/features/`
2. **Maintainability** - Clear separation of concerns
3. **Discoverability** - Logical grouping makes finding files easier
4. **Team Collaboration** - Clear structure helps multiple developers work simultaneously
5. **Code Splitting** - Better support for lazy loading and code splitting

## Configuration Files

### tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### vite.config.ts
```typescript
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

## Adding New Components

### New Feature Component
When adding components for a new feature (e.g., "photos"):
1. Create directory: `src/components/features/photos/`
2. Add components to that directory
3. Import using: `import { PhotoCapture } from '@/components/features/photos/PhotoCapture'`

### New Common Component
When adding a shared/reusable component:
1. Add to: `src/components/common/`
2. Import using: `import { Modal } from '@/components/common/Modal'`

### New Page
When adding a new page:
1. Add to: `src/pages/`
2. Update routing in `src/App.tsx`
3. Import using: `import { ProfilePage } from '@/pages/ProfilePage'`

## Verification

All imports have been verified and updated. No old-style imports remain in the codebase.
