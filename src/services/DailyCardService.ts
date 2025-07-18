import { v4 as uuidv4 } from 'uuid';
import {
  DailyCardRecord,
  DailyAspects,
  DrawnCard,
  TarotCard,
  ReadingResult,
} from '../types';
import { tarotDeck } from './TarotDeck';
import { storageService } from './StorageService';

/**
 * 每日抽牌服務類別
 * 負責管理每日抽牌的邏輯和分析
 */
export class DailyCardService {
  /**
   * 檢查今日是否已抽牌
   * @returns 是否已抽牌
   */
  public hasTodayCard(): boolean {
    return storageService.hasTodayCard();
  }

  /**
   * 獲取今日的抽牌記錄
   * @returns 今日抽牌記錄或 undefined
   */
  public getTodayCard(): DailyCardRecord | undefined {
    const today = this.formatDate(new Date());
    return storageService.getDailyCard(today);
  }

  /**
   * 抽取今日指導牌
   * @returns 每日抽牌記錄
   */
  public drawTodayCard(): DailyCardRecord {
    // 檢查是否已抽過牌
    if (this.hasTodayCard()) {
      const existingCard = this.getTodayCard();
      if (existingCard) {
        return existingCard;
      }
    }

    // 抽取一張牌
    const drawnCards = tarotDeck.drawCards({
      cardCount: 1,
      allowReversed: true,
      reversedProbability: 0.3,
    });

    const drawnCard = drawnCards[0];
    const today = this.formatDate(new Date());

    // 生成三面向分析
    const aspects = this.generateDailyAspects(drawnCard);

    // 創建每日抽牌記錄
    const dailyRecord: DailyCardRecord = {
      date: today,
      card: drawnCard,
      aspects,
    };

    // 保存記錄
    storageService.saveDailyCard(dailyRecord);

    // 同時保存為一般占卜記錄
    const readingResult: ReadingResult = {
      id: uuidv4(),
      timestamp: Date.now(),
      type: 'daily',
      cards: [drawnCard],
      interpretation: this.generateDailyInterpretation(drawnCard, aspects),
      aspects,
    };

    storageService.saveReading(readingResult);

    return dailyRecord;
  }

  /**
   * 生成每日三面向分析
   * @param drawnCard 抽到的牌
   * @returns 三面向分析
   */
  private generateDailyAspects(drawnCard: DrawnCard): DailyAspects {
    const { card, isReversed } = drawnCard;
    const meanings = isReversed ? card.meanings.reversed : card.meanings.upright;

    return {
      physical: this.generatePhysicalAspect(card, isReversed, meanings),
      emotional: this.generateEmotionalAspect(card, isReversed, meanings),
      spiritual: this.generateSpiritualAspect(card, isReversed, meanings),
    };
  }

  /**
   * 生成身體健康面向分析
   * @param card 塔羅牌
   * @param isReversed 是否逆位
   * @param meanings 牌義
   * @returns 身體健康分析
   */
  private generatePhysicalAspect(
    card: TarotCard,
    isReversed: boolean,
    meanings: any
  ): string {
    let analysis = `【身體健康】\n`;
    
    // 基於牌義的健康建議
    analysis += meanings.health || meanings.description;
    
    // 根據花色添加特定建議
    switch (card.suit) {
      case 'cups':
        analysis += isReversed 
          ? '\n注意情緒對身體的影響，避免因壓力導致的身體不適。建議多喝水，保持充足睡眠。'
          : '\n身體狀況良好，情緒平衡有助於維持健康。適合進行溫和的運動或放鬆活動。';
        break;
      case 'wands':
        analysis += isReversed
          ? '\n避免過度勞累，注意休息。可能需要調整工作節奏，避免燃燒殆盡。'
          : '\n精力充沛，適合進行積極的運動。保持活力的同時也要注意適度休息。';
        break;
      case 'swords':
        analysis += isReversed
          ? '\n注意精神壓力對身體的影響。建議進行冥想或深呼吸練習來緩解緊張。'
          : '\n思維清晰有助於做出健康的選擇。適合制定健康計劃並付諸實行。';
        break;
      case 'pentacles':
        analysis += isReversed
          ? '\n注意飲食習慣和生活規律。避免因忙碌而忽略基本的健康需求。'
          : '\n身體基礎穩固，適合建立長期的健康習慣。注重營養均衡和規律作息。';
        break;
      case 'major':
        analysis += isReversed
          ? '\n重要的健康轉折期，需要特別關注身體信號。建議尋求專業建議。'
          : '\n身心靈整體平衡的重要時期。適合進行全面的健康檢視和調整。';
        break;
    }

    return analysis;
  }

