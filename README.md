# 塔羅占卜網頁應用程式

一個專業的線上塔羅占卜網頁應用程式，提供無視論抽牌系統和每日抽牌功能。

## 功能特色

- 🔮 **無視論抽牌系統** - 支援1-9張牌的靈活占卜
- 🌅 **每日抽牌功能** - 每日指導牌與三面向分析
- 📱 **響應式設計** - 完美適配各種設備
- 🎨 **優雅界面** - 神秘紫色主題配色
- 💾 **本地存儲** - 占卜歷史記錄保存
- 🌐 **多語言支援** - 繁體中文與英文

## 技術架構

- **前端框架**: React 18 + TypeScript
- **建構工具**: Vite
- **樣式框架**: Tailwind CSS
- **動畫庫**: Framer Motion
- **路由**: React Router v6
- **代碼規範**: ESLint + Prettier

## 開發指令

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建構生產版本
npm run build

# 預覽生產版本
npm run preview

# 代碼檢查
npm run lint

# 代碼格式化
npm run format
```

## 專案結構

```
src/
├── components/          # 可重用組件
│   ├── common/         # 通用組件
│   ├── cards/          # 塔羅牌相關組件
│   ├── animations/     # 動畫組件
│   └── layout/         # 佈局組件
├── pages/              # 頁面組件
├── hooks/              # 自定義 React Hooks
├── services/           # 業務邏輯服務
├── utils/              # 工具函數
├── data/               # 靜態資料
├── types/              # TypeScript 型別定義
├── styles/             # 全域樣式
└── assets/             # 靜態資源
```

## 開發規範

- 使用 TypeScript 進行強型別開發
- 遵循 ESLint 和 Prettier 代碼規範
- 組件採用函數式組件 + Hooks
- 樣式使用 Tailwind CSS 工具類
- 提交前進行代碼檢查和格式化

## 瀏覽器支援

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 授權

MIT License