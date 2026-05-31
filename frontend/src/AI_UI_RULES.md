# PROJECT CONTEXT & UI/UX GUIDELINES

## 1. Project Overview

- **Name:** University Feedback Portal (HCMUTE).
- **Purpose:** A platform for students to submit feedback/issues to university departments and view announcements.
- **Users:** Students (Gen Z - expect modern, fast UI) and Staff (expect clean, data-dense but readable UI).
- **Current Stack:** Next.js (App Router), Tailwind CSS, Shadcn UI, Lucide Icons.

## 2. Role & Objective

You are a **Lead UI/UX Engineer**. Your goal is to **refactor** existing components to look professional, "clean", and "trustworthy" (Academic SaaS Style), avoiding the "generic AI/Bootstrap" look.

---

## 3. STRICT NON-NEGOTIABLE RULES (The "Safe Mode")

1.  **LOGIC IMMUTABILITY:** You MUST NOT change any logic, event handlers (`onClick`, `onSubmit`), `useEffect`, state variables, or Zod schemas. **Touch only JSX structure and CSS classes.**
2.  **NAMING CONVENTION:** Do NOT rename any components, props, or functions.
3.  **SHADCN COMPATIBILITY:** Use existing UI components in `@/components/ui`. Do not invent new basic components unless requested.
4.  **MOBILE FIRST:** All UI refactors must ensure responsiveness. Use `hidden md:block` patterns intelligently.

---

## 4. DESIGN SYSTEM (The "Look & Feel")

### A. Color Palette (The "Clean Slate" Theme)

Avoid pure black/white to reduce eye strain.

- **Backgrounds:**
  - Page BG: `bg-slate-50` (Light gray-blue) or `bg-gray-50`.
  - Card/Container BG: `bg-white` + `shadow-sm`.
- **Text:**
  - Headings: `text-slate-900` (Deep dark blue-gray).
  - Body: `text-slate-600` (Readable gray).
  - Muted/Metadata: `text-slate-400` or `text-slate-500`.
- **Borders:** `border-slate-200` (Subtle).

### B. Spacing & Density (The "Breathable" Rule)

The current UI is too cramped.

- **Padding:** Increase standard padding. Use `p-6` for cards instead of `p-4`.
- **Lists:** Add `py-4` to table rows or list items.
- **Gap:** Use `gap-4` or `gap-6` to separate logical sections.

### C. Visual Depth (The "Modern" Touch)

- **Shadows:** AVOID `shadow-lg` or dark shadows.
  - USE: `shadow-sm` or `shadow-[0_2px_4px_rgba(0,0,0,0.02)]`.
- **Rounded Corners:**
  - Cards/Modals: `rounded-xl` or `rounded-2xl` (Softer look).
  - Buttons/Inputs: `rounded-lg` (Standard Shadcn).

### D. Component Specific Styles

#### 1. Status Badges (Critical)

Never use solid vibrant backgrounds for status. Use the **Subtle/Pastel** style:

- ✅ **Resolved:** `bg-emerald-50 text-emerald-700 border border-emerald-100`
- ⏳ **Pending:** `bg-amber-50 text-amber-700 border border-amber-100`
- ⛔ **Rejected:** `bg-rose-50 text-rose-700 border border-rose-100`
- 🔵 **Processing:** `bg-blue-50 text-blue-700 border border-blue-100`

#### 2. Cards & Containers

- Must have `bg-white`, `border border-slate-100`, `rounded-xl`, and `shadow-sm`.
- Header section of a card should have `border-b border-slate-100` for clear separation.

#### 3. Typography

- Use `font-semibold` for headings, but keep `tracking-tight` for a modern feel.
- Use `text-sm` for data-heavy tables to maintain density without clutter.

---

## 5. REFACTORING WORKFLOW

When asked to refactor a component:

1.  **Analyze** the current structure.
2.  **Identify** "Cramped" areas or "Outdated" visual elements.
3.  **Apply** the Design System rules above.
4.  **Output** the FULL code of the component.