  /**
   * 生成心理情緒面向分析
   * @param card 塔羅牌
   * @param isReversed 是否逆位
   * @param meanings 牌義
   * @returns 心理情緒分析
   */
  private generateEmotionalAspect(
    card: TarotCard,
    isReversed: boolean,
    meanings: any
  ): string {
    let analysis = `【心理情緒】\n`;
    
    // 基於牌義的情緒分析
    const keywords = meanings.keywords.slice(0, 3).join('、');
    analysis += `今日情緒關鍵字：${keywords}\n`;
    
    // 根據正逆位提供不同建議
    if (isReversed) {
      analysis += `${card.name}逆位提醒你注意內在的情緒波動。`;
      
      switch (card.suit) {
        case 'cups':
          analysis += '可能感到情感上的困惑或失落。建議給自己一些時間處理情緒，不要急於做決定。';
          break;
        case 'wands':
          analysis += '可能感到挫折或缺乏動力。試著重新點燃內心的熱情，從小目標開始。';
          break;
        case 'swords':
          analysis += '思緒可能較為混亂或焦慮。建議透過寫作或談話來整理思緒。';
          break;
        case 'pentacles':
          analysis += '可能對現實狀況感到不安。專注於可以控制的事情，一步步改善。';
          break;
        case 'major':
          analysis += '正經歷重要的情緒轉化期。接受變化，相信這是成長的必經過程。';
          break;
      }
    } else {
      analysis += `${card.name}正位帶來正面的情緒能量。`;
      
      switch (card.suit) {
        case 'cups':
          analysis += '情感豐富且平衡，適合表達愛意和關懷。與他人的連結會帶來喜悅。';
          break;
        case 'wands':
          analysis += '充滿熱情和創造力。這是追求夢想和開始新計劃的好時機。';
          break;
        case 'swords':
          analysis += '思維清晰，能夠理性分析問題。適合做重要決定或解決複雜問題。';
          break;
        case 'pentacles':
          analysis += '情緒穩定，對未來充滿信心。適合制定長期計劃和目標。';
          break;
        case 'major':
          analysis += '情緒層面正經歷重要的正向轉變。擁抱這個成長機會。';
          break;
      }
    }

    return analysis;
  }

  /**
   * 生成靈性成長面向分析
   * @param card 塔羅牌
   * @param isReversed 是否逆位
   * @param meanings 牌義
   * @returns 靈性成長分析
   */
  private generateSpiritualAspect(
    card: TarotCard,
    isReversed: boolean,
    meanings: any
  ): string {
    let analysis = `【靈性成長】\n`;
    
    // 基於牌義的靈性指導
    analysis += meanings.spiritual || meanings.description;
    
    // 根據牌的數字提供成長階段分析
    if (card.suit === 'major') {
      analysis += `\n大阿卡納第${card.number}號牌代表靈性旅程中的重要階段。`;
      
      if (card.number <= 7) {
        analysis += '你正處於靈性覺醒的初期階段，保持開放的心態學習。';
      } else if (card.number <= 14) {
        analysis += '你正在深化靈性理解，整合所學的智慧。';
      } else {
        analysis += '你已達到較高的靈性層次，可以指導他人的成長。';
      }
    } else {
      // 小阿卡納的靈性指導
      switch (card.suit) {
        case 'cups':
          analysis += isReversed
            ? '\n靈性層面需要更多的自我關愛和內在療癒。透過冥想或藝術創作來連結內心。'
            : '\n直覺力強化，適合進行靈性實踐。信任內在的聲音和感受。';
          break;
        case 'wands':
          analysis += isReversed
            ? '\n靈性熱忱可能暫時低落。重新連結你的核心價值和人生目標。'
            : '\n靈性能量活躍，適合探索新的靈性實踐或哲學思想。';
          break;
        case 'swords':
          analysis += isReversed
            ? '\n需要釋放限制性的思維模式。透過學習和反思來擴展意識。'
            : '\n智慧和洞察力增強。適合深入研究靈性知識或哲學。';
          break;
        case 'pentacles':
          analysis += isReversed
            ? '\n靈性與物質世界的平衡需要調整。不要忽略精神層面的需求。'
            : '\n能夠將靈性智慧實際應用於日常生活中。理論與實踐並重。';
          break;
      }
    }

    // 根據數字提供具體建議
    if (card.number >= 1 && card.number <= 10) {
      const numberGuidance = this.getNumberGuidance(card.number);
      analysis += `\n數字${card.number}的靈性意義：${numberGuidance}`;
    }

    return analysis;
  }

