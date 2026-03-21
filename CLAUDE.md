# CLAUDE.md

Guidance for AI assistants working in this repository.

## Project

`@voxpelli/pretty-ts-errors-cli` — a Node.js CLI tool that reads raw TypeScript
compiler error messages from stdin and outputs them formatted as ANSI-coloured
text or Markdown, using `@pretty-ts-errors/formatter`.

## Fast Path

- **ESM only** — use `import` / `export`; no CommonJS
- Entry point: `cli.js`; all logic lives under `lib/`
- Output styling lives in the `codeBlockFn` callback inside `lib/action.js`, passed to
  `formatDiagnosticMessage(input, codeBlockFn)` from `@pretty-ts-errors/formatter`
- Tests use **Mocha + Chai** + **c8** and snapshot-test against `test/fixtures/output.md`
- Validate with `npm test` before finalising any change

## Commands

| Command | Purpose |
|---|---|
| `npm test` | Full verification: all checks + tests (sequential) |
| `npm run check` | All static-analysis checks in parallel |
| `npm run check:lint` | ESLint only |
| `npm run check:tsc` | TypeScript type checking (JSDoc, no emit) |
| `npm run check:type-coverage` | Type coverage — minimum 99 % |
| `npm run check:knip` | Dead-code / unused-dependency detection |
| `npm run check:installed-check` | Verify installed deps match `package.json` |
| `npm run test:mocha` | Runtime tests with c8 coverage |
| `npm run test:mocha -- --grep "pattern"` | Run a focused subset of tests |
| `npm run test-ci` | Tests only — skips static-analysis checks |
| `npm run example-ansi` | Preview ANSI-coloured output |
| `npm run example-md` | Preview Markdown output |

No lockfile is committed (`package-lock=false` in `.npmrc`).
A Husky pre-push hook runs `npm test` automatically.

## Architecture

```
cli.js          ← bin entry; error handling + exit codes
lib/
  main.js       ← orchestrates command() → action() → stdout
  command.js    ← arg parsing (peowly) + stdin reading; exports CommandInput typedef
  action.js     ← calls formatDiagnosticMessage(); codeBlockFn controls output styling
  utils/
    errors.js   ← InputError (exit 1) and ResultError (exit 2)
    pkg.js      ← reads package.json for version info
test/
  *.spec.js     ← Mocha + Chai tests
  fixtures/     ← input.txt (raw TS error) + output.md (expected Markdown snapshot)
```

Markdown output always appends a `_Generated using..._` attribution footer — intentional and tested.

## Code Style

- **Types-in-JS**: JSDoc `@typedef`, `@param {import('...')}`, and `@satisfies` — no `.ts` source files
- **neostandard** style enforced by `@voxpelli/eslint-config`
- 2-space indentation, LF line endings, UTF-8 (see `.editorconfig`)
- Extends `@voxpelli/tsconfig/node20.json`; requires Node.js `^20.9.0 || >=21.1.0`

## Guardrails

### MUST

- Keep the tool composable: stdin → stdout, stderr for errors
- Preserve exit codes: `0` success, `1` input/usage error, `2` result error
- Maintain ≥ 99 % type coverage
- Update `test/fixtures/output.md` whenever formatted output changes
- Keep docs aligned with actual script names

### ASK FIRST

- Adding or removing runtime dependencies
- Changing CLI flags, output format, or exit-code semantics
- Large restructuring of `lib/`

### NEVER

- Introduce CommonJS (`require`, `module.exports`)
- Claim a check passes without actually running it
- Commit a `package-lock.json`
