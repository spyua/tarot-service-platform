# 塔羅占卜網頁應用程式設計文件

## 概述

本設計文件詳細說明塔羅占卜網頁應用程式的技術架構、組件設計、資料結構和實作策略。系統採用純前端靜態實作，確保快速部署、高性能和良好的用戶體驗。

## 技術架構

### 前端技術棧

**核心框架：React 18 + TypeScript**
- 選擇理由：組件化開發、強型別支援、豐富生態系統
- 狀態管理：React Context API + useReducer（避免過度工程化）
- 路由：React Router v6
- 樣式：Tailwind CSS + CSS Modules
- 動畫：Framer Motion（流暢的抽牌和翻牌動畫）

**建構工具：Vite**
- 快速開發伺服器
- 優化的生產建構
- 支援 TypeScript 和 CSS 預處理
- 內建代碼分割和懶加載

**PWA 支援**
- Service Worker：Workbox
- Web App Manifest
- 離線快取策略

### 專案結構

```
src/
├── components/           # 可重用組件
│   ├── common/          # 通用組件
│   ├── cards/           # 塔羅牌相關組件
│   ├── animations/      # 動畫組件
│   └── layout/          # 佈局組件
├── pages/               # 頁面組件
│   ├── Home/
│   ├── FreeReading/     # 無視論抽牌
│   ├── DailyCard/       # 每日抽牌
│   ├── History/         # 歷史記錄
│   └── Settings/        # 設定頁面
├── hooks/               # 自定義 React Hooks
├── services/            # 業務邏輯服務
├── utils/               # 工具函數
├── data/                # 靜態資料
├── types/               # TypeScript 型別定義
├── styles/              # 全域樣式
└── assets/              # 靜態資源
    ├── images/
    │   ├── cards/       # 塔羅牌圖片
    │   └── ui/          # UI 圖片
    └── fonts/
```

## 核心組件設計

### 1. 塔羅牌組件架構

```typescript
// 塔羅牌資料型別
interface TarotCard {
  id: string;
  name: string;
  nameEn: string;
  suit: 'major' | 'cups' | 'wands' | 'swords' | 'pentacles';
  number: number;
  image: string;
  meanings: {
    upright: {
      keywords: string[];
      description: string;
      love: string;
      career: string;
      health: string;
      spiritual: string;
    };
    reversed: {
      keywords: string[];
      description: string;
      love: string;
      career: string;
      health: string;
      spiritual: string;
    };
  };
}

// 抽牌結果型別
interface ReadingResult {
  id: string;
  timestamp: number;
  type: 'free' | 'daily';
  cards: DrawnCard[];
  interpretation: string;
  aspects?: {
    physical: string;
    emotional: string;
    spiritual: string;
  };
}

interface DrawnCard {
  card: TarotCard;
  position: number;
  isReversed: boolean;
  positionMeaning?: string;
}
```

### 2. 抽牌系統設計

**隨機抽牌演算法**
```typescript
class TarotDeck {
  private cards: TarotCard[];
  private usedCards: Set<string> = new Set();

  shuffle(): void {
    // Fisher-Yates 洗牌演算法
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCards(count: number): DrawnCard[] {
    this.shuffle();
    const drawnCards: DrawnCard[] = [];
    
    for (let i = 0; i < count && i < this.cards.length; i++) {
      const card = this.cards[i];
      const isReversed = Math.random() < 0.3; // 30% 機率逆位
      
      drawnCards.push({
        card,
        position: i + 1,
        isReversed,
        positionMeaning: this.getPositionMeaning(i + 1, count)
      });
    }
    
    return drawnCards;
  }
}
```

### 3. 本地存儲策略

**存儲結構設計**
```typescript
interface LocalStorageData {
  readings: ReadingResult[];
  dailyCards: DailyCardRecord[];
  userPreferences: UserPreferences;
  lastCleanup: number;
}

interface DailyCardRecord {
  date: string; // YYYY-MM-DD
  card: DrawnCard;
  aspects: {
    physical: string;
    emotional: string;
    spiritual: string;
  };
}

interface UserPreferences {
  language: 'zh-TW' | 'en';
  theme: 'light' | 'dark' | 'auto';
  animations: boolean;
  notifications: boolean;
}
```

