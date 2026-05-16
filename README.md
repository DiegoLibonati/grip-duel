# Grip Duel

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Description

**Grip Duel** is a browser-based Rock Paper Scissors game where a single player competes against an AI opponent in real time. The game is built as a vanilla TypeScript SPA with no runtime dependencies, making it lightweight and fast to load.

The player is presented with three choices — Rock, Paper, and Scissors — displayed as clickable image buttons. Once the player selects one, the AI instantly picks its own option at random, the result is determined, and the outcome is displayed on screen: whether the player won, lost, or tied, along with both choices for full transparency. Both the player score and the AI score are tracked throughout the session and update after every round.

After each round, the game enters a short cooldown of 2.5 seconds during which the choice buttons are disabled. This prevents accidental double clicks and gives the player time to read the result before the board resets automatically. Once the cooldown ends, the result clears, the buttons re-enable, and the player is ready to throw again — no page refresh needed.

The UI is fully accessible: all interactive elements have ARIA roles, labels, and keyboard focus support, and result announcements are wired to a live region so screen readers can pick them up. The layout is clean and responsive, designed to work across desktop and mobile browsers without any framework overhead.

## Technologies used

1. Typescript
2. CSS3
3. HTML5
4. Vite

## Libraries used

The project ships with zero runtime dependencies — everything below is tooling used only during development, testing, and building.

#### Dependencies

```
No production dependencies - Pure Vanilla TypeScript
```

#### devDependencies

```
"@eslint/js": "^9.39.2"
"@testing-library/dom": "^10.4.0"
"@testing-library/jest-dom": "^6.6.3"
"@testing-library/user-event": "^14.5.2"
"@types/jest": "^30.0.0"
"@types/node": "^22.0.0",
"eslint": "^9.39.2"
"eslint-config-prettier": "^10.1.8"
"eslint-plugin-prettier": "^5.5.5"
"globals": "^17.3.0"
"husky": "^9.1.7"
"jest": "^30.3.0"
"jest-environment-jsdom": "^30.3.0"
"lint-staged": "^16.2.7"
"prettier": "^3.8.1"
"ts-jest": "^29.4.6"
"typescript": "^5.2.2"
"typescript-eslint": "^8.54.0"
"vite": "^7.1.6"
```

## Getting Started

To run the application locally:

1. Clone the repository
2. Navigate to the project folder
3. Execute: `npm install`
4. Execute: `npm run dev`

The application will open automatically at `http://localhost:3000`.

### Pre-Commit for Development

Husky + lint-staged are configured to keep the codebase consistent on every commit. Staged `*.{ts,js}` files are auto-fixed with ESLint and formatted with Prettier; `*.{json,css,md,html}` files are formatted with Prettier. The hook is installed automatically by the `prepare` script when you run `npm install`.

You can also run the underlying tools manually:

```bash
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier format
npm run format:check  # Prettier check (no writes)
npm run type-check    # TypeScript type checking only
```

## Testing

Tests are written with Jest, ts-jest and `@testing-library/dom` running on jsdom.

1. Navigate to the project folder
2. Execute: `npm test`

For watch mode and the coverage report:

```bash
npm run test:watch     # Watch mode
npm run test:coverage  # Generate coverage report
```

## Continuous Integration

The repository ships with a **GitHub Actions** pipeline defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml). It runs automatically on every `push` and `pull_request` targeting the `main` branch.

### Pipeline overview

```
                      ┌─── PR or push to main ───┐
                      ▼                          ▼
┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   lint-and-audit     │─▶│     testing      │─▶│      build       │
│  eslint · tsc check  │  │   jest (jsdom)   │  │  tsc + vite build│
└──────────────────────┘  └──────────────────┘  └──────────────────┘
```

All three jobs run on `ubuntu-latest`, install Node using the version pinned in [`.nvmrc`](.nvmrc), and reuse the npm cache via `actions/setup-node`. Each job runs `npm ci` before its specific commands.

### Validation jobs (run on every PR and push)

1. **`lint-and-audit`** — runs `npm run lint` (ESLint with the TypeScript ruleset) and `npm run type-check` (`tsc --noEmit`). This is the entry point of the pipeline; the next jobs only run if it succeeds.
2. **`testing`** — runs `npm test`, which executes the full Jest suite on `jsdom` with `ts-jest`, `@testing-library/dom` and `@testing-library/user-event`. Requires `lint-and-audit` to pass.
3. **`build`** — runs `npm run build` (`tsc` followed by `vite build`) as a smoke test that the production bundle compiles cleanly. Requires `testing` to pass.

### Running the same checks locally

You can reproduce the entire pipeline locally with the same commands the CI runs:

```bash
# lint-and-audit
npm run lint
npm run type-check

# testing
npm test

# build
npm run build
```

For a stricter, fresh-install reproduction (closer to what the runner does), use `npm ci` instead of `npm install` to install dependencies exactly as locked in `package-lock.json`.

### Where the build outputs live

| Output                                           | Location                                                              |
| ------------------------------------------------ | --------------------------------------------------------------------- |
| Validation logs (lint, type-check, tests, build) | **Actions** tab on GitHub                                             |
| Production bundle                                | Ephemeral, inside the runner (`dist/` is not uploaded as an artifact) |
| Coverage report                                  | Generated locally via `npm run test:coverage` (not produced in CI)    |

> **Note:** The current pipeline is validation-only — there are no release, tagging, or deployment jobs configured. Bumping versions, publishing to a registry, or deploying the bundle are manual steps.

## Security Audit

Once tests pass, audit the dependency tree for known vulnerabilities before building:

```bash
npm audit
```

## Build

When the codebase is clean and audited, generate the production bundle:

```bash
npm run build      # tsc + vite build → outputs to dist/
npm run preview    # Serve the built bundle locally to verify
```

## Known Issues

None at the moment.

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/grip-duel`](https://www.diegolibonati.com.ar/#/project/grip-duel)
