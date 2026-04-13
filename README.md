# health-supplement-tr

TrendPulse supplement intelligence platform for real-time health trend discovery and personalized wellness recommendations.

## Stack

- **Framework:** React 18/19 + Vite
- **Styling:** Tailwind CSS + shadcn/ui (modern fork)
- **Color Space:** OkLCh
- **Backend:** Supabase (via R2 central edge functions)
- **State:** React Query + Supabase Realtime

## Design Palette

- **Primary font:** Space Grotesk + Inter
- **Brand colors:** Blue data-viz palette with trend colors
- **Border radius:** 0.875rem

## Development

```bash
bun install
bun run dev
```

Environment variables are loaded from the workspace root `.env` via Vite `envDir`.

## Shared Token Contract

This project implements the R2 shared token contract (see `../tokens/`). Semantic tokens include:
- Status colors: `--status-success`, `--status-warning`, `--status-danger`, `--status-info`
- Shadow elevation: `--shadow-xs` through `--shadow-xl`
- Glow effects: `--glow-sm`, `--glow-md`, `--glow-lg`
- Typography: `--font-heading`, `--font-body`, `--font-mono`
- Animation timing: `--duration-fast/normal/slow/slower`, `--ease-default/out`

## Architecture Notes

Domain: `smartplrx.com`. Independent Supabase project. Mirrors the same architecture as `project-darling` with centralized backend for supplement intelligence, automated daily trend updates, and AI chatbot recommendations. Uses modern fork with OkLCh for enhanced visualization.
