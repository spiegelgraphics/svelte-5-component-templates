export const embedParams = (function() {

    let _embedParams = {};

    const add = paramData => {
        _embedParams = {..._embedParams, ...paramData};
    };

    const get = () => _embedParams;

    return {
        add,
        get
    };
})();

export const setEmbedParams = paramsTag => {
    const dataParams = JSON.parse(paramsTag.getAttribute("data-params") || "{}" );
    const data = paramsTag.getAttribute("data-url") || "";
    if(dataParams){
        embedParams.add(dataParams);
    }
    if(data){
        embedParams.add({dataUrl: data});
    }
}