  /**
   * 根據數字獲取靈性指導
   * @param number 牌的數字
   * @returns 數字的靈性意義
   */
  private getNumberGuidance(number: number): string {
    const guidances = {
      1: '新開始和原創力。適合設定新的靈性目標。',
      2: '平衡和合作。尋求內在的和諧與外在的連結。',
      3: '創造和表達。透過創意活動來表達靈性理解。',
      4: '穩定和建構。建立穩固的靈性基礎和日常實踐。',
      5: '變化和挑戰。擁抱變化作為成長的催化劑。',
      6: '和諧和服務。透過服務他人來實現靈性成長。',
      7: '內省和智慧。深入內在探索，尋求更深層的理解。',
      8: '力量和成就。運用靈性力量來實現目標。',
      9: '完成和智慧。分享你的靈性智慧和經驗。',
      10: '完滿和轉化。一個週期的結束和新週期的開始。',
    };

    return guidances[number as keyof typeof guidances] || '持續你的靈性探索之旅。';
  }

  /**
   * 生成每日占卜的完整解讀
   * @param drawnCard 抽到的牌
   * @param aspects 三面向分析
   * @returns 完整解讀文字
   */
  private generateDailyInterpretation(
    drawnCard: DrawnCard,
    aspects: DailyAspects
  ): string {
    const { card, isReversed } = drawnCard;
    const meanings = isReversed ? card.meanings.reversed : card.meanings.upright;

    let interpretation = `【每日指導牌】\n\n`;
    interpretation += `今日抽到：${card.name}${isReversed ? '（逆位）' : '（正位）'}\n`;
    interpretation += `關鍵字：${meanings.keywords.join('、')}\n\n`;
    interpretation += `${meanings.description}\n\n`;
    
    interpretation += `${aspects.physical}\n\n`;
    interpretation += `${aspects.emotional}\n\n`;
    interpretation += `${aspects.spiritual}\n\n`;

    interpretation += `【今日建議】\n`;
    interpretation += this.generateDailyAdvice(card, isReversed);

    return interpretation;
  }

  /**
   * 生成每日建議
   * @param card 塔羅牌
   * @param isReversed 是否逆位
   * @returns 每日建議
   */
  private generateDailyAdvice(card: TarotCard, isReversed: boolean): string {
    const timeOfDay = new Date().getHours();
    let advice = '';

    // 根據時間段提供不同建議
    if (timeOfDay < 12) {
      advice += '今日上午，';
    } else if (timeOfDay < 18) {
      advice += '今日下午，';
    } else {
      advice += '今日晚上，';
    }

    // 根據牌面和正逆位提供建議
    if (isReversed) {
      advice += `${card.name}逆位提醒你需要內省和調整。`;
      
      switch (card.suit) {
        case 'major':
          advice += '這是重要的轉折點，耐心等待時機成熟。';
          break;
        case 'cups':
          advice += '關注內在情感需求，給自己一些獨處時間。';
          break;
        case 'wands':
          advice += '重新評估你的目標和方向，避免盲目行動。';
          break;
        case 'swords':
          advice += '放慢思考節奏，避免過度分析造成困擾。';
          break;
        case 'pentacles':
          advice += '檢視你的資源和計劃，做必要的調整。';
          break;
      }
    } else {
      advice += `${card.name}正位帶來正面能量。`;
      
      switch (card.suit) {
        case 'major':
          advice += '把握這個重要機會，勇敢向前邁進。';
          break;
        case 'cups':
          advice += '開放心胸接受愛與被愛，表達你的情感。';
          break;
        case 'wands':
          advice += '發揮你的創造力和熱情，積極行動。';
          break;
        case 'swords':
          advice += '運用你的智慧和洞察力，做出明智決定。';
          break;
        case 'pentacles':
          advice += '專注於實際行動，穩步實現你的目標。';
          break;
      }
    }

    return advice;
  }

