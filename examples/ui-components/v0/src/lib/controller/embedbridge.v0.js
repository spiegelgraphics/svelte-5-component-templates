let autoResize = true;

export function setAutoResize(bool) {
    autoResize = bool;
}

function calculateElementHeight(element) {
    // collapsed margins are ignored
    // console.log("element =>", element);

    return element.offsetHeight +
        parseInt(window.getComputedStyle(element).marginTop) +
        parseInt(window.getComputedStyle(element).marginBottom);
}

function submitResizeCall(height) {

    window.parent.postMessage(JSON.stringify({
        event: 'resize',
        height: height,
    }), '*');
    //}), getParentUrl());

    window.parent.postMessage({
        sentinel: 'amp',
        type: 'embed-size',
        height: height
    }, '*');

}

export function resize(height) {

    if (!autoResize && !height) {
        console.error('Error: Iframe autoresize config is missing, no resizing possilbe');
        return;
    }

    let newHeight,
        height_first_div;


    if (!height) {
        // console.log("window.doc", window, document.body)
        newHeight = calculateElementHeight(document.body);

        // test otherwise
        height_first_div = calculateElementHeight(document.querySelector("div:first-of-type"));

        if (height_first_div > newHeight) {
            newHeight = height_first_div;
        }

    } else {
        newHeight = height;
    }
    // console.log( "_-__> ", newHeight );

    submitResizeCall(newHeight);
}

if (autoResize) {

    resize();

    const ro = new ResizeObserver(function() {
        resize();
    });

    ro.observe(document.body);

}


function submitTrackingCall(payload) {

    window.parent.postMessage(JSON.stringify({
        event: 'track',
        payload: payload,
    }), '*');
    //}), getParentUrl());
}

export function track(payload) {

        submitTrackingCall(payload);
    }
