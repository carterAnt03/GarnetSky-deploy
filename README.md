# GarnetSky ☁️

This project is our starting point for the CSCE Capstone course.  
It’s a simple React + Vite app used to practice GitHub workflows, collaboration, and source control milestones. Using Node + npm cmds. 

Our team is using this repo to demonstrate:
- proper Git commits with verified emails,
- branching and pull requests,
- merge commits,
- resolving merge conflicts, and
- building/running a working app.

---

## 🚀 External Requirements

To run this app locally, install:

- [Node.js LTS](https://nodejs.org/en/)  
- Git  
- VS Code 
- use the commands "npm start, npm build, npm run" 

Check installation:
```bash
node -v
npm -v
git --version
```

---

## 🗄️ Database Backup

To export all database data (users, recipes, favorites) to a local JSON file:

```bash
cd server
npm run backup
```

Backup files are saved to `server/backups/backup-<timestamp>.json`. This folder is gitignored so backups stay local and credentials are never committed.

---

## Testing

All tests are located in the `tests/` directory:
- **UI Tests**: `tests/ui/**/*.test.jsx`
- **Backend Tests**: `tests/backend/**/*.test.js`

### Running Tests

1. Navigate to the tests directory:
```bash
cd tests
```

2. Install test dependencies:
```bash
npm install
```

3. Run all tests:
```bash
npm test
```

4. Run specific test suites:
```bash
npm run test:ui        # Run UI component tests only
npm run test:backend   # Run backend validation tests only
npm run test:ui:watch  # Run UI tests in watch mode
```

---

## Authors

- Carter Antley - [ctantley@email.sc.edu](mailto:ctantley@email.sc.edu)
- Aidan McClelland - ajm54@email.sc.edu
- Jonah Mosquera - mosquerj@email.sc.edu
- Jason Pope - jjpope@email.sc.edu
- Ayden Mathews - aydenwm@email.sc.edu