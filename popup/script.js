const storageKey = "gc-markdown-template";

if (typeof browser === "undefined") {
    var browser = chrome;
}

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
