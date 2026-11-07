# 交接說明：校園修繕紀錄網站

本文件給接手的人（或之後的 Claude 對話）使用，說明網站現況、照片上傳流程與待辦事項。

## 網站與發布

- 公開網址（GitHub Pages）：https://hsiang0422-star.github.io/campus-maintenance-photo-report-site/
- 儲存庫：https://github.com/hsiang0422-star/campus-maintenance-photo-report-site
- 網站原始檔在 `dist/`，推送到 `main` 分支會自動透過 `.github/workflows/pages.yml` 部署，網站是公開的。
- 部署大約需要幾分鐘（有時更久）。如果網頁沒有更新，先看 Actions 的執行狀態，並用強制重新整理。
- 連續推送時，較早的部署可能被取消，但最後一次成功的部署會包含所有內容。

## 網站結構

| 路徑 | 說明 |
| --- | --- |
| `dist/index.html` | 首頁：年月索引（校園修繕紀錄），上方有「廠商修繕紀錄」按鈕 |
| `dist/2026/MM/index.html` | 各月份的修繕紀錄頁（8 月到 11 月） |
| `dist/vendor/index.html` | 廠商修繕紀錄索引，樣式與首頁相同 |
| `dist/vendor/high-vocational-basin-mirror/` | 高職部洗手台鏡子安裝（3 張照片，日期 2026-11-07） |
| `dist/vendor/kindergarten-skylight-replacement/` | 幼兒部旁邊採光罩一到3樓更換（2 張照片，日期 2026-11-07） |
| `dist/assets/YYYY-MM/` | 月報照片 |
| `dist/assets/vendor/` | 廠商修繕照片 |
| `dist/app.js`、`dist/style.css` | 共用的照片檢視與樣式 |
| `tools/resize_photo.py` | 照片壓縮工具（見下方） |

## 照片上傳流程（之後都照這個做）

1. 使用者在對話中上傳照片，並說明放在哪一頁、日期與項目名稱。
2. 用 `tools/resize_photo.py` 壓成約 20 KB 的 JPEG，存到 `dist/assets/vendor/`（廠商項目）或 `dist/assets/YYYY-MM/`（月報）。檔名用項目代號加序號，例如 `mirror-01.jpg`。
   ```
   python3 tools/resize_photo.py 原始檔.jpg dist/assets/vendor/某項目-01.jpg
   ```
3. 在對應的項目頁加上 `<figure>` 區塊，格式與既有頁面相同，包含 `data-src`、`data-caption` 與 `alt`。
4. 確認頁面裡的圖片路徑都存在，然後 `git add`、`git commit`，最後推送到 `main`。
5. 回報網址，並提醒部署需要幾分鐘。

新增廠商項目時，還要在 `dist/vendor/index.html` 的卡片區加上一張卡片（日期、名稱、照片數、連結）。

## 已完成（截至 2026-11-07）

- 首頁加上「廠商修繕紀錄」按鈕。
- 廠商修繕紀錄索引頁，版面與首頁相同。
- 高職部洗手台鏡子安裝：3 張照片，已推送（commit `788d418`，之後的 commit 有調整日期與樣式）。
- 幼兒部旁邊採光罩一到3樓更換：2 張照片，已推送（commit `e2ae815`）。
- 所有廠商項目的日期目前都設為 2026-11-07，這是使用者提供的日期。

## 待辦與注意事項

- 之後還會有更多照片要上傳，請依上方流程處理。
- 採光罩頁面的第一張照片壓縮比較重（約 400 px、品質 10），如果有原始照片，可以換成較清楚的版本。
- 高職部鏡子安裝照片的包裝箱上有「高格調電子防霧化妝鏡」與「華光牌」字樣，廠商是否為「旅光實業社」尚未確認。
- 採光罩的施作廠商與安裝日期尚未確認，目前都用 2026-11-07。
- 網站的 SKILL 說明（`.agents/skills/maintenance-photo-report/SKILL.md`）寫的是另一個 Google Sites 版本的發布流程；這個 GitHub 版本是另外維護的。

## 來源位置（Google Drive）

- 「校園修繕畫面」資料夾（主要）：`1m368pjQQMJOi0HVXViN8j73MH5_Vl7Ua`，子資料夾 `115年11月`：`18b8Tc4NLTq9zTnBu5Xi0Y2TXkmBRC99j`，`115年10月`：`1C9G1oEDrvQ_xP6oHhvkJLK_AE027Xrta`。
- 另一個同名資料夾：`1__4xeeYuSV3olwzYEgmGtxEi8_m_WOhn`。
- 目前在 115年11月資料夾中沒有找到鏡子安裝的照片，照片是直接從對話上傳的。

## 對話紀錄

這份文件是對話的摘要，不是逐字紀錄。如果要保留完整對話，請用 claude.ai 的對話匯出功能另外保存。
