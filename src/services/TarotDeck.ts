import { v4 as uuidv4 } from 'uuid';
import {
  TarotCard,
  DrawnCard,
  ReadingResult,
  DrawOptions,
  InterpretationFramework,
  ReadingType,
} from '../types';
import { tarotCards, interpretationFrameworks } from '../data';

/**
 * 塔羅牌牌組類別
 * 負責洗牌、抽牌和生成解讀
 */
export class TarotDeck {
  private cards: TarotCard[] = [];
  private usedCardIds: Set<string> = new Set();

  constructor() {
    this.initialize();
  }

  /**
   * 初始化牌組
   */
  private initialize(): void {
    // 合併大阿卡納和小阿卡納牌組
    this.cards = [
      ...tarotCards.majorArcana,
      ...tarotCards.minorArcana.cups,
      ...tarotCards.minorArcana.wands,
      ...tarotCards.minorArcana.swords,
      ...tarotCards.minorArcana.pentacles,
    ];

    this.resetUsedCards();
  }

  /**
   * 重置已使用的牌
   */
  public resetUsedCards(): void {
    this.usedCardIds.clear();
  }

  /**
   * Fisher-Yates 洗牌演算法
   * 隨機打亂牌組順序
   */
  public shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  /**
   * 抽取指定數量的牌
   * @param options 抽牌選項
   * @returns 抽到的牌陣列
   */
  public drawCards(
    options: DrawOptions = {
      cardCount: 1,
      allowReversed: true,
      reversedProbability: 0.3,
    }
  ): DrawnCard[] {
    const { cardCount, allowReversed, reversedProbability } = options;

    // 洗牌
    this.shuffle();

    // 確保牌數在有效範圍內
    const count = Math.min(Math.max(1, cardCount), 9);

    // 獲取解讀框架
    const framework = this.getInterpretationFramework(count);

    const drawnCards: DrawnCard[] = [];
    let cardsDrawn = 0;
    let index = 0;

    // 抽取指定數量的牌
    while (cardsDrawn < count && index < this.cards.length) {
      const card = this.cards[index];

      // 確保不重複抽到同一張牌
      if (!this.usedCardIds.has(card.id)) {
        // 決定正逆位
        const isReversed = allowReversed && Math.random() < reversedProbability;

        // 添加到抽到的牌陣列
        drawnCards.push({
          card,
          position: cardsDrawn + 1,
          isReversed,
          positionMeaning: framework.positions[cardsDrawn]?.description || '',
        });

        // 標記為已使用
        this.usedCardIds.add(card.id);
        cardsDrawn++;
      }

      index++;
    }

    return drawnCards;
  }

  /**
   * 獲取指定牌數的解讀框架
   * @param cardCount 牌數
   * @returns 解讀框架
   */
  public getInterpretationFramework(
    cardCount: number
  ): InterpretationFramework {
    // 確保牌數在有效範圍內
    const count = Math.min(Math.max(1, cardCount), 9);

    // 返回對應的解讀框架
    return interpretationFrameworks[count];
  }

  /**
   * 生成占卜結果
   * @param cards 抽到的牌
   * @param type 占卜類型
   * @returns 占卜結果
   */
  public generateReadingResult(
    cards: DrawnCard[],
    type: ReadingType = 'free'
  ): ReadingResult {
    // 生成解讀文字
    const interpretation = this.generateInterpretation(cards);

    // 返回占卜結果
    return {
      id: uuidv4(),
      timestamp: Date.now(),
      type,
      cards,
      interpretation,
    };
  }

  /**
   * 生成牌面解釋
   * @param cards 抽到的牌
   * @returns 解釋文字
   */
  private generateInterpretation(cards: DrawnCard[]): string {
    if (!cards.length) return '';

    // 獲取解讀框架
    const framework = this.getInterpretationFramework(cards.length);

    // 生成整體解讀
    let interpretation = `【${framework.name}】\n\n`;

    // 為每張牌生成解讀
    cards.forEach((drawnCard, index) => {
      const { card, isReversed, position, positionMeaning } = drawnCard;
      const positionName =
        framework.positions[index]?.name || `位置 ${position}`;

      // 牌名和位置
      interpretation += `${positionName}：${card.name}${isReversed ? '（逆位）' : '（正位）'}\n`;

      // 位置含義
      if (positionMeaning) {
        interpretation += `位置含義：${positionMeaning}\n`;
      }

      // 牌義關鍵字
      const keywords = isReversed
        ? card.meanings.reversed.keywords
        : card.meanings.upright.keywords;
      interpretation += `關鍵字：${keywords.join('、')}\n`;

      // 牌義解釋
      const description = isReversed
        ? card.meanings.reversed.description
        : card.meanings.upright.description;
      interpretation += `${description}\n\n`;
    });

    // 根據牌陣生成整體解讀
    if (cards.length > 1) {
      interpretation += '【整體解讀】\n';
      interpretation += this.generateOverallInterpretation(cards, framework);
    }

    return interpretation;
  }

