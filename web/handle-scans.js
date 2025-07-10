const HandleScans = (() => {
    class scanHandler {
        constructor(onScan=null) {
            this.onScan = onScan || ((s) => { console.warn('No onScan handler set. Raw scanned value: ' + s.value); });
            this.init();
        }
        focusOnHiddenInputWithoutMobileKeyboardOpening() {
            this.hiddenInput.setAttribute('readonly', 'readonly');
            this.hiddenInput.focus();
            this.hiddenInput.removeAttribute('readonly');
        };
        init() {
            this.hiddenInput = document.createElement('input');
            this.hiddenInput.type = 'text';
            this.hiddenInput.id = 'Handle-Scan-Hidden-Input';
            this.hiddenInput.style.cssText = `position: absolute; top: 0; left: 0; width: 0; height: 0; opacity: 0; pointer-events: none;`;

            // on input change
            this.cancelThisScan = null;
            this.hiddenInput.addEventListener('input', (e) => {
                clearTimeout(this.cancelThisScan);
                this.cancelThisScan = setTimeout(() => {
                    this.hiddenInput.value = '';
                }, 1000);
            });

            // on enter keypress
            this.hiddenInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    let v = this.hiddenInput.value;
                    clearTimeout(this.cancelThisScan);
                    this.hiddenInput.value = '';
                    this.onScan( new niceScan(v) );
                }
            });
            document.body.appendChild(this.hiddenInput);
            
            // always focus on this
            this.alwaysFocus = setInterval(() => {
                // unless the current focus is on any input where you can type
                if (document.activeElement.tagName === 'INPUT' && (document.activeElement.type == 'text' || document.activeElement.type == 'password' || document.activeElement.type == 'number')) return;
                // unless the current focus has text selected (that way the user can copy and paste)
                if (!window.getSelection().isCollapsed) return;
                
                this.focusOnHiddenInputWithoutMobileKeyboardOpening();
            }, 10);
        }
    }
    class niceScan {
        constructor(v) {
            this.value = v;
        }
        stripExtraChars() {
            if (this.value[this.value.length-1] == '~' && this.value.includes('sn-')) {
                return this.value.slice(0, -1).split('sn-')[1];
            }
            return this.value;
        }
    }
    return new scanHandler();
})();