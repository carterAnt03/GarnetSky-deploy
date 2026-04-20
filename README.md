# GarnetSky ☁️

This project is our starting point for the CSCE Capstone course.  
It’s a React + Vite frontend with a Node/Express backend for the GarnetSky recipe app.

## External Requirements

Install:

- Node.js LTS
- npm
- Git

Check installation:

```bash
node -v
npm -v
git --version
```

## Run locally

Frontend:

```bash
cd app
npm install
npm run dev
```

Backend:

```bash
cd server
npm install
npm run dev
```

## Database Backup

To export all database data (users, recipes, favorites) to a local JSON file:

```bash
cd server
npm run backup
```

Backup files are saved to `server/backups/backup-<timestamp>.json`.

## Testing

All automated tests live in the `tests/` directory.

- **UI / behavior tests:** `tests/ui/**/*.test.jsx`
- **Backend / unit tests:** `tests/backend/**/*.test.js`

Install test dependencies once:

```bash
cd tests
npm install
```

Run everything:

```bash
npm test
```

Run one category at a time:

```bash
npm run test:backend
npm run test:ui
```

Helpful root-level helper script:

```bash
./run-tests.sh
```


## Authors

<<<<<<< HEAD
- Carter Antley - [ctantley@email.sc.edu](mailto:ctantley@email.sc.edu)
- Aidan McClelland - ajm54@email.sc.edu
- Ayden Mathews - aydenwm@email.sc.edu
- Jonah Mosquera - mosquerj@email.sc.edu
- Jason Pope - jjpope@email.sc.edu

cd C:\Users\Owner\Desktop\GarnetSky-deploy

# Add test documentation to README
Test Coverage
We have **200+ tests** covering:
Validation schemas (40 tests)
Authentication flows (15 tests)
CRUD operations (12 tests)
Error handling (10 tests)
Pagination & sorting (10 tests)
Input sanitization (10 tests)
Security (12 tests)
Database relationships (8 tests)
Rate limiting (8 tests)
File uploads (8 tests)
Email notifications (6 tests)
Advanced search (8 tests)
Data export (5 tests)
Load testing (6 tests)
Accessibility (7 tests)
Browser compatibility (6 tests)
Input constraints (5 tests)

git add README.md
git commit -m "docs: add comprehensive test coverage documentation"
git push origin ayden-changes
=======
- Carter Antley
- Aidan McClelland
- Ayden Mathews
- Jonah Mosquera
- Jason Pope
>>>>>>> 58f3402b328c01664c8c88b8d385368d3ad663f5
