export const getScriptTag = (importMeta = {}) => {
    return document.currentScript || (() => {
        const url = (importMeta.url || "").replace(/^.+?(\/src\/.+?.js)+?/, "$1");
        return document.querySelector("script[src='" + url + "']");
    })();
};
