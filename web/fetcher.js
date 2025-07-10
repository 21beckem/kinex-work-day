if (window.top !== window.self) {
    window.old_fetch = window.fetch;
    window.fetch = async (input, init) => {
        // define fetch response
        class FetchResponse {
            constructor(responseText) {
                this.txt = responseText;
            }
            async json() {
                return JSON.parse(this.txt);
            }
            async text() {
                return this.txt;
            }
        }

        // detect if the body is FormData
        let bodyIsFormData = false;
        if (init.hasOwnProperty('body')) {
            if (init.body instanceof FormData) {
                bodyIsFormData = true;
                // convert form data to json
                var object = {};
                init.body.forEach((value, key) => object[key] = value);
                init.body = object;
            }
        }

        // send request to parent
        const uid = crypto.randomUUID();
        window.top.postMessage({ type: 'fetch-for-me', input, init, uid, bodyIsFormData }, '*');

        // wait for response
        return new Promise((resolve, reject) => {
            let fetchResListener = (e) => {
                // if message is for me
                if (e.data.type === 'fetch-response' && e.data.uid === uid) {
                    // remove listener
                    window.removeEventListener('message', fetchResListener);
                    // resolve
                    resolve( new FetchResponse(e.data.responseText) );
                }
            }
            window.addEventListener('message', fetchResListener);
        });
    };
}




// // Put this code in the parent window
// window.addEventListener('message', (e) => {
//     if (e.data.type === 'fetch-for-me') {
//         // detect if the body is FormData
//         if (e.data.bodyIsFormData) {
//             // convert form data to json
//             function jsonToFormData(json) {
//                 const formData = new FormData();
//                 for (const key in json) {
//                     if (json.hasOwnProperty(key)) {
//                         const value = json[key];

//                         if (typeof value === 'object' && !(value instanceof File) && !(value instanceof Blob)) {
//                             // Recursively append nested objects and arrays
//                             formData.append(key, JSON.stringify(value));
//                         } else {
//                             formData.append(key, value);
//                         }
//                     }
//                 }
//                 return formData;
//             }

//             e.data.init.body = jsonToFormData(e.data.init.body);
//         }

//         fetch(e.data.input, e.data.init)
//             .then(res => res.text())
//             .then(txt => {
//                 // send response to sender
//                 e.source.postMessage({ type: 'fetch-response', uid: e.data.uid, responseText: txt }, '*');
//             });
//     }
// });