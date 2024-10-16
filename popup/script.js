const storageKey = "gc-markdown-template";

if (typeof browser === "undefined") {
    var browser = chrome;
}

const placeholders = [
    "title",
    "gcCode",
    "difficulty",
    "terrain",
    "isSolved",
    "isFound",
    "finalCoordinates",
];
const placeholderDescription = document.createElement("span");
for (let i = 0; i < placeholders.length; i++) {
    const placeholder = placeholders[i];
    const placeholderElement = document.createElement("strong");
    placeholderElement.textContent = placeholder;
    placeholderDescription.appendChild(placeholderElement);
    if (i < placeholders.length - 1) {
        placeholderDescription.appendChild(document.createTextNode(", "));
    }
}
document
    .getElementById("placeholder-description")
    .appendChild(placeholderDescription);

const textArea = document.getElementById("template-text");
const button = document.getElementById("save-template-btn");

function loadTemplate(data) {
    const template = data[storageKey];
    textArea.value = template;
}

function saveTemplate() {
    browser.storage.local.set({
        [storageKey]: textArea.value,
    });
}

browser.storage.local.get(storageKey, loadTemplate);
button.onclick = saveTemplate;
