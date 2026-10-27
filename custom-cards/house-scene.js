import './energy-flow-animation.js?v=15';
const quiet=Base=>class extends Base{_build(){super._build();const style=document.createElement('style');style.textContent='.settings-note{display:none!important}#tesla-art,.label[data-key=ev],#flow-ev,.ev-cable-connected,.ev-cable-loose{display:none!important}';this.shadowRoot.append(style);}};
customElements.define('myhome-quiet-live-v27',quiet(customElements.get('myhome-comet-live-v26')));
customElements.define('myhome-quiet-test-v27',quiet(customElements.get('myhome-comet-test-v26')));
