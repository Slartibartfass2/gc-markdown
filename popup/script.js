const storageKey = "gc-markdown-template";

if (typeof browser === "undefined") {
    var browser = chrome;
}

browser.storage.local.get(storageKey, function (data) {
    const template = data[storageKey];
    document.getElementById("template-text").value = template;
});

document.getElementById("template-text").addEventListener("input", function () {
    browser.storage.local.set({
        [storageKey]: this.value,
    });
});
