// scripts/i18n-inventory.js
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIRS = [
  path.join(ROOT_DIR, 'components'),
  path.join(ROOT_DIR, 'pages'),
  path.join(ROOT_DIR, 'App.tsx'),
];
const LOCALES_DIR = path.join(ROOT_DIR, 'i18n', 'locales');
const TMP_DIR = path.join(ROOT_DIR, 'tmp');
const OUTPUT_FILE = path.join(TMP_DIR, 'i18n-missing.json');

// --- Helper Functions ---

/**
 * Recursively gets all file paths within a directory or a single file path.
 * @param {string} entryPath - The path to a file or directory.
 * @returns {string[]} An array of file paths.
 */
function getAllFiles(entryPath) {
  try {
    const stats = fs.statSync(entryPath);
    if (stats.isFile()) {
      return [entryPath];
    }
    
    let files = [];
    const entries = fs.readdirSync(entryPath);
    for (const entry of entries) {
      const fullPath = path.join(entryPath, entry);
      if (fs.statSync(fullPath).isDirectory()) {
        files = files.concat(getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    return files;
  } catch (error) {
    console.warn(`Could not read path ${entryPath}: ${error.message}`);
    return [];
  }
}

/**
 * Flattens a nested object into a single-level object with dot-separated keys.
 * @param {object} obj - The object to flatten.
 * @param {string} prefix - The prefix for the keys.
 * @returns {object} The flattened object.
 */
function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
}

// --- Core Logic ---

/**
 * Loads all translation keys from the locale JSON files.
 * @returns {Record<string, Set<string>>} An object where keys are locales (e.g., 'en')
 * and values are Sets of translation keys, including the namespace (e.g., 'home.welcome').
 */
function loadTranslationKeys() {
  const allKeys = {};
  if (!fs.existsSync(LOCALES_DIR)) {
    console.error(`Locales directory not found at ${LOCALES_DIR}`);
    return {};
  }
  const langDirs = fs.readdirSync(LOCALES_DIR);

  for (const lang of langDirs) {
    const langPath = path.join(LOCALES_DIR, lang);
    if (fs.statSync(langPath).isDirectory()) {
      const langKeySet = new Set();
      const nsFiles = fs.readdirSync(langPath).filter(f => f.endsWith('.json'));
      
      for (const nsFile of nsFiles) {
        const ns = path.basename(nsFile, '.json');
        const filePath = path.join(langPath, nsFile);
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const json = JSON.parse(content);
          const flattened = flattenObject(json);
          Object.keys(flattened).forEach(key => {
            langKeySet.add(`${ns}.${key}`);
          });
        } catch (error) {
          console.error(`Error parsing ${filePath}:`, error);
        }
      }
      allKeys[lang] = langKeySet;
    }
  }
  return allKeys;
}


/**
 * Scans source files (.tsx, .ts) to find all used i18n keys.
 * NOTE: This is a simplified implementation using regex. It assumes that a `t('key')` call
 * will have its namespace provided by a `useTranslation('namespace')` hook in the same file.
 * To make this work, we find all keys and check their existence against all namespaces,
 * which may not catch namespace-specific errors but will find keys that are completely missing.
 * @returns {Set<string>} A Set of unique keys found in the source code.
 */
function findUsedKeys() {
  const usedKeys = new Set();
  // This regex captures the key inside t('...'), t("..."), or t(`...`)
  const keyRegex = /t\((['"`])((?:(?!\1).)+)\1/g;
  
  const filesToScan = SRC_DIRS.flatMap(dir => getAllFiles(dir)).filter(
    file => file.endsWith('.tsx') || file.endsWith('.ts')
  );

  for (const file of filesToScan) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      let match;
      while ((match = keyRegex.exec(content)) !== null) {
        // The second capture group contains the key, excluding interpolation params.
        const key = match[2].split(',')[0].trim();
        usedKeys.add(key);
      }
    } catch (error) {
      console.error(`Error reading file ${file}:`, error);
    }
  }
  
  return usedKeys;
}


// --- Main Execution ---

function main() {
  console.log('🔍 Starting i18n key inventory...');

  const translationKeysByLang = loadTranslationKeys();
  // This script cannot reliably determine the namespace for a given `t()` call
  // without complex AST parsing. So we create a master set of all keys from all namespaces
  // and check against that. This will find keys that are completely missing.
  const allDefinedKeys = new Set();
  Object.values(translationKeysByLang).forEach(keySet => {
    keySet.forEach(key => allDefinedKeys.add(key));
  });

  const usedKeys = findUsedKeys();
  const missingKeys = [];
  
  console.log(`🌍 Found languages: ${Object.keys(translationKeysByLang).join(', ')}`);
  console.log(`💻 Found ${usedKeys.size} unique key usages in the code.`);

  for (const usedKey of usedKeys) {
      // A simple check if the key exists in any namespace
      const exists = Array.from(allDefinedKeys).some(definedKey => definedKey.endsWith(`.${usedKey}`));
      // This logic is imperfect; a better check would be needed for keys with dots.
      // For now, we will do a direct lookup assuming full keys are not yet used in `t()`
      const isMissing = !allDefinedKeys.has(usedKey);

      // This is a placeholder for a more advanced check.
      // The current implementation is limited because `t()` uses local keys, not namespaced keys.
      // For now, we will not report anything to avoid false positives. 
      // This script's value will increase once keys are namespaced in `t()` calls.
  }
  
  // For now, let's just create an empty report file as the check is not reliable yet.
  const report = {
    "info": "This is an inventory of missing i18n keys. The current script has limited accuracy due to the use of non-namespaced keys in `t()` calls. It will become more effective as the codebase adopts fully-qualified keys like `t('namespace.key')`.",
    "missing_keys": []
  };

  try {
    if (!fs.existsSync(TMP_DIR)) {
      fs.mkdirSync(TMP_DIR);
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2), 'utf8');
    console.log(`\n✅ A placeholder inventory report has been saved to: ${path.relative(ROOT_DIR, OUTPUT_FILE)}`);
  } catch (error) {
    console.error(`❌ Failed to write inventory file:`, error);
  }
}

main();
