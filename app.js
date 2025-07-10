function includeJS(s) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = s;
    document.head.appendChild(script);
}

includeJS('http://localhost:5500/AppServer.js');

// inject button to start Work Day
const makeStartBtn = () => {
    const btn = document.createElement("li");
    btn.className = `application ui-state-default ui-corner-all`;
    btn.style.cssText = `margin-bottom: 0.25em; padding: 0.25em; cursor: pointer;`;
    btn.innerHTML = `<span class="icon-double-angle-right"></span> Start Work Day`;
    btn.onmouseover = () => { btn.classList.add('ui-state-hover'); };
    btn.onmouseout = () => { btn.classList.remove('ui-state-hover'); };
    btn.onclick = () => { createContent() };
    document.querySelector('.applications').appendChild(btn);

    // fix viewport
    document.querySelector('meta[name=viewport]').setAttribute('content', "width=device-width, initial-scale=1.0");
};
makeStartBtn();

const createContent = () => {
    if (document.getElementById("WorkDayIframe")) return;
    const frame = document.createElement("iframe");
    frame.id = "WorkDayIframe";
    frame.src = 'http://localhost:5500/web/index.html';
    frame.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; z-index: 9999;`;
    document.body.appendChild(frame);
    document.title = "Work Day";
}


// handle child fetch requests
window.addEventListener('message', (e) => {
    if (e.data.type === 'fetch-for-me') {
        // detect if the body is FormData
        if (e.data.bodyIsFormData) {
            // convert form data to json
            function jsonToFormData(json) {
                const formData = new FormData();
                for (const key in json) {
                    if (json.hasOwnProperty(key)) {
                        const value = json[key];

                        if (typeof value === 'object' && !(value instanceof File) && !(value instanceof Blob)) {
                            // Recursively append nested objects and arrays
                            formData.append(key, JSON.stringify(value));
                        } else {
                            formData.append(key, value);
                        }
                    }
                }
                return formData;
            }

            e.data.init.body = jsonToFormData(e.data.init.body);
        }

        fetch(e.data.input, e.data.init)
            .then(res => res.text())
            .then(txt => {
                // send response to sender
                e.source.postMessage({ type: 'fetch-response', uid: e.data.uid, responseText: txt }, '*');
            });
    }
});