/// <reference path="common/base.ts" />
/// <reference path="canvaDust.ts" />
/// <reference path="GiscusManager.ts" />

'use strict'

class ColorMode {
  private html: HTMLElement = document.documentElement
  private dark: boolean = this.html.getAttribute('theme-mode') === 'dark'
  private inChanging: boolean = false
  private btn: HTMLElement = getElement('#color-mode')

  private syncGiscusTheme = (): void => {
    if (typeof giscusManager !== 'undefined' && giscusManager.isLoaded()) {
      giscusManager.syncTheme()
    }
  }


  public change = async () => {
    if (this.inChanging) return
    this.inChanging = true
    this.btn.style.pointerEvents = 'none'
    const previousTheme = this.dark ? 'dark' : 'light'
    const nextTheme = this.dark ? 'light' : 'dark'
    const background = document.createElement('div')
    background.className = 'theme-background-transition'
    const currentStyles = getComputedStyle(this.html)
    background.style.backgroundImage = currentStyles.getPropertyValue(`--${previousTheme}-background`).trim()
    background.style.backgroundColor = currentStyles.getPropertyValue('--theme-background').trim()
    document.body.insertBefore(background, document.body.firstChild)

    // Advance the paired background only when switching from dark back to light.
    if (this.dark && typeof (window as any).advanceBackgroundSet === 'function') {
      try {
        await (window as any).advanceBackgroundSet()
      } catch (e) {}
    }

    this.html.classList.add('theme-changing')
    this.html.setAttribute('theme-mode', nextTheme)
    this.dark = nextTheme === 'dark'
    window.localStorage['theme-mode'] = nextTheme
    if (canvasDusts) canvasDusts.stop()
    requestAnimationFrame(() => background.classList.add('is-fading'))
    code.resetMermaid()
    this.syncGiscusTheme()
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 760
    window.setTimeout(() => {
      background.remove()
      this.html.classList.remove('theme-changing')
      if (canvasDusts) canvasDusts.play()
      this.btn.style.pointerEvents = ''
      this.inChanging = false
    }, duration)
  }

  constructor() {
    document.addEventListener('keypress', (ev: KeyboardEvent) => {
      if (this.inChanging) {
        return
      }
      if (ev.key === 'c' && ev.target &&
        !['INPUT', 'TEXTAREA'].includes((ev.target as HTMLElement).tagName)) {
        this.change()
      }
    })
  }
}

try {
  var colorMode = new ColorMode()
} catch (e) {}
