# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (HTTPS, port 8080 with hot reload)
npm run build    # Production build
npm run lint     # ESLint on src/**/*.{js,cjs,mjs,vue}
npm run format   # Prettier formatting
```

No test suite is configured.

## Environment Setup

Create a `.env` file at the project root:
```
BACK_END_BASE_URL=http://localhost:3018
CRYPTOJS_SECRETE=multi-cardapio-secret-key
PORT=3010
```

## Architecture

**MultiCardapio** is a multi-establishment restaurant management system built with:
- **Vue 3** (Composition API) + **Quasar Framework v2** (UI, routing, loading, dialogs)
- **Pinia** for state (persisted to localStorage via CryptoJS encryption)
- **Axios** for REST API calls to the backend at `BACK_END_BASE_URL`
- **Socket.IO** for real-time order updates
- **Vue I18n** (pt-BR and en-US)

### Three Distinct User Contexts

The app has three layouts corresponding to three route groups in `src/router/routes.js`:

1. **Management** (`MainLayout`) — Authenticated admin area for managing products, categories, orders, and settings
2. **Auth** (`AuthLayout`) — Login and account creation pages
3. **Public Menu** (`MenuLayout`) — Customer-facing menu pages at `/:companySlug`, no auth required

### Service Layer (`src/services/`)

All API calls go through service modules. Endpoints are centralized in `endpoints.js`. Services use the `api` axios instance from `boot/axios.js`, wrap calls in error middleware, and return `resp.data` or `resp.data.data`.

### State Management (`src/stores/`)

- `auth.js` — Auth token, user, group/workspace, and customizations (branding). All persisted state is encrypted.
- `menu.js` — Public menu store (group info, customizations, business hours)
- The axios interceptor in `boot/axios.js` automatically attaches `Authorization: Bearer {token}` from the auth store.

### Composables (`src/composables/`)

- `useOrderPolling` — Socket.IO connection, new-order events, audio notifications
- `useOrderChat` — Order-to-customer messaging
- `useConfirmDialog` — Quasar dialog wrapper returning a Promise
- `showNotify` — Toast notifications (success, error, warning, info, alert)

### Dynamic Branding

`boot/theme.js` reads active customizations from the auth store and applies CSS variables via Quasar's `setCssVar()`, enabling per-establishment branding.

### Utilities (`src/utils/`)

- `globalFunctions.js` — Date/currency formatting using pt-BR locale and `America/Sao_Paulo` timezone
- `crypto.js` — CryptoJS encrypt/decrypt used by Pinia persistence plugin
- `rulesValidate.js` — Reusable form validation rules
- `errorMiddleware.js` — Shared error handling wrapper for services
