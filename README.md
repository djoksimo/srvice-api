# Srvice RESTful API

The Srvice Node/Express.js Back-End API

## [Engineering Docs](https://srivce.slite.com/)

**NOTE: the Srvice API is only stable for node versions 12.x**

## Getting Started:

1. Make sure you have Node.JS v12+ installed
2. `$ npm install` in api folder
3. `$ npm run dev`

## Testing:

- `$ npm test`

### Available NPM Scripts

#### Lifecycle scripts included in srvice-api:

```
  test
    nyc --reporter=text-summary mocha src/test/index.js --timeout 10000 --exit
  posttest
    echo Srvice API passed all tests 🎉
  start
    nodemon
```

e.g `$ npm run dev`

#### Available via `npm run <script-name>`:

```
  coverage
    nyc --reporter=lcov mocha src/test/index.js --timeout 10000 --exit
  build
    pm2 start src/index.js
  lint
    npx eslint src/* --color --quiet
  gen
    node src/mock/CLIGen.js
  prettier
    prettier --config \"./.prettierrc\" --check \"./src/**/*.{ts,json}\"
  autofix  <-- use this to avoid CI errors!!!
    prettier --config "./.prettierrc" "./src/**/*.{ts,json}" --write ; eslint ./src/**/*.ts --color --quiet --fix
```

e.g `$ npm run gen`

## Main Resources

1. [Getting Started](https://github.com/srvice/srvice-api/wiki/Getting-Started)
2. [File/Folder Structure](https://github.com/srvice/srvice-api/wiki/File-&-Folder-Structure-Explanation)
3. [Srvice Git Guidelines](https://github.com/srvice/srvice-api/wiki/Srvice-Git-Guidelines)
4. [Srvice API Docs](https://github.com/srvice/srvice-api/wiki/Srvice-API-Documentation)
5. [Linting & Code Style Guidelines](https://github.com/srvice/srvice-api/wiki/Code-Style-&-Linting-Guidelines)
6. [Troubleshooting](https://github.com/srvice/srvice-api/wiki/Troubleshooting)

## Other Resources:

- [Engineering Docs](https://srivce.slite.com/)
- [Srvice StackOverflow](https://stackoverflow.com/c/srvice)
- [Google](google.com)
