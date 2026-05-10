# Calcify

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Description

**Calcify** is a lightweight, single-page calculator application built with vanilla TypeScript and no runtime dependencies. It runs entirely in the browser and is served through a fast Vite development server.

The calculator supports the four fundamental arithmetic operations — addition, subtraction, multiplication, and division — as well as percentage conversion and decimal number input. Operations are evaluated lazily: the result is computed when the next operator or the equals key is pressed, which allows natural chaining of multiple calculations in sequence (e.g. `5 + 3 + 2 =` computes `5 + 3` first, then adds `2`).

Two dedicated clear keys give fine-grained control over the calculation state: `CE` (Clear Entry) resets only the current display value while preserving the pending operator and first operand, so the user can correct a mistyped number without losing the ongoing operation; `C` (Clear) performs a full reset of all internal state, returning the calculator to its initial condition.

The user interface is composed of a numeric display and a grid of buttons covering digits `0–9`, the four operators, `CE`, `C`, `=`, `%`, and a decimal point. All buttons carry descriptive ARIA labels, making the application accessible to screen readers and other assistive technologies.

Internally, the codebase follows a strict factory-function component pattern: every UI element is created by a plain function that returns a typed DOM node along with a `cleanup` method responsible for removing its event listeners. There is no global state — all calculation logic lives inside the `CalcifyPage` factory function as closed-over local variables. The project ships with a full test suite written with Jest and Testing Library, enforcing a minimum 70% coverage threshold across branches, functions, lines, and statements.

## Technologies used

1. Typescript
2. CSS3
3. HTML5
4. Vite

## Libraries used

The project has no runtime dependencies; everything below is tooling required only for local development, testing, and linting.

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
"@types/node": "^22.0.0"
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

With the stack described above in place, follow these steps to run Calcify locally:

1. Clone the repository
2. Navigate to the project folder
3. Execute: `npm install`
4. Execute: `npm run dev`

The application will open automatically at `http://localhost:3000`.

## Testing

Once the app is running locally, you can validate behavior with the bundled Jest + Testing Library suite (70% coverage threshold enforced across branches, functions, lines, and statements).

1. Navigate to the project folder
2. Execute: `npm test`

For coverage report:

```bash
npm run test:coverage
```

## Security Audit

After the test suite passes, verify that no dependency carries known vulnerabilities before considering the build ready to ship:

```bash
npm audit
```

## Known Issues

None at the moment.

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/calcify`](https://www.diegolibonati.com.ar/#/project/calcify)
