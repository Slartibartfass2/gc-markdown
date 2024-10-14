import "./style.css";

const storageKey = "gc-markdown-template";

function replacePlaceholder(text, key, value) {
    let regex = new RegExp(String.raw`<\$\s*${key}\s*\$>`, "g");
    return text.replace(regex, value);
}

function replacePlaceholders(placeholderValuePairs, text) {
    return placeholderValuePairs.reduce(
        (acc, [key, value]) => replacePlaceholder(acc, key, value),
        text
    );
}

function createMarkdownFile(template) {
    const title = document.getElementById(
        "ctl00_ContentBody_CacheName"
    ).innerText;
    const gcCode = document.getElementById(
        "ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode"
    ).innerText;
    const difficulty = document
        .getElementById("ctl00_ContentBody_uxLegendScale")
        .children[0].alt.split(" ")[0];
    const terrain = document
        .getElementById("ctl00_ContentBody_Localize12")
        .children[0].alt.split(" ")[0];
    const isSolvedValue = document
        .getElementById("activityBadge")
        ?.getElementsByTagName("use")[0]
        ?.getAttribute("xlink:href")
        ?.endsWith("icon-correctedcoords");
    const isSolved =
        (isSolvedValue !== undefined && isSolvedValue) ||
        document.getElementById("uxLatLon").classList.contains("myLatLon");
    const foundTextElement = document.getElementById(
        "ctl00_ContentBody_GeoNav_logText"
    );
    const isFound =
        foundTextElement !== null &&
        foundTextElement.innerText.toLowerCase() === "found it!";
    const finalCoordinates = isSolved
        ? document.getElementById("uxLatLon").innerText
        : "N AB° CD.DEF E GHI° JK.LMN";

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

let copyToClipboardBtn = document.getElementById("copyToClipboardBtn");
if (copyToClipboardBtn === null) {
    copyToClipboardBtn = document.createElement("button");
    copyToClipboardBtn.id = "copyToClipboardBtn";
    copyToClipboardBtn.innerText = "Copy to clipboard";
    copyToClipboardBtn.classList.add("gc-md-btn");
    document
        .getElementsByClassName("cacheDetailsTitle")[0]
        .appendChild(copyToClipboardBtn);
}

let previewBtn = document.getElementById("previewBtn");
if (previewBtn === null) {
    previewBtn = document.createElement("button");
    previewBtn.id = "previewBtn";
    previewBtn.innerText = "Preview";
    previewBtn.classList.add("gc-md-btn");
    document
        .getElementsByClassName("cacheDetailsTitle")[0]
        .appendChild(previewBtn);
}

let mdFileContent = "";
function updateMdFile() {
    chrome.storage.local.get(storageKey, function (data) {
        mdFileContent = createMarkdownFile(data[storageKey]);
    });
}
copyToClipboardBtn.addEventListener("click", function (event) {
    event.preventDefault();
    updateMdFile();
    navigator.clipboard.writeText(mdFileContent);
});
previewBtn.addEventListener("click", function (event) {
    event.preventDefault();
    updateMdFile();
    alert(mdFileContent);
});
