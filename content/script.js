import "./style.css";

const storageKey = "gc-markdown-template";
const titleId = "ctl00_ContentBody_CacheName";
const gcCodeId = "ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode";
const difficultyId = "ctl00_ContentBody_uxLegendScale";
const terrainId = "ctl00_ContentBody_Localize12";
const foundTextElementId = "ctl00_ContentBody_GeoNav_logText";

if (typeof browser === "undefined") {
    var browser = chrome;
}

/**
 * Replaces the placeholder in the text with the provided value.
 *
 * @param {string} text
 * @param {string} key
 * @param {any} value
 * @returns
 */
function replacePlaceholder(text, key, value) {
    let regex = new RegExp(String.raw`<\$\s*${key}\s*\$>`, "g");
    return text.replace(regex, value);
}

/**
 * Replaces all placeholders in the text with the provided values.
 * The placeholderValuePairs is an array of arrays where the first element is the placeholder key
 * and the second element is the value to replace it with.
 *
 * @param {(string | boolean)[][]} placeholderValuePairs
 * @param {string} text
 * @returns {string} The text with the placeholders replaced.
 */
function replacePlaceholders(placeholderValuePairs, text) {
    return placeholderValuePairs.reduce(
        (acc, [key, value]) => replacePlaceholder(acc, key, value),
        text
    );
}

/**
 * @param {string} id Id of the element to get the difficulty or terrain from.
 * @returns {string} The difficulty or terrain value.
 */
function getDifficultyOrTerrain(id) {
    return document.getElementById(id).children[0].alt.split(" ")[0];
}

function createMarkdownFile(template) {
    if (template === undefined) return "";

    const title = document.getElementById(titleId).textContent || "";
    const gcCode = document.getElementById(gcCodeId).textContent || "";
    const difficulty = getDifficultyOrTerrain(difficultyId);
    const terrain = getDifficultyOrTerrain(terrainId);
    const isSolvedValue =
        document
            .getElementById("activityBadge")
            ?.getElementsByTagName("use")[0]
            ?.getAttribute("xlink:href")
            ?.endsWith("icon-correctedcoords") || false;
    const coordinatesElement = document.getElementById("uxLatLon");
    const isSolved =
        (isSolvedValue !== undefined && isSolvedValue) ||
        coordinatesElement.classList.contains("myLatLon");
    const foundTextElement = document.getElementById(foundTextElementId);
    const isFound =
        foundTextElement !== null &&
        foundTextElement.textContent.toLowerCase() === "found it!";
    const finalCoordinates = isSolved
        ? coordinatesElement.textContent || ""
        : "";

    /**
     * @type {(string | boolean)[][]}
     */
    const placeholderValuePairs = [
        ["title", title],
        ["gcCode", gcCode],
        ["difficulty", difficulty],
        ["terrain", terrain],
        ["isSolved", isSolved],
        ["isFound", isFound],
        ["finalCoordinates", finalCoordinates],
    ];

    return replacePlaceholders(placeholderValuePairs, template);
}

/**
 * Fetches the template from the local storage, replaces the placeholders with the cache details and
 * returns the result.
 *
 * @returns {Promise<string>} The markdown file content.
 */
async function createMdFile() {
    return browser.storage.local
        .get(storageKey)
        .then((data) => createMarkdownFile(data[storageKey]))
        .catch(console.error);
}

const titleElement = document.getElementsByClassName("cacheDetailsTitle")[0];

// Copy to clipboard button
let copyToClipboardBtn = document.getElementById("copyToClipboardBtn");
if (copyToClipboardBtn === null) {
    copyToClipboardBtn = document.createElement("button");
    copyToClipboardBtn.id = "copyToClipboardBtn";
    copyToClipboardBtn.textContent = "Copy to clipboard";
    copyToClipboardBtn.classList.add("gc-md-btn");
    titleElement.appendChild(copyToClipboardBtn);
}
function copyToClipboard(event) {
    event.preventDefault();
    createMdFile().then((mdFileContent) =>
        navigator.clipboard.writeText(mdFileContent)
    );
}
copyToClipboardBtn.onclick = copyToClipboard;

// Preview button
let previewBtn = document.getElementById("previewBtn");
if (previewBtn === null) {
    previewBtn = document.createElement("button");
    previewBtn.id = "previewBtn";
    previewBtn.textContent = "Preview";
    previewBtn.classList.add("gc-md-btn");
    titleElement.appendChild(previewBtn);
}
function showPreview(event) {
    event.preventDefault();
    createMdFile().then(function (mdFileContent) {
        const content = mdFileContent === "" ? "No template found" : mdFileContent;
        alert(content);
    });
}
previewBtn.onclick = showPreview;
