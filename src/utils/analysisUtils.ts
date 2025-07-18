import { DailyCardRecord, TarotSuit } from '../types';

/**
 * 分析相關工具函數
 */

/**
 * 統計花色分布
 * @param records 每日抽牌記錄陣列
 * @returns 花色統計結果
 */
export function analyzeSuitDistribution(records: DailyCardRecord[]): {
  [key in TarotSuit]: number;
} & { total: number } {
  const distribution = {
    major: 0,
    cups: 0,
    wands: 0,
    swords: 0,
    pentacles: 0,
    total: records.length,
  };

  records.forEach(record => {
    const suit = record.card.card.suit;
    distribution[suit]++;
  });

  return distribution;
}

/**
 * 統計正逆位分布
 * @param records 每日抽牌記錄陣列
 * @returns 正逆位統計結果
 */
export function analyzeReversedDistribution(records: DailyCardRecord[]): {
  upright: number;
  reversed: number;
  total: number;
  reversedPercentage: number;
} {
  let reversedCount = 0;
  let uprightCount = 0;

  records.forEach(record => {
    if (record.card.isReversed) {
      reversedCount++;
    } else {
      uprightCount++;
    }
  });

  const total = records.length;
  const reversedPercentage = total > 0 ? (reversedCount / total) * 100 : 0;

  return {
    upright: uprightCount,
    reversed: reversedCount,
    total,
    reversedPercentage: Math.round(reversedPercentage * 100) / 100,
  };
}

/**
 * 分析數字分布（僅限小阿卡納）
 * @param records 每日抽牌記錄陣列
 * @returns 數字統計結果
 */
export function analyzeNumberDistribution(records: DailyCardRecord[]): {
  [key: number]: number;
} {
  const distribution: { [key: number]: number } = {};

  records.forEach(record => {
    const card = record.card.card;
    if (card.suit !== 'major' && card.number >= 1 && card.number <= 10) {
      distribution[card.number] = (distribution[card.number] || 0) + 1;
    }
  });

  return distribution;
}

/**
 * 找出最常出現的牌
 * @param records 每日抽牌記錄陣列
 * @param limit 限制數量
 * @returns 最常出現的牌陣列
 */
