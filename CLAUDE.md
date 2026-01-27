# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 real estate portfolio website for a Dallas-Fort Worth area agent. Single-page application with client-side navigation between sections (home, about, contact).

## Development Commands

```bash
yarn dev          # Start dev server on port 3005
yarn build        # Production build
yarn start        # Start production server on port 3005
yarn lint         # Run ESLint
```

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Email:** React Email components + Resend API
- **Icons:** Iconify custom elements

## Architecture

### App Structure

- `app/page.tsx` - Main client component with all page sections and navigation logic
- `app/api/email/route.ts` - POST endpoint for contact form submission (US-only geo-blocking)
- `app/templates/InterestedCustomerEmail.tsx` - Email template using React Email

### Key Patterns

**Client-Side Navigation:** The site uses `activePage` state to switch between "home", "about", and "contact" views without page reloads. All sections exist in a single page component.

**Scroll Animations:** Uses Intersection Observer with reveal-on-scroll CSS classes (`.reveal-element`, `.reveal-stagger-*`). Custom animations defined in `globals.css` @theme block.

**Form Handling:** Two forms (hero and contact) managed via useState hooks, both POST to `/api/email` endpoint.

### Type Definitions

- `types/form.ts` - ContactForm interface
- `types/index.d.ts` - Global declarations including Iconify JSX element

## Environment Variables

Required in `.env`:
```
RESEND_API_KEY=re_xxxxx
EMAIL_RECIPIENT=email@example.com
```

## Styling

Custom color palette uses `brand-*` CSS custom properties defined in `globals.css`. Tailwind v4 theme tokens are configured in the @theme block.
