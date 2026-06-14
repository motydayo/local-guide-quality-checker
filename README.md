# Local Guide Quality Checker

A small, privacy-safe web application for checking local directory records
before publication.

[Open the live demo](https://motydayo.github.io/local-guide-quality-checker/)

The demo turns a practical editorial rule into testable code:

> Unverified or incomplete records stay as drafts.

All names, addresses, and URLs in the interface are fictional examples. No
production data or credentials are included.

## Features

- Scores records for completeness
- Blocks publication when review is unfinished
- Adds stronger checks for sensitive categories
- Separates business rules from browser rendering
- Includes automated tests with Node's built-in test runner
- Uses no runtime dependencies or build step

## Run locally

Any static file server will work:

```bash
npx serve .
```

Then open the local URL printed in the terminal.

## Test

```bash
npm test
```

## Project structure

```text
.
├── index.html        # Accessible page structure
├── styles.css        # Responsive editorial interface
├── app.js            # Demo state and DOM rendering
├── quality.js        # Pure publication rules
└── quality.test.js   # Automated rule tests
```

## Publication rules

A record is ready only when:

1. Every required field is present.
2. The official URL is valid.
3. Editorial review is marked complete.
4. Sensitive categories have an additional verification.

Sensitive categories in this demo are medical, childcare, legal, financial,
care, and funeral information.

## Privacy and data policy

This repository intentionally contains no real directory dataset. Real-world
local information changes frequently and should be checked against official
sources immediately before publication.

## License

[MIT](./LICENSE)
