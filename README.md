# MeshHouse backend API server
<p align="center">
    <a href="https://github.com/longsightedfilms/meshhouse/"><img src="https://raw.githubusercontent.com/longsightedfilms/meshhouse/dev/src/assets/logo_full.svg?sanitize=true" width="600" /></a>
</p>
> Backend API server for Meshhouse service. Written on Node.js

## Install
```bash
git clone https://github.com/longsightedfilms/meshhouse-backend.git backend
cd backend
npm install
# after creating config.json
node --experimental-modules index.mjs
# or
npm run-script safestart
```

## Config
Before starting server, you need to create config.json in current directory.

Example for *config.json*:
```json
{
    "server_port": 80
}
```

## Running server
This server uses experimental syntax for import modules, so you need to pass *--experimental-modules* argument to **node**. Or you can use 'safestart' script, which does that for you:
```bash
npm run-script safestart
```

## License
Code released under [Mozilla Public License 2.0](https://github.com/longsightedfilms/meshhouse-backend/blob/master/LICENSE)