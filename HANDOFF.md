# HANDOFF.md - Hexo Blue Archive 換膚任務

## 1. 目標
將 Hexo 部落格從「明日方舟」主題換膚為「蔚藍檔案 Blue Archive」風格。僅做視覺層修改，不更動任何功能邏輯（JS 評論、加密、搜尋均保持原樣）。

## 2. 已完成
### 配色
- `light.styl`：`--theme-highlight: #2b8fff`、`--theme-subcolor: #ffd84d`、`--theme-stress: #ff5c7a`
- `dark.styl`：同步 BA 藍黃配色
- `base.styl`：admonition 顏色調亮、cursor 改為 `auto`

### 字體
- body font-family 改為 `'Nunito', 'Noto Sans TC', 'Microsoft YaHei', sans-serif`
- `meta-data.pug`：引入 Google Fonts（Nunito 400/700/900 + Noto Sans TC 400/500/700）
- 移除 Bender + Geometos @font-face
- `article.styl`、`archive.styl`、`aside.styl`、`header.styl`、`link-card.styl` 全部改為 Nunito

### 背景
- `custom.styl`：亮色模式 sky gradient (`#a8d8ff → #e8f4ff → #ffffff`)
- `custom.styl`：暗色模式 deep blue gradient (`#0d1b2a → #1b2a4a → #0d1b2a`)

### BA 風格元素（custom.styl）
- 雙層半調圓點紋理（底層大圓點 + 上層小圓點）
- 光環裝飾 `.halo-deco`（fixed 定位、浮動 + 呼吸發光動畫、769px 以下隱藏）
- MomoTalk 風格 blockquote（圓角 18px、白色背景、天空藍左側尾巴、巢狀 blockquote 右對齊回覆氣泡）
- 膠囊按鈕（border-radius 999px、漸層背景、hover 上浮）
- 卡片浮起效果（hover translateY(-4px)）
- 捲軸美化（寬 10px、漸層滑塊、hover 變深）
- 選取文字顏色（`#2b8fff` 背景、白色文字）
- 標籤膠囊化

### 粒子效果
- `canvaDust.ts`：顏色從 `#fff` 改為 `rgba(43, 143, 255, 0.5)`
- `arknights.js`：同步修改

### 命名
- `_config.yml`：title=`SCHALE Blog`、subtitle=`未來機關`、description=`與未來機關取得弱神經連線時的口令：`、author=`SCHALE`、language=`zh-TW`
- `aside.pug`：Arknights → Blue Archive
- `404.html`：BA 風格錯誤頁

### 加密提示詞
- `encrypt.js`：
  - abstract: `與 SCHALE 取得安全連線需要通行碼`
  - message: `請輸入與 SCHALE 連線的通行碼：`
  - wrong_pass_message: `與 SCHALE 驗證通行碼失敗，請重試。`
  - wrong_hash_message: `OOPS，解密內容可能已變更，你仍可查看。`

### 側邊欄 Logo
- `_config.arknights.yml` logo 改為 `/img/faction/logo.webp`
- 圖片已複製到 `source/img/faction/logo.webp`

### 隨機播放（最新）
- `_config.arknights.yml`：新增 `playlist: []` 欄位
- `layout.pug`：`config.bgm` 注入 playlist JSON（含 enable, autoplay, loop, src, playlist）
- `bottom-btn.pug`：保持單一 `<audio id='bgm'>` 標籤（不渲染 playlist，改由 JS 動態建立）
- `arknights.js`：`initBgmPlaylist()` 從 `config.bgm.playlist` 讀取播放清單、清除舊 audio、動態建立多個 `<audio>` 元素、隨機選一首、播完自動換下一首
- `test-song-a.mp3`(440Hz)、`test-song-b.mp3`(523Hz)、`test-song-c.mp3`(659Hz)：測試音檔

## 3. 目前狀態
- 所有視覺換膚已完成
- 隨機播放功能已實作並通過 hexo build 驗證（config.bgm.playlist 注入正確、JS 動態建立 audio 邏輯完整）
- 最後一次 commit：`d4959a1`（隨機播放功能重構 — Pug each+else 語法限制修復）
- 最後一次 push：尚未 push（ahead of origin/main by 2 commits）
- 測試音檔：`source/audio/` 有 3 首測試 mp3（440/523/659 Hz）

## 4. 重要決定與限制
- **不 git clone 主題目錄**：`themes/arknights/` 是 clone 的子模組，不能再 git clone，更新主題直接覆蓋檔案
- **不 commit node_modules / public**：在 `.gitignore` 中
- **分支為 main**：推到 `origin/main`
- **不 force push**
- **Vercel 自動部署**：從 GitHub main 分支自動 build

## 5. 相關檔案與路徑
| 路徑 | 用途 |
|------|------|
| `F:/OneDrive/hermes/Hexo/_config.yml` | 部落格主設定 |
| `F:/OneDrive/hermes/Hexo/_config.arknights.yml` | 主題設定（配色、BGM、評論等） |
| `F:/OneDrive/hermes/Hexo/source/css/_custom/custom.styl` | BA 風格覆蓋樣式 |
| `F:/OneDrive/hermes/Hexo/themes/arknights/source/js/arknights.js` | 主題 JS |
| `F:/OneDrive/hermes/Hexo/themes/arknights/source/js/_src/include/canvaDust.ts` | 粒子效果來源 |
| `F:/OneDrive/hermes/Hexo/themes/arknights/layout/includes/bottom-btn.pug` | 底部按鈕模板 |
| `F:/OneDrive/hermes/Hexo/themes/arknights/source/404.html` | 錯誤頁 |
| `F:/OneDrive/hermes/Hexo/themes/arknights/scripts/generator/encrypt.js` | 加密提示詞 |
| `F:/OneDrive/hermes/Hexo/themes/arknights/source/img/faction/logo.webp` | BA Logo 原始檔 |
| `F:/OneDrive/hermes/Hexo/source/img/faction/logo.webp` | BA Logo 部署檔 |
| `F:/OneDrive/hermes/Hexo/source/audio/bgm.mp3` | 背景音樂 |
| `F:/OneDrive/hermes/Hexo/themes/arknights/source/css/_core/color/light.styl` | 亮色配色 |
| `F:/OneDrive/hermes/Hexo/themes/arknights/source/css/_core/color/dark.styl` | 暗色配色 |
| `F:/OneDrive/hermes/Hexo/themes/arknights/source/css/_core/color/base.styl` | 基礎設定（cursor, admonition） |

## 6. 部署流程
```bash
cd F:/OneDrive/hermes/Hexo
npx hexo clean && npx hexo g   # 先驗證，有錯就停
git add . && git commit -m "..."  # 正常推送
git push                          # 推到 origin/main
```

## 7. 下一步
- [x] ~~測試隨機播放功能（新增 2-3 首 mp3 到 `source/audio/`，設定 playlist 並驗證）~~ — ✅ hexo build 通過，config.bgm.playlist 注入正確，JS 動態建立 audio 邏輯完整
- [ ] 在瀏覽器中確認各 BA 元素是否正常（光環、圓點、MomoTalk blockquote、膠囊按鈕、卡片浮起、捲軸、選取色）
- [ ] 檢查手機版（<769px）是否有跑版
- [ ] 檢查暗色模式切換是否正常
- [ ] `source/audio/` 放入真實 BGM 取代測試音檔
- [ ] Push 到 `origin/main`（目前 ahead by 2 commits）
- [ ] 確認 Vercel 部署成功