  /**
   * 獲取每日抽牌歷史記錄
   * @param limit 限制數量，默認30天
   * @returns 歷史記錄陣列
   */
  public getDailyCardHistory(limit: number = 30): DailyCardRecord[] {
    const allRecords = storageService.getAllDailyCards();
    return allRecords.slice(0, limit);
  }

  /**
   * 分析週期性運勢趨勢
   * @param days 分析天數，默認7天
   * @returns 趨勢分析結果
   */
  public analyzeTrends(days: number = 7): {
    period: string;
    dominantSuit: string;
    reversedPercentage: number;
    majorArcanaCount: number;
    trendSummary: string;
    recommendations: string[];
    aspectTrends: {
      physical: string;
      emotional: string;
      spiritual: string;
    };
    elementDistribution: {
      fire: number;
      water: number;
      air: number;
      earth: number;
    };
    numberPatterns: {
      mostCommonNumber: number;
      numberMeaning: string;
    };
  } {
    const history = this.getDailyCardHistory(days);
    
    if (history.length === 0) {
      return {
        period: `最近${days}天`,
        dominantSuit: '無資料',
        reversedPercentage: 0,
        majorArcanaCount: 0,
        trendSummary: '尚無足夠資料進行趨勢分析',
        recommendations: ['開始每日抽牌以建立趨勢分析基礎'],
        aspectTrends: {
          physical: '尚無資料',
          emotional: '尚無資料',
          spiritual: '尚無資料',
        },
        elementDistribution: {
          fire: 0,
          water: 0,
          air: 0,
          earth: 0,
        },
        numberPatterns: {
          mostCommonNumber: 0,
          numberMeaning: '尚無資料',
        },
      };
    }

    // 統計花色分布
    const suitCounts = {
      major: 0,
      cups: 0,
      wands: 0,
      swords: 0,
      pentacles: 0,
    };

    // 統計元素分布
    const elementCounts = {
      fire: 0,  // 權杖
      water: 0, // 聖杯
      air: 0,   // 寶劍
      earth: 0, // 錢幣
    };

    // 統計數字分布
    const numberCounts: Record<number, number> = {};

    let reversedCount = 0;
    let majorArcanaCount = 0;

    // 收集關鍵字和主題
    const physicalKeywords: string[] = [];
    const emotionalKeywords: string[] = [];
    const spiritualKeywords: string[] = [];

    history.forEach(record => {
      const { card, isReversed } = record.card;
      suitCounts[card.suit]++;
      
      if (isReversed) reversedCount++;
      if (card.suit === 'major') majorArcanaCount++;

      // 統計元素
      if (card.suit === 'wands') elementCounts.fire++;
      else if (card.suit === 'cups') elementCounts.water++;
      else if (card.suit === 'swords') elementCounts.air++;
      else if (card.suit === 'pentacles') elementCounts.earth++;

      // 統計數字
      if (numberCounts[card.number]) {
        numberCounts[card.number]++;
      } else {
        numberCounts[card.number] = 1;
      }

      // 收集關鍵字
      const meanings = isReversed ? card.meanings.reversed : card.meanings.upright;
      if (record.aspects.physical) {
        physicalKeywords.push(...meanings.keywords.slice(0, 2));
      }
      if (record.aspects.emotional) {
        emotionalKeywords.push(...meanings.keywords.slice(0, 2));
      }
      if (record.aspects.spiritual) {
        spiritualKeywords.push(...meanings.keywords.slice(0, 2));
      }
    });

    // 找出主導花色
    const dominantSuit = Object.entries(suitCounts)
      .sort(([, a], [, b]) => b - a)[0][0];

    const reversedPercentage = (reversedCount / history.length) * 100;

    // 找出最常見的數字
    const mostCommonNumber = Object.entries(numberCounts)
      .sort(([, a], [, b]) => b - a)[0][0];

    // 生成趨勢摘要
    const trendSummary = this.generateTrendSummary(
      dominantSuit,
      reversedPercentage,
      majorArcanaCount,
      history.length
    );

    // 生成建議
    const recommendations = this.generateTrendRecommendations(
      dominantSuit,
      reversedPercentage,
      majorArcanaCount
    );

    // 生成三面向趨勢分析
    const aspectTrends = {
      physical: this.generateAspectTrend(physicalKeywords, 'physical'),
      emotional: this.generateAspectTrend(emotionalKeywords, 'emotional'),
      spiritual: this.generateAspectTrend(spiritualKeywords, 'spiritual'),
    };

    return {
      period: `最近${days}天`,
      dominantSuit: this.getSuitName(dominantSuit),
      reversedPercentage: Math.round(reversedPercentage),
      majorArcanaCount,
      trendSummary,
      recommendations,
      aspectTrends,
      elementDistribution: elementCounts,
      numberPatterns: {
        mostCommonNumber: parseInt(mostCommonNumber),
        numberMeaning: this.getNumberGuidance(parseInt(mostCommonNumber)),
      },
    };
  }
  
