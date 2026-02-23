# Open CrossFit — CLAUDE.md

## Overview
Sistema web para gestionar el Open interno de CrossFit. Registro de atletas, captura de scores, rankings automáticos y leaderboard en tiempo real.

## Stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Database:** PostgreSQL local
- **ORM:** Prisma 6
- **Auth:** NextAuth.js v4 (CredentialsProvider + bcryptjs)
- **UI:** Tailwind CSS + shadcn/ui
- **Validation:** Zod + react-hook-form

## Commands
```bash
npm run dev          # Dev server en localhost:3000
npm run build        # Build de producción
npx prisma studio    # UI para ver/editar la DB
npx prisma migrate dev --name nombre  # Crear migración
npx prisma db seed   # Ejecutar seed
npx prisma generate  # Regenerar client
```

## Project Structure
```
src/
  app/                  # Pages y API routes (App Router)
    api/                # API endpoints
    admin/              # Panel admin (protegido)
    registro/           # Registro público de atletas
    leaderboard/        # Leaderboard público + vista TV
  components/
    ui/                 # shadcn/ui components
    layout/             # Header, Footer, AdminSidebar
    landing/            # Landing page sections
    registration/       # Formulario de registro
    scores/             # Judge panel components
    leaderboard/        # Leaderboard components
    admin/              # Admin dashboard components
  lib/
    prisma.ts           # Prisma client singleton
    auth.ts             # NextAuth config (CredentialsProvider)
    utils.ts            # cn() utility (shadcn)
    score-utils.ts      # Conversión de scores
    divisions.ts        # Constantes de divisiones
    validations/        # Zod schemas
  types/                # TypeScript interfaces
  hooks/                # Custom React hooks
prisma/
  schema.prisma         # Database schema
  seed.ts               # Seed data
```

## Database Tables
- `event_config` — Configuración del evento
- `athletes` — Atletas registrados
- `wods` — Workouts del evento
- `scores` — Resultados (unique: athlete_id + wod_id)
- `admin_users` — Usuarios admin con roles

## Key Patterns
- Server Components por defecto, "use client" solo cuando necesario
- API routes en `src/app/api/*/route.ts`
- Validación con Zod en frontend Y backend
- Auth con NextAuth.js, middleware protege `/admin/*` (excepto `/admin/login`)
- Scores: raw_score (Decimal) + display_score (String) para ranking vs display
- Leaderboard: Placement points con RANK() OVER window functions

## Environment Variables
Definidas en `.env.local` (dev) — ver `.env.local` para la lista completa.
NUNCA commitear archivos .env.
