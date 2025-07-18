# 塔羅占卜網頁應用程式設計系統指南

## 概述

本設計系統為塔羅占卜網頁應用程式提供一致的視覺語言和組件庫。設計系統基於 Tailwind CSS，並整合了 Framer Motion 動畫庫，提供流暢的使用者體驗。

## 色彩系統

### 主色調 (Primary) - 神秘紫色系
```css
--primary-50: #faf5ff  /* 最淺的紫色，適合背景 */
--primary-100: #f3e8ff /* 淺紫色，適合懸停狀態 */
--primary-200: #e9d5ff /* 淺紫色，適合分隔線 */
--primary-300: #d8b4fe /* 中淺紫色，適合次要元素 */
--primary-400: #c084fc /* 中紫色，適合次要強調 */
--primary-500: #a855f7 /* 標準紫色，適合一般強調 */
--primary-600: #9333ea /* 主要紫色，適合主要按鈕 */
--primary-700: #7c3aed /* 深紫色，適合懸停狀態 */
--primary-800: #6b21a8 /* 深紫色，適合特殊強調 */
--primary-900: #581c87 /* 最深紫色，適合文字 */
```

### 輔助色 (Accent) - 金色系
```css
--accent-50: #fffbeb  /* 最淺的金色，適合背景 */
--accent-100: #fef3c7 /* 淺金色，適合懸停狀態 */
--accent-200: #fde68a /* 淺金色，適合分隔線 */
--accent-300: #fcd34d /* 中淺金色，適合次要元素 */
--accent-400: #fbbf24 /* 中金色，適合次要強調 */
--accent-500: #f59e0b /* 標準金色，適合一般強調 */
--accent-600: #d97706 /* 主要金色，適合主要按鈕 */
--accent-700: #b45309 /* 深金色，適合懸停狀態 */
--accent-800: #92400e /* 深金色，適合特殊強調 */
--accent-900: #78350f /* 最深金色，適合文字 */
```

### 使用指南

1. **主色調 (Primary)** 用於:
   - 主要按鈕和互動元素
   - 重點強調文字和標題
   - 活動狀態指示器
   - 品牌元素

2. **輔助色 (Accent)** 用於:
   - 次要強調元素
   - 裝飾性元素
   - 特殊狀態指示
   - 與主色調形成對比的元素

3. **中性色** 用於:
   - 背景色 (白色、淺灰色)
   - 文字色 (深灰色、黑色)
   - 邊框和分隔線

## 字體系統

### 主要字體 - Noto Serif TC (優雅襯線字體)
- **用途**: 標題、重要文字、塔羅牌解釋
- **權重**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **類別**: `font-primary`

```html
<h1 class="font-primary">塔羅占卜</h1>
```

### 輔助字體 - Inter (現代無襯線字體)
- **用途**: 介面文字、按鈕、說明文字
- **權重**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **類別**: `font-secondary`

```html
<p class="font-secondary">介面文字</p>
```

### 字體大小指南

```css
text-xs: 0.75rem   /* 12px - 極小文字，如註腳 */
text-sm: 0.875rem  /* 14px - 小型文字，如說明文字 */
text-base: 1rem    /* 16px - 基本文字大小，如正文 */
text-lg: 1.125rem  /* 18px - 大型文字，如重要段落 */
text-xl: 1.25rem   /* 20px - 特大文字，如小標題 */
text-2xl: 1.5rem   /* 24px - 二級標題 */
text-3xl: 1.875rem /* 30px - 一級標題 */
text-4xl: 2.25rem  /* 36px - 頁面標題 */
```

## 響應式斷點系統

```css
xs: 375px   /* 小型手機 */
sm: 640px   /* 大型手機 */
md: 768px   /* 平板 */
lg: 1024px  /* 小型桌面 */
xl: 1280px  /* 大型桌面 */
2xl: 1536px /* 超大桌面 */
```

### 使用方式

