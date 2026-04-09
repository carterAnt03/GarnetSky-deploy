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

- Carter Antley
- Aidan McClelland
- Ayden Mathews
- Jonah Mosquera
- Jason Pope
