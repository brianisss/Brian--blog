# 主題背景組

每次完整載入頁面或 PJAX 頁面切換時，主題會從 6 組明暗配對中隨機選一組，切換明暗模式時會沿用同一組；PJAX 切換時會淡出淡入，且不會連續選到同一組。圖片請使用檔名 `background.jpg`，放在對應資料夾：

- `source/img/background-sets/set-01/light/background.jpg`（亮色）
- `source/img/background-sets/set-01/dark/background.jpg`（暗色）

依此放到 `set-02` 至 `set-06`。隨機選擇程式在 `layout/includes/meta-data.pug`，初始選擇會在樣式表載入前執行。

舊版基沃托斯夜景保留為未啟用備選圖：`source/img/dark-background/kivotos-plaza-night.webp`。

素材來源：[《蔚藍檔案》官方中文網站](https://www.bluearchive-cn.com/world)。原始圖片：<https://webcnstatic.yostar.net/ba_cn_web/prod/web/assets/bg.63922b5f.png>。著作權屬原權利人；公開部署或再散布前，請確認官方使用規範並保留來源標示。
