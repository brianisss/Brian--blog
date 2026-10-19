# 主題背景組

進入網站時預設使用 set-01；切換明暗時會沿用當前組。每次由暗色切回亮色，組別才按 set-01 到 set-06 順序前進（例如 set-01 亮 → set-01 暗 → set-02 亮）。下一組會先預載並解碼再切換；重新載入或 PJAX 導頁會保留當前組。背景使用 cover 鋪滿頁面；來源圖片檔案與原始解析度保持不變，瀏覽器會依視窗比例裁切邊緣。圖片請使用檔名 `background.jpg`，放在對應資料夾：

- `source/img/background-sets/set-01/light/background.jpg`（亮色）
- `source/img/background-sets/set-01/dark/background.jpg`（暗色）

依此放到 `set-02` 至 `set-06`。切換程式在 `layout/includes/meta-data.pug` 與 `source/js/_src/include/ColorMode.ts`，目前組號存在瀏覽器 localStorage。

舊版基沃托斯夜景保留為未啟用備選圖：`source/img/dark-background/kivotos-plaza-night.webp`。

素材來源：[《蔚藍檔案》官方中文網站](https://www.bluearchive-cn.com/world)。原始圖片：<https://webcnstatic.yostar.net/ba_cn_web/prod/web/assets/bg.63922b5f.png>。著作權屬原權利人；公開部署或再散布前，請確認官方使用規範並保留來源標示。