```html
<!-- 在 xs 螢幕上是 1 欄，md 螢幕上是 2 欄，lg 螢幕上是 3 欄 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- 內容 -->
</div>
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
import { Button } from '@/components/common';

// 基本用法
<Button variant="primary" size="md">
  開始占卜
</Button>

// 載入狀態
<Button variant="primary" loading={true}>
  處理中...
</Button>

// 禁用狀態
<Button variant="primary" disabled>
  無法使用
</Button>

// 全寬按鈕
<Button variant="primary" fullWidth>
  全寬按鈕
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/common';

<Card variant="elevated" padding="lg" hoverable>
  <CardHeader>
    <CardTitle>每日抽牌</CardTitle>
    <CardDescription>獲得今日的指引</CardDescription>
  </CardHeader>
  <CardContent>
    {/* 卡片內容 */}
  </CardContent>
  <CardFooter>
    <Button variant="primary">開始抽牌</Button>
  </CardFooter>
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
import { useState } from 'react';
import { Modal, ModalBody, ModalFooter, Button } from '@/components/common';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        開啟對話框
      </Button>
      
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title="塔羅牌詳情"
        size="lg"
      >
        <ModalBody>
          {/* 對話框內容 */}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            關閉
          </Button>
          <Button variant="primary">
            確認
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
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
import { LoadingSpinner } from '@/components/common';

// 基本用法
<LoadingSpinner variant="spinner" size="md" />

// 帶文字的載入器
<LoadingSpinner 
  variant="dots" 
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
import { Grid, GridItem } from '@/components/common';

// 基本用法
<Grid cols={3} gap="md">
  <GridItem>項目 1</GridItem>
  <GridItem>項目 2</GridItem>
  <GridItem>項目 3</GridItem>
</Grid>

// 響應式網格
<Grid cols={4} gap="md" responsive={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
  <GridItem>項目 1</GridItem>
  <GridItem>項目 2</GridItem>
  <GridItem>項目 3</GridItem>
  <GridItem>項目 4</GridItem>
</Grid>

// 跨欄網格
<Grid cols={6} gap="md">
  <GridItem span={2}>跨 2 欄</GridItem>
  <GridItem span={4}>跨 4 欄</GridItem>
</Grid>

// 響應式跨欄
<Grid cols={12} gap="md">
  <GridItem span={12} responsive={{ md: 6, lg: 4 }}>
    在小螢幕上佔 12 欄，中螢幕上佔 6 欄，大螢幕上佔 4 欄
  </GridItem>
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
import { Container } from '@/components/common';

// 基本用法
<Container size="lg" centered padding>
  {/* 頁面內容 */}
</Container>

// 不居中的容器
<Container size="md" centered={false} padding>
  {/* 靠左對齊的內容 */}
</Container>

// 無內距的容器
<Container size="xl" padding={false}>
  {/* 無內距的內容 */}
</Container>
```

### AnimatedContainer 動畫容器

用於為頁面或區塊添加進入和退出動畫。

#### 使用範例
```tsx
import { AnimatedContainer } from '@/components/common';

<AnimatedContainer>
  {/* 帶有淡入向上動畫的內容 */}
</AnimatedContainer>
```

## 動畫系統

使用 Framer Motion 實現的預定義動畫變體。

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
import { motion } from 'framer-motion';
import { fadeInUp, cardFlip } from '@/utils/animations';

// 基本用法
<motion.div
  variants={fadeInUp}
  initial="initial"
  animate="animate"
  exit="exit"
>
  內容
</motion.div>

// 卡片翻轉動畫
<motion.div
  variants={cardFlip}
  initial="initial"
  whileHover="flip"
  animate="reveal"
>
  卡片內容
</motion.div>
```

## 工具類別

### 文字漸層
```html
<h1 class="text-gradient">漸層標題文字</h1>
```

### 按鈕樣式
```html
<button class="btn-primary">主要按鈕</button>
<button class="btn-secondary">次要按鈕</button>
```

### 卡片樣式
```html
<div class="card p-4">卡片內容</div>
```

## 最佳實踐

1. **一致性**
   - 在整個應用程式中保持一致的視覺語言
   - 使用預定義的色彩、字體和間距

2. **響應式設計**
   - 始終考慮不同螢幕尺寸的使用者體驗
   - 使用提供的響應式工具和組件

3. **可訪問性**
   - 確保足夠的顏色對比度
   - 提供適當的文字大小和間距
   - 考慮鍵盤導航和螢幕閱讀器支援

4. **性能**
   - 合理使用動畫，避免過度使用
   - 考慮低效能設備的使用者體驗

5. **組件組合**
   - 優先使用組合而非繼承
   - 利用子組件創建複雜的 UI 結構