export function findMostFrequentCards(
  records: DailyCardRecord[],
  limit: number = 5
): Array<{
  cardId: string;
  cardName: string;
  count: number;
  percentage: number;
}> {
  const cardCounts: { [cardId: string]: { name: string; count: number } } = {};

  records.forEach(record => {
    const card = record.card.card;
    if (!cardCounts[card.id]) {
      cardCounts[card.id] = { name: card.name, count: 0 };
    }
    cardCounts[card.id].count++;
  });

  const sortedCards = Object.entries(cardCounts)
    .map(([cardId, data]) => ({
      cardId,
      cardName: data.name,
      count: data.count,
      percentage: Math.round((data.count / records.length) * 10000) / 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return sortedCards;
}

/**
 * 分析連續抽牌模式
 * @param records 每日抽牌記錄陣列（需按日期排序）
 * @returns 連續模式分析結果
 */
export function analyzeStreakPatterns(records: DailyCardRecord[]): {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  streakPercentage: number;
} {
  if (records.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDays: 0,
      streakPercentage: 0,
    };
  }

  // 按日期排序（最新的在前）
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  const todayString = formatDateString(today);

  // 計算當前連續天數
  for (let i = 0; i < sortedRecords.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    const expectedDateString = formatDateString(expectedDate);

    if (sortedRecords[i] && sortedRecords[i].date === expectedDateString) {
      currentStreak++;
    } else {
      break;
    }
  }

  // 計算最長連續天數
  const allDates = sortedRecords.map(r => r.date).sort();
  
  for (let i = 0; i < allDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(allDates[i - 1]);
      const currDate = new Date(allDates[i]);
      const dayDiff = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  const streakPercentage = records.length > 0 ? (longestStreak / records.length) * 100 : 0;

  return {
    currentStreak,
    longestStreak,
    totalDays: records.length,
    streakPercentage: Math.round(streakPercentage * 100) / 100,
  };
}

/**
 * 分析週期性模式（按星期幾）
 * @param records 每日抽牌記錄陣列
 * @returns 週期性模式分析結果
 */
export function analyzeWeeklyPatterns(records: DailyCardRecord[]): {
  [key: string]: {
    count: number;
    percentage: number;
    dominantSuit: TarotSuit;
    reversedPercentage: number;
  };
} {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const weeklyData: { [key: string]: DailyCardRecord[] } = {};

  // 初始化
  weekdays.forEach(day => {
    weeklyData[`星期${day}`] = [];
  });

  // 分組資料
  records.forEach(record => {
    const date = new Date(record.date);
    const weekday = `星期${weekdays[date.getDay()]}`;
    weeklyData[weekday].push(record);
  });

  // 分析每個星期幾的模式
  const result: { [key: string]: any } = {};
  
  Object.entries(weeklyData).forEach(([weekday, dayRecords]) => {
    const count = dayRecords.length;
    const percentage = records.length > 0 ? (count / records.length) * 100 : 0;
    
    // 找出主導花色
    const suitDistribution = analyzeSuitDistribution(dayRecords);
    const dominantSuit = Object.entries(suitDistribution)
      .filter(([suit]) => suit !== 'total')
      .sort(([, a], [, b]) => b - a)[0]?.[0] as TarotSuit || 'major';
    
    // 計算逆位比例
    const reversedData = analyzeReversedDistribution(dayRecords);
    
    result[weekday] = {
      count,
      percentage: Math.round(percentage * 100) / 100,
      dominantSuit,
      reversedPercentage: reversedData.reversedPercentage,
    };
  });

  return result;
}

/**
 * 生成趨勢摘要文字
 * @param records 每日抽牌記錄陣列
 * @param days 分析天數
 * @returns 趨勢摘要
 */
export function generateTrendSummary(
  records: DailyCardRecord[],
  days: number
): string {
  if (records.length === 0) {
    return `最近${days}天尚無抽牌記錄，建議開始每日抽牌以建立個人運勢檔案。`;
  }

  const suitDistribution = analyzeSuitDistribution(records);
  const reversedData = analyzeReversedDistribution(records);
  const streakData = analyzeStreakPatterns(records);

  // 找出主導花色
  const dominantSuit = Object.entries(suitDistribution)
    .filter(([suit]) => suit !== 'total')
    .sort(([, a], [, b]) => b - a)[0];

  const suitNames = {
    major: '大阿卡納',
    cups: '聖杯',
    wands: '權杖',
    swords: '寶劍',
    pentacles: '錢幣',
  };

  let summary = `最近${days}天的運勢分析：\n\n`;
  
  // 主導花色分析
  if (dominantSuit) {
    const [suit, count] = dominantSuit;
    const suitName = suitNames[suit as keyof typeof suitNames];
    const percentage = Math.round((count / records.length) * 100);
    
    summary += `${suitName}能量最為突出（${percentage}%），`;
    
    switch (suit) {
      case 'major':
        summary += '表示你正經歷重要的人生轉折和靈性成長期。';
        break;
      case 'cups':
        summary += '表示情感和人際關係是當前生活的重心。';
        break;
      case 'wands':
        summary += '表示你充滿創造力和行動力，適合開展新計劃。';
        break;
      case 'swords':
        summary += '表示思考和溝通是當前需要關注的重點。';
        break;
      case 'pentacles':
        summary += '表示物質層面和實際事務需要你的專注。';
        break;
    }
  }

  // 正逆位分析
  summary += `\n\n正逆位比例：正位${reversedData.upright}張（${Math.round(100 - reversedData.reversedPercentage)}%），逆位${reversedData.reversed}張（${reversedData.reversedPercentage}%）。`;
  
  if (reversedData.reversedPercentage > 60) {
    summary += '逆位牌較多，建議多關注內在調整和反思。';
  } else if (reversedData.reversedPercentage < 30) {
    summary += '正位牌居多，能量流動順暢，是積極行動的好時期。';
  } else {
    summary += '正逆位比例平衡，表示你正穩定地處理各種挑戰。';
  }

  // 連續抽牌分析
  if (streakData.currentStreak > 0) {
    summary += `\n\n目前已連續抽牌${streakData.currentStreak}天，`;
    if (streakData.currentStreak >= 7) {
      summary += '堅持得很好！持續的自我覺察有助於靈性成長。';
    } else {
      summary += '繼續保持這個好習慣。';
    }
  }

  return summary;
}

/**
 * 格式化日期字符串
 * @param date 日期對象
 * @returns YYYY-MM-DD 格式字符串
 */
function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 計算兩個時期的變化趨勢
 * @param currentRecords 當前時期記錄
 * @param previousRecords 之前時期記錄
 * @returns 變化趨勢分析
 */
export function comparePeriods(
  currentRecords: DailyCardRecord[],
  previousRecords: DailyCardRecord[]
): {
  suitChange: string;
  reversedTrend: string;
  overallTrend: string;
} {
  const currentSuit = analyzeSuitDistribution(currentRecords);
  const previousSuit = analyzeSuitDistribution(previousRecords);
  const currentReversed = analyzeReversedDistribution(currentRecords);
  const previousReversed = analyzeReversedDistribution(previousRecords);

  // 找出當前和之前的主導花色
  const getCurrentDominant = () => {
    return Object.entries(currentSuit)
      .filter(([suit]) => suit !== 'total')
      .sort(([, a], [, b]) => b - a)[0]?.[0];
  };

  const getPreviousDominant = () => {
    return Object.entries(previousSuit)
      .filter(([suit]) => suit !== 'total')
      .sort(([, a], [, b]) => b - a)[0]?.[0];
  };

  const currentDominant = getCurrentDominant();
  const previousDominant = getPreviousDominant();

  // 花色變化分析
  let suitChange = '';
  if (currentDominant !== previousDominant) {
    const suitNames = {
      major: '大阿卡納',
      cups: '聖杯',
      wands: '權杖',
      swords: '寶劍',
      pentacles: '錢幣',
    };
    
    suitChange = `主導能量從${suitNames[previousDominant as keyof typeof suitNames] || '未知'}轉向${suitNames[currentDominant as keyof typeof suitNames] || '未知'}`;
  } else {
    suitChange = '主導能量保持穩定';
  }

  // 逆位趨勢分析
  const reversedDiff = currentReversed.reversedPercentage - previousReversed.reversedPercentage;
  let reversedTrend = '';
  
  if (Math.abs(reversedDiff) < 5) {
    reversedTrend = '逆位比例保持穩定';
  } else if (reversedDiff > 0) {
    reversedTrend = `逆位比例上升${Math.round(reversedDiff)}%，需要更多內在調整`;
  } else {
    reversedTrend = `逆位比例下降${Math.round(Math.abs(reversedDiff))}%，能量流動更加順暢`;
  }

  // 整體趨勢
  let overallTrend = '';
  if (reversedDiff > 10) {
    overallTrend = '整體趨勢偏向內省和調整期';
  } else if (reversedDiff < -10) {
    overallTrend = '整體趨勢偏向積極行動期';
  } else {
    overallTrend = '整體趨勢保持平衡發展';
  }

  return {
    suitChange,
    reversedTrend,
    overallTrend,
  };
}