  /**
   * 生成面向趨勢分析
   * @param keywords 關鍵字陣列
   * @param aspectType 面向類型
   * @returns 面向趨勢分析
   */
  private generateAspectTrend(keywords: string[], aspectType: 'physical' | 'emotional' | 'spiritual'): string {
    if (keywords.length === 0) {
      return '尚無足夠資料';
    }

    // 計算關鍵字頻率
    const keywordFrequency: Record<string, number> = {};
    keywords.forEach(keyword => {
      if (keywordFrequency[keyword]) {
        keywordFrequency[keyword]++;
      } else {
        keywordFrequency[keyword] = 1;
      }
    });

    // 找出最常見的關鍵字
    const topKeywords = Object.entries(keywordFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([keyword]) => keyword);

    let trend = '';

    switch (aspectType) {
      case 'physical':
        trend = `身體健康方面，近期趨勢顯示「${topKeywords.join('」、「')}」是主要關鍵字。`;
        if (topKeywords.some(k => ['疲勞', '壓力', '緊張', '不適'].includes(k))) {
          trend += '建議適當休息，注意身體需求，避免過度勞累。';
        } else if (topKeywords.some(k => ['活力', '能量', '健康', '平衡'].includes(k))) {
          trend += '身體狀況良好，可以適度增加運動量，保持健康習慣。';
        } else {
          trend += '保持均衡飲食和規律作息，關注身體發出的信號。';
        }
        break;
      
      case 'emotional':
        trend = `情緒方面，近期趨勢顯示「${topKeywords.join('」、「')}」是主要情緒狀態。`;
        if (topKeywords.some(k => ['焦慮', '憂慮', '恐懼', '悲傷'].includes(k))) {
          trend += '建議尋找情緒出口，與親友交流或透過藝術表達內在感受。';
        } else if (topKeywords.some(k => ['喜悅', '平靜', '滿足', '愛'].includes(k))) {
          trend += '情緒狀態穩定正面，適合深化人際關係和創造美好體驗。';
        } else {
          trend += '保持情緒覺察，接納各種感受，尋找內在平衡。';
        }
        break;
      
      case 'spiritual':
        trend = `靈性成長方面，近期趨勢顯示「${topKeywords.join('」、「')}」是主要發展方向。`;
        if (topKeywords.some(k => ['覺醒', '轉變', '智慧', '成長'].includes(k))) {
          trend += '正處於重要的靈性成長階段，可以深入探索內在智慧和生命意義。';
        } else if (topKeywords.some(k => ['迷惑', '阻礙', '考驗', '挑戰'].includes(k))) {
          trend += '面臨靈性考驗，透過冥想和反思來克服內在障礙。';
        } else {
          trend += '持續靈性實踐，保持開放心態，接收宇宙訊息。';
        }
        break;
    }

    return trend;
  }

