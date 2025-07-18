// TypeScript 類型測試
import type {
  TarotDatabase,
  TarotCard,
  TarotMeanings,
} from '../types/index.js';
import tarotData from '../data/tarotCards.json' assert { type: 'json' };

console.log('🔧 TypeScript 類型測試開始...\n');

// 1. 類型檢查測試
console.log('📋 1. 類型檢查測試');
console.log('='.repeat(50));

function testTypeChecking() {
  // 測試資料庫類型
  const database: TarotDatabase = tarotData;
  console.log('✅ TarotDatabase 類型檢查通過');

  // 測試卡片類型
  const testCard: TarotCard = database.majorArcana[0];
  console.log('✅ TarotCard 類型檢查通過');

  // 測試含義類型
  const meanings: TarotMeanings = testCard.meanings;
  console.log('✅ TarotMeanings 類型檢查通過');

  // 測試雙語欄位
  const chineseKeywords: string[] = meanings.upright.keywords;
  const englishKeywords: string[] = meanings.upright.keywordsEn;
  console.log(
    `✅ 雙語關鍵字類型檢查通過 (中文: ${chineseKeywords.length}, 英文: ${englishKeywords.length})`
  );
}

testTypeChecking();

// 2. 資料結構驗證
console.log('\n🏗️ 2. 資料結構驗證');
console.log('='.repeat(50));

function validateDataStructure() {
  const database = tarotData as TarotDatabase;

  // 驗證資料庫資訊
  console.log(`✅ 資料庫版本: ${database.info.version}`);
  console.log(`✅ 支援語言: ${database.info.languages.join(', ')}`);
  console.log(`✅ 總卡片數: ${database.info.totalCards}`);

  // 驗證主牌結構
  database.majorArcana.forEach((card, index) => {
    if (index < 3) {
      // 只顯示前3張
      console.log(`✅ 主牌 ${card.number}: ${card.name} (${card.nameEn})`);
    }
  });

  // 驗證副牌結構
  Object.entries(database.minorArcana).forEach(([suit, cards]) => {
    console.log(`✅ ${suit.toUpperCase()}: ${cards.length} 張卡片`);
  });
}

validateDataStructure();

// 3. 功能性測試
console.log('\n⚙️ 3. 功能性測試');
console.log('='.repeat(50));

function testFunctionality() {
  const database = tarotData as TarotDatabase;

  // 測試卡片查找功能
  function findCardById(id: string): TarotCard | null {
    // 在主牌中查找
    const majorCard = database.majorArcana.find(card => card.id === id);
    if (majorCard) return majorCard;

    // 在副牌中查找
    for (const [suit, cards] of Object.entries(database.minorArcana)) {
      const minorCard = cards.find(card => card.id === id);
      if (minorCard) return minorCard;
    }

    return null;
  }

  // 測試查找功能
  const testIds = ['major_00', 'cups_01', 'wands_01'];
  testIds.forEach(id => {
    const card = findCardById(id);
    if (card) {
      console.log(`✅ 找到卡片 ${id}: ${card.name} (${card.nameEn})`);
    } else {
      console.log(`❌ 未找到卡片 ${id}`);
    }
  });

  // 測試語言切換功能
  function getCardDescription(
    card: TarotCard,
    language: 'zh-TW' | 'en',
    position: 'upright' | 'reversed'
  ): string {
    const meanings = card.meanings[position];
    return language === 'zh-TW' ? meanings.description : meanings.descriptionEn;
  }

  const testCard = database.majorArcana[0];
  const chineseDesc = getCardDescription(testCard, 'zh-TW', 'upright');
  const englishDesc = getCardDescription(testCard, 'en', 'upright');

  console.log(`✅ 中文描述: ${chineseDesc.substring(0, 20)}...`);
  console.log(`✅ 英文描述: ${englishDesc.substring(0, 30)}...`);
}

testFunctionality();

console.log('\n🎉 TypeScript 類型測試完成！');
console.log('='.repeat(50));
