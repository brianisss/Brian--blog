/// <reference path="common/base.ts" />
/// <reference path="canvaDust.ts" />
/// <reference path="GiscusManager.ts" />
'use strict';
class ColorMode {
    html = document.documentElement;
    dark = this.html.getAttribute('theme-mode') === 'dark';
    inChanging = false;
    btn = getElement('#color-mode');
    syncGiscusTheme = () => {
        if (typeof giscusManager !== 'undefined' && giscusManager.isLoaded()) {
            giscusManager.syncTheme();
        }
    };
    change = () => {
        if (this.inChanging)
            return;
        this.inChanging = true;
        this.btn.style.pointerEvents = 'none';
        const previousTheme = this.dark ? 'dark' : 'light';
        const nextTheme = this.dark ? 'light' : 'dark';
        const background = document.createElement('div');
        background.className = 'theme-background-transition';
        const currentStyles = getComputedStyle(this.html);
        background.style.backgroundImage = currentStyles.getPropertyValue(`--${previousTheme}-background`).trim();
        background.style.backgroundColor = currentStyles.getPropertyValue('--theme-background').trim();
        document.body.insertBefore(background, document.body.firstChild);
        this.html.classList.add('theme-changing');
        this.html.setAttribute('theme-mode', nextTheme);
        this.dark = nextTheme === 'dark';
        window.localStorage['theme-mode'] = nextTheme;
        if (canvasDusts)
            canvasDusts.stop();
        requestAnimationFrame(() => background.classList.add('is-fading'));
        code.resetMermaid();
        this.syncGiscusTheme();
        const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 760;
        window.setTimeout(() => {
            background.remove();
            this.html.classList.remove('theme-changing');
            if (canvasDusts)
                canvasDusts.play();
            this.btn.style.pointerEvents = '';
            this.inChanging = false;
        }, duration);
    };
    constructor() {
        document.addEventListener('keypress', (ev) => {
            if (this.inChanging) {
                return;
            }
            if (ev.key === 'c' && ev.target &&
                !['INPUT', 'TEXTAREA'].includes(ev.target.tagName)) {
                this.change();
            }
        });
    }
}
try {
    var colorMode = new ColorMode();
}
catch (e) { }
