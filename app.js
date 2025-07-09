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
}