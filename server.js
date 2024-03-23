const express = require("express");
const fs = require("fs");
const path = require("path");
const url = require("url");
const { readdirSync, readFileSync } = fs;
const { join, parse } = path;
const { fileURLToPath } = url;

// Constants
const SERVER_PORT = process.env.PORT || 9060;
const PUBLIC_DIR = "public"
// Note: this is a fake directory path that's referenced on the frontend and used to redirect to Glitch CDN links
const ASSETS_DIR = "assets"
const ASSETS_FILE = ".glitch-assets"
// Add any files that you'd like actually served, no tricks!!
const ACTUALLY_SERVE_FILENAMES_MATCHING = ["index.html"]

/**
 * @typedef FileList
 * @type string[]
 */
/**
 * @typedef ExtensionMap
 * @type {Object.<string, string[]>}
 */

// In-memory store
/** @type FileList */
let publicFiles = undefined;
/** @type ExtensionMap */
let publicFilesByExt = undefined;

let assetFiles = undefined;
/** @type ExtensionMap */
let assetFilesByExt = undefined;

// Helper functions
function publicPath(path) {
  if (path) {
    return join(__dirname, PUBLIC_DIR, path);
  }

  return join(__dirname, PUBLIC_DIR);
}

function normalize(string) {
  return string.toLowerCase();
}

function random(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function shouldIgnore(path) {
  const { ext, base } = parse(path);
  // Ignore any directories
  if (!ext) {
    return true;
  }

  if (base === "index.html" || path === "/") {
    return true;
  }

  return false;
}

function mapFilesToExt(files) {
  const extMap = {};
  // Create a map of extensions to filenames
  files.forEach((filename) => {
    const { ext } = parse(filename);
    const e = normalize(ext);
    if (!extMap.hasOwnProperty(e)) {
      extMap[e] = [];
    }
    extMap[e].push(filename);
  });

  return extMap;
}

function listPublicFiles() {
  try {
    const publicDir = publicPath();
    const files = readdirSync(publicDir, { encoding: "utf-8", recursive: true });
    return files.filter((f) => !shouldIgnore(f));
  } catch (err) {
    console.error(`failed to list files from ${PUBLIC_DIR}:`, err)
    return []
  }
}

function listGlitchAssets() {
  const filesList = []
  try {
    const assetPath = join(__dirname, ASSETS_FILE)
    const glitchFiles = readFileSync(assetPath, { encoding: "utf-8" })
    glitchFiles.trim().split("\n").forEach((assetString) => {
      try {
        const asset = JSON.parse(assetString)
        if (asset.hasOwnProperty("name") && asset.hasOwnProperty("url")) {
          filesList.push({ name: asset.name, location: asset.url })
        }
      } catch (err) {
        console.error(`failed to parse glitch asset string "${assetString}" to json`, err)
      }
    })
  } catch (err) {
    console.error(`failed to list glitch assets from ${ASSETS_FILE}:`, err)
  }

  return filesList
}

function getRandomFile(path, list) {
  if (!list || list.length < 2) {
    return path;
  }

  const { name: oldName } = parse(path);
  let tries = 0;
  let selectedName = oldName;
  let selectedPath = path;

  while (tries <= 10 && selectedName === oldName) {
    const randomIndex = random(0, list.length - 1);
    const selectedFile = list[randomIndex];
    if (selectedFile) {
      const { name: newName } = parse(selectedFile);
      selectedName = newName;
      selectedPath = selectedFile;
    }
    tries++;
  }

  return selectedPath;
}

const app = express();

// Make my own random middlewhere
app.use("/assets", (req, res, next) => {
  const { path } = req;
  if (shouldIgnore(path)) {
    next();
    return;
  }

  const { ext, base } = parse(path);
  if (base === "cat.jpg") {
    // Set max age????
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // hardcode an asset url for right now
    res.redirect("https://cdn.glitch.global/86e4d4a9-57b9-46ac-8449-27765a6230ef/dog.jpeg?v=1707691764817")
  } else if (base === "dog.jpg")
  {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // hardcode an asset url for right now
    res.redirect("https://cdn.glitch.global/86e4d4a9-57b9-46ac-8449-27765a6230ef/cat.jpeg?v=1707691788145")
  }

  // const fileToSend = getRandomFile(
  //   decodeURI(path),
  //   publicFilesByExt[normalize(ext)]
  // );
  // res.sendFile(publicPath(fileToSend));
  return;
});

app.get("/", (req, res) => {
  res.sendFile(publicPath("index.html"));
});

app.listen(SERVER_PORT, () => {
  console.log(`* ~ * ~ * Server running on port ${SERVER_PORT} * ~ * ~ *`);
});

// ** Set up generative logic after starting app server **
// Get a list of files from public directory
publicFiles = listPublicFiles();
// Map that file list by ext type for easy access
publicFilesByExt = mapFilesToExt(publicFiles);
// Get a list of files from glitch assets
listGlitchAssets();
// Map that file list by ext type for easy access
