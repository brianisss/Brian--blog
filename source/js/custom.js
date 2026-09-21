/* ========================================
   A. SCHALE 開機載入畫面
   ======================================== */
(function createBootScreen() {
    // 尊重 prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const boot = document.createElement('div');
    boot.id = 'schale-boot-screen';
    boot.innerHTML = `
        <div class="boot-content">
            <div class="boot-title">SCHALE OS</div>
            <div class="boot-sub">Establishing secure connection<span class="boot-dots"><span>.</span><span>.</span><span>.</span></span></div>
            <div class="boot-progress"><span class="boot-bar"></span></div>
        </div>
    `;
    document.body.appendChild(boot);

    // 3 個圓點依序亮起
    const dots = boot.querySelectorAll('.boot-dots span');
    dots.forEach((d, i) => {
        d.style.animation = `schaleBootDot 1s ease ${i * 0.4}s infinite`;
    });

    // window load 後淡出
    window.addEventListener('load', function () {
        setTimeout(() => {
            boot.style.opacity = '0';
            setTimeout(() => boot.remove(), 500);
        }, 500);
    });

    // 保險：1.5 秒強制移除
    setTimeout(() => {
        if (boot.parentNode) {
            boot.style.opacity = '0';
            setTimeout(() => boot.remove(), 500);
        }
    }, 1500);
})();

/* ========================================
   E. BGM 播放狀態追蹤（供 CSS 動畫使用）
   ======================================== */
(function initBgmWatcher() {
    const bgm = document.getElementById('bgm');
    const btn = document.getElementById('bgm-control') || document.querySelector('#bgm-control, [onclick*="BgmControl"]');
    if (!bgm) return;

    let wasPlaying = bgm.paused ? false : true;

    function toggleClass() {
        const playing = !bgm.paused;
        if (playing && !wasPlaying) {
            document.body.classList.add('ba-playing');
        } else if (!playing && wasPlaying) {
            document.body.classList.remove('ba-playing');
        }
        wasPlaying = playing;
    }

    if (btn) {
        btn.addEventListener('click', toggleClass);
    }
    bgm.addEventListener('play', toggleClass);
    bgm.addEventListener('pause', toggleClass);
})();