  /**
   * 生成整體解讀
   * @param cards 抽到的牌
   * @param framework 解讀框架
   * @returns 整體解讀文字
   */
  private generateOverallInterpretation(
    cards: DrawnCard[],
    framework: InterpretationFramework
  ): string {
    // 根據不同牌陣生成不同的整體解讀
    switch (cards.length) {
      case 2:
        return this.generateTwoCardInterpretation(cards);
      case 3:
        return this.generateThreeCardInterpretation(cards);
      default:
        return this.generateGenericInterpretation(cards, framework);
    }
  }

  /**
   * 生成兩張牌的整體解讀
   * @param cards 抽到的牌
   * @returns 整體解讀文字
   */
  private generateTwoCardInterpretation(cards: DrawnCard[]): string {
    const [situation, advice] = cards;

    return `當前情況顯示${situation.card.name}${situation.isReversed ? '逆位' : '正位'}，表示你可能正在經歷${
      situation.isReversed
        ? situation.card.meanings.reversed.keywords[0]
        : situation.card.meanings.upright.keywords[0]
    }的狀態。建議行動方面，${advice.card.name}${advice.isReversed ? '逆位' : '正位'}提醒你應該${
      advice.isReversed
        ? advice.card.meanings.reversed.keywords[0]
        : advice.card.meanings.upright.keywords[0]
    }。綜合來看，這個時期你需要關注自己的內在感受，同時採取適當的行動來改善當前情況。`;
  }

  /**
   * 生成三張牌的整體解讀
   * @param cards 抽到的牌
   * @returns 整體解讀文字
   */
  private generateThreeCardInterpretation(cards: DrawnCard[]): string {
    const [past, present, future] = cards;

    return `過去的${past.card.name}${past.isReversed ? '逆位' : '正位'}顯示你曾經經歷過${
      past.isReversed
        ? past.card.meanings.reversed.keywords[0]
        : past.card.meanings.upright.keywords[0]
    }的階段。現在的${present.card.name}${present.isReversed ? '逆位' : '正位'}表示你正在面對${
      present.isReversed
        ? present.card.meanings.reversed.keywords[0]
        : present.card.meanings.upright.keywords[0]
    }的挑戰。未來的${future.card.name}${future.isReversed ? '逆位' : '正位'}預示著${
      future.isReversed
        ? future.card.meanings.reversed.keywords[0]
        : future.card.meanings.upright.keywords[0]
    }的可能性。整體而言，你正在經歷一個從${
      past.isReversed
        ? past.card.meanings.reversed.keywords[0]
        : past.card.meanings.upright.keywords[0]
    }到${
      future.isReversed
        ? future.card.meanings.reversed.keywords[0]
        : future.card.meanings.upright.keywords[0]
    }的轉變過程。`;
  }

  /**
   * 生成通用的整體解讀
   * @param cards 抽到的牌
   * @param framework 解讀框架
   * @returns 整體解讀文字
   */
  private generateGenericInterpretation(
    cards: DrawnCard[],
    framework: InterpretationFramework
  ): string {
    let interpretation = `這個${framework.name}顯示了你生活中不同面向的能量。`;

    // 檢查主要牌組（大阿卡納）的數量
    const majorArcanaCount = cards.filter(c => c.card.suit === 'major').length;
    const majorArcanaPercentage = (majorArcanaCount / cards.length) * 100;

    if (majorArcanaPercentage > 50) {
      interpretation += `有${majorArcanaCount}張大阿卡納牌，表示當前有重要的生命課題或命運力量在影響你。`;
    }

    // 檢查正逆位比例
    const reversedCount = cards.filter(c => c.isReversed).length;
    const reversedPercentage = (reversedCount / cards.length) * 100;

    if (reversedPercentage > 50) {
      interpretation += `有${reversedCount}張逆位牌，表示你可能正在面對一些內在或外在的阻礙，需要調整心態或方法來克服挑戰。`;
    } else if (reversedCount === 0) {
      interpretation += `所有牌都是正位，表示能量流動順暢，你正處於一個相對平衡的階段。`;
    }

    // 檢查花色分布
    const suitCounts = {
      cups: cards.filter(c => c.card.suit === 'cups').length,
      wands: cards.filter(c => c.card.suit === 'wands').length,
      swords: cards.filter(c => c.card.suit === 'swords').length,
      pentacles: cards.filter(c => c.card.suit === 'pentacles').length,
    };

    const dominantSuit = Object.entries(suitCounts)
      .filter(([suit]) => suit !== 'major')
      .sort(([, a], [, b]) => b - a)[0];

    if (dominantSuit && dominantSuit[1] > 0) {
      const suitMeanings = {
        cups: '情感和關係',
        wands: '熱情和創造力',
        swords: '思考和溝通',
        pentacles: '物質和實際事務',
      };

      const suitName =
        suitMeanings[dominantSuit[0] as keyof typeof suitMeanings];
      interpretation += `${suitName}在當前占卜中特別突出，建議多關注這個領域的發展。`;
    }

    return interpretation;
  }
}

// 創建單例實例
export const tarotDeck = new TarotDeck();
