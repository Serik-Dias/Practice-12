# Smart Campus · Practice 12 — Code-based vs low-code

**Student:** Serik Dias · **ID:** 24B032021

The same Room Availability Checker built two ways and tested with the same eight cases:

- **Code-based** (this repository): React + Vite, rules in JavaScript, tests with Vitest.
- **Low-code**: Appsmith (free cloud plan), the same fixture, rules and messages in a JS object. See `REPORT.md` and `evidence/low-code/`.

## Run the code-based version

Node.js 20.19 or newer, from the repository root:

```sh
npm ci
npm run lint
npm test        # 51 tests
npm run build
npm run dev
```

On Windows PowerShell use `npm.cmd` if scripts are blocked.

## Contents

- `REPORT.md` — shared contract, eight-case test table for both versions, comparison matrix, security checklist, AI-use reflection
- `src/contract.js` — shared fixture, messages and test cases T1–T8
- `src/validation.js`, `src/availability.js`, `src/App.jsx` — validation, decision and display layers
- `evidence/` — baseline screenshot, browser screenshots, logs, low-code JS object and screenshots