**存儲管理服務**
```typescript
class StorageService {
  private readonly MAX_READINGS = 100;
  private readonly CLEANUP_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7天

  saveReading(reading: ReadingResult): void {
    const data = this.getData();
    data.readings.unshift(reading);
    
    // 限制存儲數量
    if (data.readings.length > this.MAX_READINGS) {
      data.readings = data.readings.slice(0, this.MAX_READINGS);
    }
    
    this.setData(data);
  }

  getDailyCard(date: string): DailyCardRecord | null {
    const data = this.getData();
    return data.dailyCards.find(record => record.date === date) || null;
  }

  cleanup(): void {
    const data = this.getData();
    const now = Date.now();
    
    if (now - data.lastCleanup > this.CLEANUP_INTERVAL) {
      // 清理超過30天的記錄
      const cutoff = now - (30 * 24 * 60 * 60 * 1000);
      data.readings = data.readings.filter(r => r.timestamp > cutoff);
      data.lastCleanup = now;
      this.setData(data);
    }
  }
}
```

## 用戶介面設計

### 視覺設計系統

**色彩方案**
```css
:root {
  /* 主色調 - 神秘紫色系 */
  --primary-50: #faf5ff;
  --primary-100: #f3e8ff;
  --primary-500: #8b5cf6;
  --primary-600: #7c3aed;
  --primary-900: #4c1d95;

  /* 輔助色 - 金色系 */
  --accent-100: #fef3c7;
  --accent-500: #f59e0b;
  --accent-600: #d97706;

  /* 中性色 */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* 語義色彩 */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
}
```

**字體系統**
```css
/* 主要字體 - 優雅的襯線字體 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500;600;700&display=swap');

/* 輔助字體 - 現代無襯線字體 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.font-primary {
  font-family: 'Noto Serif TC', serif;
}

.font-secondary {
  font-family: 'Inter', sans-serif;
}
```

### 響應式設計

**斷點系統**
```css
/* Tailwind CSS 自定義斷點 */
module.exports = {
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  }
}
```

**移動端優化**
- 觸控友好的按鈕尺寸（最小44px）
- 適當的間距和字體大小
- 手勢支援（滑動、點擊、長按）
- 避免hover效果依賴

### 動畫設計

**抽牌動畫**
```typescript
const cardDrawAnimation = {
  initial: { 
    scale: 1, 
    rotateY: 0, 
    z: 0 
  },
  draw: {
    scale: 1.1,
    rotateY: 180,
    z: 50,
    transition: {
      duration: 0.8,
      ease: "easeInOut"
    }
  },
  reveal: {
    scale: 1,
    rotateY: 0,
    z: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.2
    }
  }
};
```

**頁面轉場**
```typescript
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};
```

## 資料結構設計

### 塔羅牌資料庫

**JSON 資料結構**
```json
{
  "majorArcana": [
    {
      "id": "major_00",
      "name": "愚者",
      "nameEn": "The Fool",
      "number": 0,
      "suit": "major",
      "image": "/images/cards/major_00.jpg",
      "meanings": {
        "upright": {
          "keywords": ["新開始", "冒險", "純真", "自由"],
          "description": "愚者代表新的開始和無限的可能性...",
          "love": "在愛情中，愚者暗示著新戀情的開始...",
          "career": "在事業上，愚者鼓勵你勇敢嘗試新的機會...",
          "health": "身體健康方面，愚者提醒你保持樂觀...",
          "spiritual": "靈性層面，愚者象徵著心靈的純淨..."
        },
        "reversed": {
          "keywords": ["魯莽", "缺乏計劃", "愚蠢", "風險"],
          "description": "逆位的愚者警告不要過於衝動...",
          "love": "在感情中可能表示不成熟的態度...",
          "career": "事業上可能因為缺乏規劃而遇到困難...",
          "health": "健康方面需要更加謹慎...",
          "spiritual": "靈性成長需要更多的耐心和智慧..."
        }
      }
    }
  ],
  "minorArcana": {
    "cups": [...],
    "wands": [...],
    "swords": [...],
    "pentacles": [...]
  }
}
```

### 解讀框架

**不同牌數的解讀模板**
```typescript
const interpretationFrameworks = {
  1: {
    name: "單牌指引",
    positions: [
      { name: "核心訊息", description: "當前最重要的指引" }
    ]
  },
  3: {
    name: "三牌展開",
    positions: [
      { name: "過去", description: "影響現況的過去因素" },
      { name: "現在", description: "當前的狀況和挑戰" },
      { name: "未來", description: "可能的發展方向" }
    ]
  },
  5: {
    name: "五芒星展開",
    positions: [
      { name: "中心", description: "核心問題或主題" },
      { name: "火元素", description: "行動和熱情" },
      { name: "水元素", description: "情感和直覺" },
      { name: "風元素", description: "思考和溝通" },
      { name: "土元素", description: "物質和實際" }
    ]
  }
  // ... 其他牌數的框架
};
```

