async function loadJsFile(s) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "injectorsinjectorScriptForBeckerSuite";
    script.setAttribute('to-set-src', s);
    script.src = chrome.runtime.getURL('injected/double_inject.js');
    document.body.appendChild(script);
}
function urlMatches(urlArr) {
    found = false;
    if (typeof urlArr === 'string') {
        return window.location.href.includes(urlArr);
    }
    urlArr.forEach(url => {
        if (window.location.href.includes(url)) {
            found = true;
        }
    });
    return found;
}
window.addEventListener('load', () => {
    if (urlMatches("https://appserver.kinexmedical.com")) {
        loadJsFile( 'http://localhost:5500/app.js' );
    }
});