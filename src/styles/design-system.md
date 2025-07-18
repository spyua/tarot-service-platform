# 塔羅占卜應用程式設計系統

## 色彩系統

### 主色調 (Primary) - 神秘紫色系
```css
--primary-50: #faf5ff
--primary-100: #f3e8ff
--primary-200: #e9d5ff
--primary-300: #d8b4fe
--primary-400: #c084fc
--primary-500: #a855f7
--primary-600: #9333ea
--primary-700: #7c3aed
--primary-800: #6b21a8
--primary-900: #581c87
```

### 輔助色 (Accent) - 金色系
```css
--accent-50: #fffbeb
--accent-100: #fef3c7
--accent-200: #fde68a
--accent-300: #fcd34d
--accent-400: #fbbf24
--accent-500: #f59e0b
--accent-600: #d97706
--accent-700: #b45309
--accent-800: #92400e
--accent-900: #78350f
```

## 字體系統

### 主要字體 - Noto Serif TC (優雅襯線字體)
- 用於標題、重要文字、塔羅牌解釋
- 權重: 300, 400, 500, 600, 700
- 類別: `font-primary`

### 輔助字體 - Inter (現代無襯線字體)
- 用於介面文字、按鈕、說明文字
- 權重: 300, 400, 500, 600, 700
- 類別: `font-secondary`

## 響應式斷點

```css
xs: 375px   /* 小型手機 */
sm: 640px   /* 大型手機 */
md: 768px   /* 平板 */
lg: 1024px  /* 小型桌面 */
xl: 1280px  /* 大型桌面 */
2xl: 1536px /* 超大桌面 */
```

## 組件庫

### Button 按鈕組件

#### 變體 (Variants)
- `primary`: 主要按鈕 (紫色背景)
- `secondary`: 次要按鈕 (灰色背景)
- `accent`: 強調按鈕 (金色背景)
- `outline`: 邊框按鈕 (透明背景，紫色邊框)
- `ghost`: 幽靈按鈕 (透明背景，懸停時顯示)

#### 尺寸 (Sizes)
- `sm`: 小型按鈕 (px-3 py-1.5 text-sm)
- `md`: 中型按鈕 (px-4 py-2 text-base)
- `lg`: 大型按鈕 (px-6 py-3 text-lg)

#### 使用範例
```tsx
<Button variant="primary" size="md" loading={false}>
  開始占卜
</Button>
```

### Card 卡片組件

#### 變體 (Variants)
- `default`: 預設卡片 (白色背景，淺陰影)
- `elevated`: 提升卡片 (白色背景，深陰影)
- `outlined`: 邊框卡片 (紫色邊框)
- `glass`: 玻璃卡片 (半透明背景，模糊效果)

#### 內距 (Padding)
- `none`: 無內距
- `sm`: 小內距 (p-3)
- `md`: 中內距 (p-4)
- `lg`: 大內距 (p-6)

#### 子組件
- `CardHeader`: 卡片標題區域
- `CardTitle`: 卡片標題
- `CardDescription`: 卡片描述
- `CardContent`: 卡片內容
- `CardFooter`: 卡片底部

#### 使用範例
```tsx
<Card variant="elevated" padding="lg" hoverable>
  <CardHeader>
    <CardTitle>每日抽牌</CardTitle>
    <CardDescription>獲得今日的指引</CardDescription>
  </CardHeader>
  <CardContent>
    {/* 卡片內容 */}
  </CardContent>
</Card>
```

### Modal 對話框組件

#### 尺寸 (Sizes)
- `sm`: 小型對話框 (max-w-md)
- `md`: 中型對話框 (max-w-lg)
- `lg`: 大型對話框 (max-w-2xl)
- `xl`: 超大對話框 (max-w-4xl)

#### 功能特性
- 背景點擊關閉
- ESC 鍵關閉
- 滾動鎖定
- 動畫進出效果

#### 子組件
- `ModalHeader`: 對話框標題區域
- `ModalBody`: 對話框內容區域
- `ModalFooter`: 對話框底部按鈕區域

#### 使用範例
```tsx
<Modal 
  isOpen={isOpen} 
  onClose={handleClose}
  title="塔羅牌詳情"
  size="lg"
>
  <ModalBody>
    {/* 對話框內容 */}
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={handleClose}>
      關閉
    </Button>
  </ModalFooter>
</Modal>
```

### LoadingSpinner 載入組件

#### 變體 (Variants)
- `spinner`: 旋轉載入器
- `dots`: 點狀載入器
- `pulse`: 脈衝載入器

#### 尺寸 (Sizes)
- `sm`: 小型載入器
- `md`: 中型載入器
- `lg`: 大型載入器

#### 使用範例
```tsx
<LoadingSpinner 
  variant="spinner" 
  size="md" 
  text="正在抽牌中..."
/>
```

### Grid 網格系統

#### Grid 容器
- 支援 1-12 欄位配置
- 響應式斷點支援
- 可調整間距

#### GridItem 網格項目
- 支援跨欄配置
- 響應式跨欄支援

#### 使用範例
```tsx
<Grid cols={3} gap="md" responsive={{ xs: 1, md: 2, lg: 3 }}>
  <GridItem span={1}>項目 1</GridItem>
  <GridItem span={2}>項目 2</GridItem>
</Grid>
```

### Container 容器組件

#### 尺寸 (Sizes)
- `sm`: 小型容器 (max-w-sm)
- `md`: 中型容器 (max-w-md)
- `lg`: 大型容器 (max-w-4xl)
- `xl`: 超大容器 (max-w-6xl)
- `2xl`: 最大容器 (max-w-7xl)
- `full`: 全寬容器

#### 使用範例
```tsx
<Container size="lg" centered padding>
  {/* 頁面內容 */}
</Container>
```

## 動畫系統

### 預定義動畫變體
- `fadeInUp`: 淡入向上
- `fadeIn`: 淡入
- `slideInFromRight`: 從右側滑入
- `cardFlip`: 卡片翻轉
- `cardDraw`: 卡片抽取
- `deckShuffle`: 牌堆洗牌
- `pageTransition`: 頁面轉場

### 使用範例
```tsx
<motion.div
  variants={fadeInUp}
  initial="initial"
  animate="animate"
  exit="exit"
>
  內容
</motion.div>
```

## 工具類別

### 文字漸層
```css
.text-gradient {
  @apply bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent;
}
```

### 按鈕樣式
```css
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200;
}
```

### 卡片樣式
```css
.card {
  @apply bg-white rounded-xl shadow-lg border border-gray-200;
}
```

## 使用指南

### 色彩使用原則
1. 主色調 (Primary) 用於主要操作和重點強調
2. 輔助色 (Accent) 用於次要強調和裝飾元素
3. 灰色系用於文字和背景
4. 保持足夠的對比度確保可讀性

### 字體使用原則
1. 標題和重要內容使用 Noto Serif TC
2. 介面文字和說明使用 Inter
3. 確保在不同設備上的可讀性

### 響應式設計原則
1. 移動優先的設計方法
2. 使用彈性佈局和相對單位
3. 確保觸控友好的互動元素
4. 適當的間距和字體大小

### 動畫使用原則
1. 保持動畫簡潔和有意義
2. 使用適當的緩動函數
3. 提供動畫開關選項
4. 考慮性能影響