## 性能優化策略

### 圖片優化

**響應式圖片**
```html
<picture>
  <source 
    media="(max-width: 768px)" 
    srcset="/images/cards/small/major_00.webp"
    type="image/webp"
  >
  <source 
    media="(max-width: 768px)" 
    srcset="/images/cards/small/major_00.jpg"
  >
  <source 
    srcset="/images/cards/large/major_00.webp"
    type="image/webp"
  >
  <img 
    src="/images/cards/large/major_00.jpg" 
    alt="愚者牌"
    loading="lazy"
  >
</picture>
```

**圖片預載入策略**
```typescript
class ImagePreloader {
  private cache = new Map<string, HTMLImageElement>();

  preloadCardImages(cardIds: string[]): Promise<void[]> {
    const promises = cardIds.map(id => this.preloadImage(`/images/cards/${id}.jpg`));
    return Promise.all(promises);
  }

  private preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.cache.has(src)) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.cache.set(src, img);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }
}
```

### 代碼分割

**路由層級分割**
```typescript
const Home = lazy(() => import('./pages/Home'));
const FreeReading = lazy(() => import('./pages/FreeReading'));
const DailyCard = lazy(() => import('./pages/DailyCard'));
const History = lazy(() => import('./pages/History'));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/free-reading" element={<FreeReading />} />
          <Route path="/daily-card" element={<DailyCard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

### Service Worker 策略

```typescript
// 快取策略
const cacheStrategy = {
  // 應用程式殼層 - Cache First
  appShell: [
    '/',
    '/static/css/main.css',
    '/static/js/main.js'
  ],
  
  // 塔羅牌圖片 - Stale While Revalidate
  cardImages: '/images/cards/',
  
  // API 資料 - Network First
  apiData: '/api/'
};
```

## 錯誤處理

### 錯誤邊界

```typescript
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('塔羅應用程式錯誤:', error, errorInfo);
    
    // 可選：發送錯誤報告到分析服務
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>哎呀，出現了一些問題</h2>
          <p>請重新整理頁面或稍後再試</p>
          <button onClick={() => window.location.reload()}>
            重新整理
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 測試策略

### 單元測試

```typescript
// 抽牌邏輯測試
describe('TarotDeck', () => {
  let deck: TarotDeck;

  beforeEach(() => {
    deck = new TarotDeck();
  });

  test('應該能夠抽取指定數量的牌', () => {
    const cards = deck.drawCards(3);
    expect(cards).toHaveLength(3);
    expect(cards.every(card => card.card && typeof card.position === 'number')).toBe(true);
  });

  test('抽取的牌不應該重複', () => {
    const cards = deck.drawCards(10);
    const cardIds = cards.map(c => c.card.id);
    const uniqueIds = new Set(cardIds);
    expect(uniqueIds.size).toBe(cardIds.length);
  });
});
```

### 整合測試

```typescript
// 每日抽牌功能測試
describe('每日抽牌功能', () => {
  test('同一天只能抽一次牌', async () => {
    const { getByTestId } = render(<DailyCard />);
    
    // 第一次抽牌
    fireEvent.click(getByTestId('draw-daily-card'));
    await waitFor(() => {
      expect(getByTestId('daily-card-result')).toBeInTheDocument();
    });

    // 嘗試再次抽牌
    expect(getByTestId('draw-daily-card')).toBeDisabled();
  });
});
```

## 部署策略

### 靜態網站部署

**Vercel 部署配置**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### CDN 優化

**資源分發策略**
- 靜態資源：使用 CDN 加速
- 圖片：多尺寸響應式圖片
- 字體：本地託管避免外部依賴
- 關鍵 CSS：內聯到 HTML

## 安全性考量

### 內容安全政策

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               img-src 'self' data: https:; 
               style-src 'self' 'unsafe-inline'; 
               script-src 'self'; 
               connect-src 'self' https://www.google-analytics.com;">
```

### 隱私保護

- 所有資料僅存儲在用戶本地
- 不收集個人識別資訊
- 分析資料匿名化處理
- 提供資料清除功能