  /**
   * 生成趨勢摘要
   */
  private generateTrendSummary(
    dominantSuit: string,
    reversedPercentage: number,
    majorArcanaCount: number,
    totalDays: number
  ): string {
    let summary = '';

    // 分析主導花色
    const suitName = this.getSuitName(dominantSuit);
    summary += `在這段期間，${suitName}能量最為突出，`;

    switch (dominantSuit) {
      case 'major':
        summary += '表示你正經歷重要的人生轉折和靈性成長。';
        break;
      case 'cups':
        summary += '表示情感和關係是你生活的重心。';
        break;
      case 'wands':
        summary += '表示你充滿熱情和創造力，適合開展新計劃。';
        break;
      case 'swords':
        summary += '表示思考和溝通是當前的主要課題。';
        break;
      case 'pentacles':
        summary += '表示物質和實際事務需要你的關注。';
        break;
    }

    // 分析逆位比例
    if (reversedPercentage > 60) {
      summary += `逆位牌比例較高（${Math.round(reversedPercentage)}%），建議多關注內在調整和反思。`;
    } else if (reversedPercentage < 30) {
      summary += `正位牌居多，能量流動順暢，是積極行動的好時期。`;
    } else {
      summary += `正逆位比例平衡，表示你正在穩定地處理各種挑戰。`;
    }

    // 分析大阿卡納比例
    const majorPercentage = (majorArcanaCount / totalDays) * 100;
    if (majorPercentage > 40) {
      summary += `大阿卡納牌出現頻繁，表示這是一個充滿重要機會和挑戰的時期。`;
    }

    return summary;
  }

  /**
   * 生成趨勢建議
   */
  private generateTrendRecommendations(
    dominantSuit: string,
    reversedPercentage: number,
    majorArcanaCount: number
  ): string[] {
    const recommendations: string[] = [];

    // 基於主導花色的建議
    switch (dominantSuit) {
      case 'major':
        recommendations.push('關注人生重大課題，尋求深層的自我理解');
        recommendations.push('保持開放心態，接受生命中的重要轉變');
        break;
      case 'cups':
        recommendations.push('重視情感健康，加強與他人的連結');
        recommendations.push('透過藝術或創意活動表達內在情感');
        break;
      case 'wands':
        recommendations.push('發揮創造力，勇敢追求你的熱情');
        recommendations.push('制定明確目標，積極採取行動');
        break;
      case 'swords':
        recommendations.push('加強溝通技巧，理性分析問題');
        recommendations.push('透過學習和思考來解決困難');
        break;
      case 'pentacles':
        recommendations.push('專注於實際目標，建立穩固基礎');
        recommendations.push('重視財務規劃和健康管理');
        break;
    }

    // 基於逆位比例的建議
    if (reversedPercentage > 50) {
      recommendations.push('增加內省時間，關注內在需求');
      recommendations.push('暫緩重大決定，先處理內在阻礙');
    } else {
      recommendations.push('把握當前的正面能量，積極向前');
      recommendations.push('分享你的正面經驗，幫助他人成長');
    }

    // 基於大阿卡納數量的建議
    if (majorArcanaCount > 2) {
      recommendations.push('記錄重要的洞察和學習，這些將成為珍貴的智慧');
      recommendations.push('尋求導師或靈性指導，深化你的理解');
    }

    return recommendations;
  }

  /**
   * 獲取花色中文名稱
   */
  private getSuitName(suit: string): string {
    const suitNames = {
      major: '大阿卡納',
      cups: '聖杯',
      wands: '權杖',
      swords: '寶劍',
      pentacles: '錢幣',
    };

    return suitNames[suit as keyof typeof suitNames] || suit;
  }

  /**
   * 格式化日期為 YYYY-MM-DD 字符串
   * @param date 日期對象
   * @returns 格式化的日期字符串
   */
  private formatDate(date: Date): string {
    return storageService.formatDate(date);
  }

