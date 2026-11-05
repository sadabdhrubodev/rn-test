const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Monorepo wiring: the app lives in apps/mobile, shared packages live in
// packages/*. Metro must watch the whole workspace so symlinked workspace
// packages resolve and rebuild on change.
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
