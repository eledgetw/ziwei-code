# 紫微斗數甲級星排盤系統 (Ziwei Doushu Charting System)

![Version](https://img.shields.io/badge/version-1.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

這是一套基於邏輯與精準度開發的紫微斗數線上排盤工具。開發者身兼**專職交易員**與**軟體愛好者**雙重身分，致力於將傳統命理的繁瑣規則轉化為極簡、無廣告、且具備現代軟體架構的數位系統。

## 🌟 核心特色

- **精準演算法**：整合 `lunar-javascript` 套件，精確處理西元/民國、陰曆/陽曆轉換及閏月判定。
- **五虎將架構**：採用標準的「關注點分離」架構，代碼結構清晰，易於維護與擴充。
    - `index.html`：純淨的 UI 骨架。
    - `style.css`：現代化響應式排盤介面。
    - `constants.js`：完整的斗數資料庫（星曜、廟旺、格局規則）。
    - `app.js`：核心算盤與畫面渲染邏輯。
    - `presets.js`：本地存檔與匯出入模組。
- **職業聯動**：內建「斗數職業」擴充頁面，提供深層次的命盤解析參考。
- **數據自主**：支援 CSV / Excel (XLSX) 批次匯入匯出，方便研究者建立個人命例資料庫。
- **截圖分享**：一鍵產生高畫質命盤圖片，方便儲存或社交分享。

## 🛠️ 技術棧

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Library**: 
  - [lunar-javascript](https://github.com/6tail/lunar-javascript) (曆法轉換)
  - [SheetJS](https://sheetjs.com/) (Excel 處理)
  - [html2canvas](https://html2canvas.hertzen.com/) (圖片生成)

## 📦 安裝與使用

本專案採純前端開發，無需安裝後端環境：

1. 克隆 (Clone) 本倉庫：
   ```bash
   git clone [https://github.com/您的帳號/專案名稱.git](https://github.com/您的帳號/專案名稱.git)