  /**
   * 獲取連續抽牌天數
   * @returns 連續天數
   */
  public getDailyStreak(): number {
    const history = storageService.getAllDailyCards();
    if (history.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < history.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = this.formatDate(checkDate);
      
      const record = history.find(r => r.date === dateString);
      if (record) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * 獲取週期性趨勢比較
   * 比較兩個時間段的趨勢差異
   * @param currentDays 當前時間段天數
   * @param previousDays 前一時間段天數
   * @returns 趨勢比較結果
   */
  public compareTrendPeriods(currentDays: number = 7, previousDays: number = 7): {
    currentPeriod: string;
    previousPeriod: string;
    suitChanges: Record<string, number>;
    reversedChange: number;
    majorArcanaChange: number;
    summary: string;
    elementChanges: {
      fire: number;
      water: number;
      air: number;
      earth: number;
    };
  } {
    // 獲取所有歷史記錄
    const allHistory = storageService.getAllDailyCards();
    if (allHistory.length < currentDays + previousDays) {
      return {
        currentPeriod: `最近${currentDays}天`,
        previousPeriod: `前${previousDays}天`,
        suitChanges: {
          major: 0,
          cups: 0,
          wands: 0,
          swords: 0,
          pentacles: 0,
        },
        reversedChange: 0,
        majorArcanaChange: 0,
        summary: '尚無足夠資料進行趨勢比較分析',
        elementChanges: {
          fire: 0,
          water: 0,
          air: 0,
          earth: 0,
        },
      };
    }

    // 分割當前和前一時間段的記錄
    const currentHistory = allHistory.slice(0, currentDays);
    const previousHistory = allHistory.slice(currentDays, currentDays + previousDays);

    // 分析當前時間段
    const currentSuitCounts = {
      major: 0,
      cups: 0,
      wands: 0,
      swords: 0,
      pentacles: 0,
    };
    const currentElementCounts = {
      fire: 0,
      water: 0,
      air: 0,
      earth: 0,
    };
    let currentReversedCount = 0;
    let currentMajorCount = 0;

    currentHistory.forEach(record => {
      const { card, isReversed } = record.card;
      currentSuitCounts[card.suit]++;
      
      if (isReversed) currentReversedCount++;
      if (card.suit === 'major') currentMajorCount++;

      // 統計元素
      if (card.suit === 'wands') currentElementCounts.fire++;
      else if (card.suit === 'cups') currentElementCounts.water++;
      else if (card.suit === 'swords') currentElementCounts.air++;
      else if (card.suit === 'pentacles') currentElementCounts.earth++;
    });

    // 分析前一時間段
    const previousSuitCounts = {
      major: 0,
      cups: 0,
      wands: 0,
      swords: 0,
      pentacles: 0,
    };
    const previousElementCounts = {
      fire: 0,
      water: 0,
      air: 0,
      earth: 0,
    };
    let previousReversedCount = 0;
    let previousMajorCount = 0;

    previousHistory.forEach(record => {
      const { card, isReversed } = record.card;
      previousSuitCounts[card.suit]++;
      
      if (isReversed) previousReversedCount++;
      if (card.suit === 'major') previousMajorCount++;

      // 統計元素
      if (card.suit === 'wands') previousElementCounts.fire++;
      else if (card.suit === 'cups') previousElementCounts.water++;
      else if (card.suit === 'swords') previousElementCounts.air++;
      else if (card.suit === 'pentacles') previousElementCounts.earth++;
    });

    // 計算變化
    const suitChanges = {
      major: currentSuitCounts.major - previousSuitCounts.major,
      cups: currentSuitCounts.cups - previousSuitCounts.cups,
      wands: currentSuitCounts.wands - previousSuitCounts.wands,
      swords: currentSuitCounts.swords - previousSuitCounts.swords,
      pentacles: currentSuitCounts.pentacles - previousSuitCounts.pentacles,
    };

    const elementChanges = {
      fire: currentElementCounts.fire - previousElementCounts.fire,
      water: currentElementCounts.water - previousElementCounts.water,
      air: currentElementCounts.air - previousElementCounts.air,
      earth: currentElementCounts.earth - previousElementCounts.earth,
    };

    const currentReversedPercentage = (currentReversedCount / currentHistory.length) * 100;
    const previousReversedPercentage = (previousReversedCount / previousHistory.length) * 100;
    const reversedChange = currentReversedPercentage - previousReversedPercentage;

    const majorArcanaChange = currentMajorCount - previousMajorCount;

    // 生成摘要
    let summary = '';

    // 分析花色變化
    const significantSuitChange = Object.entries(suitChanges)
      .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))[0];
    
    if (Math.abs(parseInt(significantSuitChange[1].toString())) >= 2) {
      const suitName = this.getSuitName(significantSuitChange[0]);
      if (significantSuitChange[1] > 0) {
        summary += `相較於前一時期，${suitName}能量明顯增強，`;
      } else {
        summary += `相較於前一時期，${suitName}能量明顯減弱，`;
      }

      switch (significantSuitChange[0]) {
        case 'major':
          summary += '表示你正進入一個更重要的人生階段。';
          break;
        case 'cups':
          summary += '表示情感和關係領域的變化。';
          break;
        case 'wands':
          summary += '表示創造力和熱情方面的轉變。';
          break;
        case 'swords':
          summary += '表示思考模式和溝通方式的調整。';
          break;
        case 'pentacles':
          summary += '表示物質和實際事務的重心轉移。';
          break;
      }
    }

    // 分析逆位變化
    if (Math.abs(reversedChange) >= 20) {
      if (reversedChange > 0) {
        summary += '逆位牌比例明顯增加，表示你可能正面臨更多內在挑戰，需要更多自我反思。';
      } else {
        summary += '逆位牌比例明顯減少，表示你正在克服內在障礙，能量流動更加順暢。';
      }
    }

    // 分析大阿卡納變化
    if (Math.abs(majorArcanaChange) >= 2) {
      if (majorArcanaChange > 0) {
        summary += '大阿卡納牌出現頻率增加，表示你正進入一個更具命運意義的時期。';
      } else {
        summary += '大阿卡納牌出現頻率減少，表示你正從重大轉折進入較為穩定的階段。';
      }
    }

    // 如果沒有明顯變化
    if (summary === '') {
      summary = '兩個時期的整體能量相似，表示你正處於相對穩定的發展階段。';
    }

    return {
      currentPeriod: `最近${currentDays}天`,
      previousPeriod: `前${previousDays}天`,
      suitChanges,
      reversedChange: Math.round(reversedChange),
      majorArcanaChange,
      summary,
      elementChanges,
    };
  }

