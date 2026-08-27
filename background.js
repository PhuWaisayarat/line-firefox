import "./cache.js";
const mainWindowId = {
    get: async () => (await chrome.storage.local.get("mainWindow"))?.mainWindow ?? null,
    set: async e => await chrome.storage.local.set({
        mainWindow: e
    }),
    remove: async () => await chrome.storage.local.remove("mainWindow")
},
checkAndDeleteLegacyData = async () => {
    if (!(await chrome.storage.local.get("isOpenedBefore"))?.isOpenedBefore) {
        await chrome.storage.local.clear();
        const e = await indexedDB.databases();
        for (const o of e) await removeDatabase(o);
        await chrome.storage.local.set({
            isOpenedBefore: !0
        })
    }
}, removeDatabase = e => new Promise(((o, a) => {
    const n = indexedDB.deleteDatabase(e.name);
    n.onsuccess = () => o(), n.onerror = e => a(e), n.onblocked = () => a(new Error("deleteDatabase blocked"))
}));


if(chrome.windows){
    chrome.action.onClicked.addListener(() => {
        chrome.windows.create({
            url: "index.html",
            type: "normal",
            width: 710,
            height: 570
        });
    });
} else {
    chrome.action.onClicked.addListener(() => {
        chrome.tabs.create({url: "index.html"})
    })
}
