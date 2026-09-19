/// <reference path="common/base.ts" />
'use strict';
class GiscusManager {
    giscusSrc = 'https://giscus.app/client.js';
    giscusOrigin = 'https://giscus.app';
    settingsTimeout = 8000;
    scriptTimeout = 15000;
    errorDelay = 5000;
    loadingFallbackTimeout = 12000;
    messageHandlers = [];
    config = null;
    loaded = false;
    isLoading = false;
    loadStartTime = 0;
    showErrorTimeoutId = null;
    loadingFallbackTimeoutId = null;
    async loadConfig() {
        if (this.loaded)
            return this.config;
        try {
            const response = await fetch('/giscus.json');
            if (response.ok) {
                this.config = await response.json();
            }
        }
        catch (e) {
            console.warn('加载Giscus配置文件失败:', e);
        }
        this.loaded = true;
        return this.config;
    }
    async validateOrigin() {
        if (typeof window === 'undefined')
            return true;
        const currentOrigin = window.location.origin;
        const settings = window.giscusSettings;
        if (settings?.origin === currentOrigin)
            return true;
        const config = await this.loadConfig();
        if (!config)
            return true;
        if (config.origins?.includes(currentOrigin))
            return true;
        if (config.originsRegex?.length) {
            for (const pattern of config.originsRegex) {
                try {
                    if (pattern && new RegExp(pattern).test(currentOrigin))
                        return true;
                }
                catch (e) {
                    console.warn('无效的正则表达式模式:', pattern, e);
                }
            }
        }
        return !(config.origins?.length || config.originsRegex?.length);
    }
    getContainer() {
        if (typeof document === 'undefined')
            return null;
        return document.querySelector('#giscus');
    }
    clearErrorTimer() {
        if (!this.showErrorTimeoutId)
            return;
        clearTimeout(this.showErrorTimeoutId);
        this.showErrorTimeoutId = null;
    }
    clearLoadingTimer() {
        if (!this.loadingFallbackTimeoutId)
            return;
        clearTimeout(this.loadingFallbackTimeoutId);
        this.loadingFallbackTimeoutId = null;
    }
    clearLoadingMessage(container) {
        this.clearLoadingTimer();
        const target = container || this.getContainer();
        if (!target)
            return;
        const loadingMessage = target.querySelector('.giscus-loading-message');
        if (loadingMessage)
            loadingMessage.remove();
    }
    clearErrorMessage(container) {
        const target = container || this.getContainer();
        if (!target)
            return;
        const errorMessage = target.querySelector('.giscus-error-message');
        if (errorMessage)
            errorMessage.remove();
    }
    clearAllMessages(container) {
        this.clearErrorTimer();
        this.clearLoadingMessage(container);
        this.clearErrorMessage(container);
    }
    showLoadingMessage(container) {
        this.clearLoadingMessage(container);
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'giscus-loading-message';
        loadingDiv.setAttribute('aria-live', 'polite');
        loadingDiv.innerHTML = '<i class="giscus-loader" aria-hidden="true"></i><p class="giscus-loading-text">与神经网络取得连接 ...</p>';
        container.appendChild(loadingDiv);
    }
    getErrorMessage(error) {
        const loadTime = Math.round((Date.now() - this.loadStartTime) / 1000);
        if (error.message.includes('超时'))
            return `神经网络响应超时 (${loadTime}秒)`;
        if (error.message.includes('失败'))
            return '神经网络链路建立失败';
        return '神经网络链路不稳定';
    }
    showErrorWithDelay(container, error) {
        this.clearErrorTimer();
        this.showErrorTimeoutId = setTimeout(() => {
            this.clearLoadingMessage(container);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'giscus-error-message';
            errorDiv.innerHTML =
                `<div class="giscus-error-content">
           <div class="giscus-error-title">神经网络连接异常</div>
           <div class="giscus-error-message-text">${this.getErrorMessage(error)}</div>
           <button class="giscus-error-retry">重新连接</button>
         </div>`;
            this.clearErrorMessage(container);
            container.appendChild(errorDiv);
            const retryButton = errorDiv.querySelector('.giscus-error-retry');
            if (retryButton) {
                retryButton.addEventListener('click', () => {
                    retryButton.disabled = true;
                    retryButton.textContent = '重新建立连接中...';
                    this.loadGiscusScript().finally(() => {
                        retryButton.disabled = false;
                        retryButton.textContent = '重新连接';
                    });
                });
            }
            this.showErrorTimeoutId = null;
        }, this.errorDelay);
    }
    scheduleLoadingFallbackClear() {
        this.clearLoadingTimer();
        this.loadingFallbackTimeoutId = setTimeout(() => {
            this.clearLoadingMessage();
        }, this.loadingFallbackTimeout);
    }
    waitForGiscusSettings(timeout = this.settingsTimeout) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkSettings = () => {
                const settings = window.giscusSettings;
                if (settings !== undefined) {
                    resolve(settings);
                    return;
                }
                if (Date.now() - startTime > timeout) {
                    reject(new Error(`Giscus配置加载超时 (${timeout}ms)`));
                    return;
                }
                setTimeout(checkSettings, 100);
            };
            checkSettings();
        });
    }
    getGiscusTheme(siteTheme) {
        const themeConfig = window.giscusThemeConfig;
        if (themeConfig?.theme)
            return themeConfig.theme;
        if (themeConfig?.light && themeConfig?.dark) {
            return siteTheme === 'dark' ? themeConfig.dark : themeConfig.light;
        }
        return siteTheme === 'auto' || !siteTheme ? 'preferred_color_scheme'
            : siteTheme === 'dark' ? 'dark' : 'light';
    }
    getScriptAttributes(settings) {
        const attributes = {
            'data-repo': String(settings.repo),
            'data-repo-id': String(settings.repoId),
            'data-category': String(settings.category),
            'data-category-id': String(settings.categoryId),
            'data-mapping': settings.mapping || 'pathname',
            'data-strict': String(settings.strict ?? 0),
            'data-reactions-enabled': String(settings.reactionsEnabled ?? 1),
            'data-emit-metadata': String(settings.emitMetadata ?? 0),
            'data-input-position': settings.inputPosition || 'bottom',
            'data-lang': settings.lang || 'zh-CN',
            'data-theme': this.getGiscusTheme(document.documentElement.getAttribute('theme-mode')),
            'crossorigin': settings.crossorigin || 'anonymous'
        };
        if (settings.term)
            attributes['data-term'] = String(settings.term);
        if (settings.discussionNumber !== undefined && settings.discussionNumber !== null) {
            attributes['data-discussion-number'] = String(settings.discussionNumber);
        }
        if (settings.description)
            attributes['data-description'] = String(settings.description);
        if (settings.origin)
            attributes['data-origin'] = String(settings.origin);
        if (settings.loading)
            attributes['data-loading'] = String(settings.loading);
        return attributes;
    }
    appendGiscusScript(container, settings) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = this.giscusSrc;
            script.async = true;
            const attributes = this.getScriptAttributes(settings);
            Object.entries(attributes).forEach(([key, value]) => {
                if (value !== '')
                    script.setAttribute(key, value);
            });
            const timeoutId = setTimeout(() => {
                reject(new Error('Giscus脚本加载超时'));
            }, this.scriptTimeout);
            script.onload = () => {
                clearTimeout(timeoutId);
                resolve();
            };
            script.onerror = () => {
                clearTimeout(timeoutId);
                reject(new Error('Giscus脚本加载失败'));
            };
            container.appendChild(script);
        });
    }
    async loadGiscusScript() {
        if (this.isLoading)
            return;
        const container = this.getContainer();
        if (!container)
            return;
        this.isLoading = true;
        this.loadStartTime = Date.now();
        this.clearAllMessages(container);
        this.showLoadingMessage(container);
        try {
            const settings = await this.waitForGiscusSettings();
            if (!settings.repo || !settings.repoId || !settings.category || !settings.categoryId) {
                throw new Error('Giscus配置不完整');
            }
            const existingScript = container.querySelector(`script[src*="${this.giscusSrc}"]`);
            const existingIframe = container.querySelector('iframe.giscus-frame');
            if (existingScript)
                existingScript.remove();
            if (existingIframe)
                existingIframe.remove();
            await this.appendGiscusScript(container, settings);
            this.scheduleLoadingFallbackClear();
        }
        catch (error) {
            this.showErrorWithDelay(container, error);
            console.warn('Giscus 加载异常:', error);
        }
        finally {
            this.isLoading = false;
        }
    }
    syncTheme(theme) {
        return this.sendMessage({
            setConfig: {
                theme: this.getGiscusTheme(theme || document.documentElement.getAttribute('theme-mode'))
            }
        });
    }
    sendMessage(message) {
        if (!message)
            return false;
        const iframe = document.querySelector('iframe.giscus-frame');
        if (!iframe?.contentWindow)
            return false;
        try {
            iframe.contentWindow.postMessage({ giscus: message }, this.giscusOrigin);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    addMessageHandler(handler) {
        this.messageHandlers.push(handler);
    }
    removeMessageHandler(handler) {
        const index = this.messageHandlers.indexOf(handler);
        if (index > -1)
            this.messageHandlers.splice(index, 1);
    }
    isLoaded() {
        return !!document.querySelector('iframe.giscus-frame');
    }
    destroy() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('message', this.handleMessage);
        }
        this.clearErrorTimer();
        this.clearLoadingTimer();
        this.messageHandlers = [];
        this.isLoading = false;
        this.loadStartTime = 0;
    }
    constructor() {
        if (typeof window !== 'undefined') {
            window.addEventListener('message', this.handleMessage);
        }
    }
    handleMessage = (event) => {
        if (!event || event.origin !== this.giscusOrigin)
            return;
        if (!(typeof event.data === 'object' && event.data?.giscus))
            return;
        this.clearLoadingMessage();
        const giscusData = event.data.giscus;
        try {
            this.messageHandlers.forEach(handler => {
                if (typeof handler === 'function') {
                    handler(giscusData);
                }
            });
        }
        catch (e) {
            console.warn('Giscus 消息处理异常:', e);
        }
    };
}
let giscusManager;
if (typeof window !== 'undefined') {
    giscusManager = new GiscusManager();
    window.giscusManager = giscusManager;
}