  /**
   * 獲取月度趨勢分析
   * @returns 月度趨勢分析結果
   */
  public getMonthlyTrends(): {
    currentMonth: {
      period: string;
      analysis: ReturnType<DailyCardService['analyzeTrends']>;
    };
    previousMonth: {
      period: string;
      analysis: ReturnType<DailyCardService['analyzeTrends']>;
    };
    comparison: ReturnType<DailyCardService['compareTrendPeriods']>;
  } {
    const today = new Date();
    const currentMonthDays = today.getDate();
    
    // 上個月的天數
    const lastMonth = new Date(today);
    lastMonth.setDate(0); // 設為上個月的最後一天
    const previousMonthDays = Math.min(30, lastMonth.getDate());

    return {
      currentMonth: {
        period: `本月 (${today.getMonth() + 1}月)`,
        analysis: this.analyzeTrends(currentMonthDays),
      },
      previousMonth: {
        period: `上月 (${today.getMonth() === 0 ? 12 : today.getMonth()}月)`,
        analysis: this.analyzeTrends(previousMonthDays),
      },
      comparison: this.compareTrendPeriods(currentMonthDays, previousMonthDays),
    };
  }

  /**
   * 匯出每日抽牌歷史記錄
   * @param format 匯出格式 ('json' | 'text')
   * @param days 匯出天數，默認全部
   * @returns 匯出的資料字符串
   */
  public exportDailyCardHistory(format: 'json' | 'text' = 'json', days?: number): string {
    const history = days ? this.getDailyCardHistory(days) : storageService.getAllDailyCards();
    
    if (format === 'json') {
      return JSON.stringify(history, null, 2);
    } else {
      // 文字格式匯出
      let result = '每日塔羅牌歷史記錄\n\n';
      
      history.forEach(record => {
        const { date, card, aspects } = record;
        const { card: tarotCard, isReversed } = card;
        
        result += `日期: ${date}\n`;
        result += `牌名: ${tarotCard.name}${isReversed ? ' (逆位)' : ' (正位)'}\n`;
        result += `關鍵字: ${(isReversed ? tarotCard.meanings.reversed.keywords : tarotCard.meanings.upright.keywords).join(', ')}\n`;
        result += `身體健康: ${aspects.physical.split('\n')[1] || '無資料'}\n`;
        result += `心理情緒: ${aspects.emotional.split('\n')[1] || '無資料'}\n`;
        result += `靈性成長: ${aspects.spiritual.split('\n')[1] || '無資料'}\n`;
        result += `\n---\n\n`;
      });
      
      return result;
    }
  }
}

// 創建單例實例
export const dailyCardService = new DailyCardService();