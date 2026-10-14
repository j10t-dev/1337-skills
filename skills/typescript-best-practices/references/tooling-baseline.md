# Tooling baseline

Each setting here backs a code rule. Settings without a rule behind them, such as semicolons, quotes or file-name case, are left to the project.

## Format

Choose the print width once and commit the formatter config as `.oxfmtrc.json`:

```json
{ "printWidth": 120 }
```

## Lint

`.oxlintrc.json`:

```json
{
  "rules": {
    "curly": "error",
    "typescript/explicit-function-return-type": [
      "error",
      {
        "allowExpressions": false,
        "allowTypedFunctionExpressions": false,
        "allowHigherOrderFunctions": false,
        "allowDirectConstAssertionInArrowFunctions": false
      }
    ],
    "typescript/switch-exhaustiveness-check": ["error", { "allowDefaultCaseForExhaustiveSwitch": false }]
  }
}
```

- `curly` braces every control-flow body.
- `explicit-function-return-type` makes every function and callback declare what it produces.
- `switch-exhaustiveness-check` reports a missing `case` when a variant is added, and reports a `default` arm on a switch that already covers every variant. It is type-aware: install it with `bun add -d oxlint oxlint-tsgolint` and run `oxlint --type-aware`. typescript-eslint uses the same rule name. The idiom is in `patterns.md`.

### Escape valve for return types

When the annotations on typed callbacks become noise, relax the rule with `allowTypedFunctionExpressions: true` for the whole project, in place of leaving annotations out case by case.

### Module mocking

`anti-slop/no-module-mocking` keeps mocks flowing through ports. It reports `mock`, `doMock` and `unstable_mockModule` called on Vitest's `vi` or Jest's `jest`. bun:test's `mock.module` is kept out by review, as `writing-good-tests.md` in `test-driven-development` describes.

The rule comes from https://github.com/dmmulroy/anti-slop. Its `skills/install-anti-slop/scripts/install.mjs` installer vendors the plugin into `tools/oxlint/anti-slop`; install `@oxlint/plugins` at the oxlint version, as the repository's `install-anti-slop` skill describes. Then register the plugin, keep the vendored code out of the lint run, and enable the rule, merged into the same `.oxlintrc.json`:

```json
{
  "jsPlugins": [{ "name": "anti-slop", "specifier": "./tools/oxlint/anti-slop/index.ts" }],
  "ignorePatterns": ["tools/oxlint/anti-slop/**"],
  "rules": {
    "anti-slop/no-module-mocking": "error"
  }
}
```

## Compiler

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitOverride": true,
    "verbatimModuleSyntax": true
  }
}
```

## Dead code

Run `knip`, with an empty report as a required check.

## CI

Pin tool versions. A workflow runs typecheck, lint (type-aware, so the exhaustiveness rule runs), format check and tests.
