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

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Replace all occurrences of '/_next' with '/next' in a given file.
 * @param {string} filePath - The path of the file to update.
 */
function replaceInFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (readErr, data) => {
      if (readErr) return reject(readErr);
      const updatedData = data.replace(/\/_next/g, '/next');
      fs.writeFile(filePath, updatedData, 'utf8', (writeErr) => {
        if (writeErr) return reject(writeErr);
        resolve();
      });
    });
  });
}

/**
 * Recursively traverse a directory and process files with given extensions.
 * @param {string} dir - Directory path to traverse.
 */
async function traverseAndReplace(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await traverseAndReplace(fullPath);
    } else {
      // Process common file types that might include references.
      if (/\.(html|js|css)$/.test(entry.name)) {
        try {
          await replaceInFile(fullPath);
          console.log(`Updated: ${fullPath}`);
        } catch (err) {
          console.error(`Error updating ${fullPath}:`, err);
        }
      }
    }
  }
}

/**
 * Copies a single file from source to target.
 * @param {string} source - Source file path.
 * @param {string} target - Target file path.
 */
function copyFile(source, target) {
  return new Promise((resolve, reject) => {
    const rd = fs.createReadStream(source);
    rd.on('error', rejectCleanup);
    const wr = fs.createWriteStream(target);
    wr.on('error', rejectCleanup);
    function rejectCleanup(err) {
      console.error(`Error copying file ${source} to ${target}:`, err);
      rd.destroy();
      wr.end();
      reject(err);
    }
    wr.on('finish', resolve);
    rd.pipe(wr);
  });
}

/**
 * Recursively copies all files and folders from a source directory to a target directory.
 * @param {string} src - Source directory.
 * @param {string} dest - Target directory.
 */
async function copyDirectory(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
      console.log(`Copied ${srcPath} to ${destPath}`);
    }
  }
}

async function runPostBuild() {
  // Get the __dirname path.
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Set the directory where your static export is located.
  const exportDir = path.join(__dirname, 'out'); // Change this if your export folder is different.
  const oldFolderPath = path.join(exportDir, '_next');
  const newFolderPath = path.join(exportDir, 'next');

  // Rename the _next folder to next.
  try {
    await fs.promises.rename(oldFolderPath, newFolderPath);
    console.log(`Renamed folder: ${oldFolderPath} -> ${newFolderPath}`);
  } catch (err) {
    console.error(`Error renaming folder "${oldFolderPath}" to "${newFolderPath}":`, err);
    process.exit(1);
  }

  // Update all file references in the export directory.
  try {
    await traverseAndReplace(exportDir);
    console.log('Successfully updated file references.');
  } catch (err) {
    console.error('Error during file replacement:', err);
    process.exit(1);
  }

  // Copy web extension assets from 'webext' to 'out'
  const webextSource = path.join(__dirname, 'webext');
  try {
    await copyDirectory(webextSource, exportDir);
    console.log('Web extension assets copied successfully.');
  } catch (err) {
    console.error('Error copying web extension assets:', err);
    process.exit(1);
  }
}

runPostBuild();
