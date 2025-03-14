/**
 * ==================================================
 * Copyright 2025 : The @dev-manthan-sharma/paw-ma Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ==================================================
 */

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../.');

const config = getDefaultConfig(projectRoot);

// Only list the packages within your monorepo that your app uses. No need to add anything else.
// If your monorepo tooling can give you the list of monorepo workspaces linked
// in your app workspace, you can automate this list instead of hardcoding them.
const monorepoPackages = {
  '@dev-manthan-sharma/paw-ma--core': path.resolve(monorepoRoot, 'core'),
};

// 1. Watch the local app directory, and only the shared packages (limiting the scope and speeding it up)
// Note how we change this from `monorepoRoot` to `projectRoot`. This is part of the optimization!
config.watchFolders = [projectRoot, ...Object.values(monorepoPackages)];

// Add the monorepo workspaces as `extraNodeModules` to Metro.
// If your monorepo tooling creates workspace symlinks in the `node_modules` directory,
// you can either add symlink support to Metro or set the `extraNodeModules` to avoid the symlinks.
// See: https://metrobundler.dev/docs/configuration/#extranodemodules
config.resolver.extraNodeModules = monorepoPackages;

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
