// 塔羅牌資料庫測試文件
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tarotData = JSON.parse(
  readFileSync(join(__dirname, '../data/tarotCards.json'), 'utf8')
);

console.log('🔮 塔羅牌資料庫測試開始...\n');

// 1. 基本結構測試
console.log('📊 1. 基本結構測試');
console.log('='.repeat(50));

function testBasicStructure() {
  const tests = [
    {
      name: '資料庫資訊存在',
      test: () => tarotData.info !== undefined,
      expected: true,
    },
    {
      name: '主牌陣列存在',
      test: () => Array.isArray(tarotData.majorArcana),
      expected: true,
    },
    {
      name: '副牌物件存在',
      test: () => typeof tarotData.minorArcana === 'object',
      expected: true,
    },
    {
      name: '四個花色都存在',
      test: () => {
        const suits = ['cups', 'wands', 'swords', 'pentacles'];
        return suits.every(suit => Array.isArray(tarotData.minorArcana[suit]));
      },
      expected: true,
    },
  ];

  tests.forEach(test => {
    const result = test.test();
    const status = result === test.expected ? '✅' : '❌';
    console.log(`${status} ${test.name}: ${result}`);
  });
}

testBasicStructure();

// 2. 資料完整性測試
console.log('\n📋 2. 資料完整性測試');
console.log('='.repeat(50));

function testDataIntegrity() {
  // 測試主牌
  console.log('🃏 主牌測試:');
  tarotData.majorArcana.forEach((card, index) => {
    const requiredFields = [
      'id',
      'name',
      'nameEn',
      'number',
      'suit',
      'image',
      'meanings',
    ];
    const missingFields = requiredFields.filter(
      field => card[field] === undefined
    );

    if (missingFields.length === 0) {
      console.log(`  ✅ ${card.name} (${card.nameEn}) - 完整`);
    } else {
      console.log(`  ❌ ${card.name} - 缺少: ${missingFields.join(', ')}`);
    }
  });

  // 測試副牌
  console.log('\n🎴 副牌測試:');
  Object.keys(tarotData.minorArcana).forEach(suit => {
    console.log(`  ${suit.toUpperCase()}:`);
    tarotData.minorArcana[suit].forEach(card => {
      const requiredFields = [
        'id',
        'name',
        'nameEn',
        'number',
        'suit',
        'image',
        'meanings',
      ];
      const missingFields = requiredFields.filter(
        field => card[field] === undefined
      );

      if (missingFields.length === 0) {
        console.log(`    ✅ ${card.name} (${card.nameEn}) - 完整`);
      } else {
        console.log(`    ❌ ${card.name} - 缺少: ${missingFields.join(', ')}`);
      }
    });
  });
}

testDataIntegrity();

// 3. 雙語支援測試
console.log('\n🌐 3. 雙語支援測試');
console.log('='.repeat(50));

function testBilingualSupport() {
  // 測試第一張主牌的雙語支援
  const testCard = tarotData.majorArcana[0];
  console.log(`測試卡片: ${testCard.name} / ${testCard.nameEn}`);

  const bilingualFields = [
    ['keywords', 'keywordsEn'],
    ['description', 'descriptionEn'],
    ['love', 'loveEn'],
    ['career', 'careerEn'],
    ['health', 'healthEn'],
    ['spiritual', 'spiritualEn'],
  ];

  ['upright', 'reversed'].forEach(position => {
    console.log(`\n  ${position.toUpperCase()} 位置:`);
    bilingualFields.forEach(([zhField, enField]) => {
      const hasZh = testCard.meanings[position][zhField] !== undefined;
      const hasEn = testCard.meanings[position][enField] !== undefined;
      const status = hasZh && hasEn ? '✅' : '❌';
      console.log(
        `    ${status} ${zhField}/${enField}: ${hasZh && hasEn ? '完整' : '缺失'}`
      );
    });
  });
}

testBilingualSupport();

// 4. 資料內容測試
console.log('\n📝 4. 資料內容測試');
console.log('='.repeat(50));

function testDataContent() {
  // 測試關鍵字數量
  const testCard = tarotData.majorArcana[0];
  console.log(`測試卡片: ${testCard.name}`);

  const uprightKeywords = testCard.meanings.upright.keywords.length;
  const uprightKeywordsEn = testCard.meanings.upright.keywordsEn.length;

  console.log(`✅ 正位中文關鍵字: ${uprightKeywords} 個`);
  console.log(`✅ 正位英文關鍵字: ${uprightKeywordsEn} 個`);

  // 測試描述長度
  const descLength = testCard.meanings.upright.description.length;
  const descLengthEn = testCard.meanings.upright.descriptionEn.length;

  console.log(`✅ 正位中文描述: ${descLength} 字符`);
  console.log(`✅ 正位英文描述: ${descLengthEn} 字符`);
}

testDataContent();

// 5. 統計資訊
console.log('\n📊 5. 資料庫統計');
console.log('='.repeat(50));

function showStatistics() {
  const majorCount = tarotData.majorArcana.length;
  const minorCount = Object.values(tarotData.minorArcana).reduce(
    (sum, suit) => sum + suit.length,
    0
  );
  const totalCount = majorCount + minorCount;

  console.log(`📈 資料庫版本: ${tarotData.info.version}`);
  console.log(`📈 支援語言: ${tarotData.info.languages.join(', ')}`);
  console.log(`📈 主牌數量: ${majorCount} 張`);
  console.log(`📈 副牌數量: ${minorCount} 張`);
  console.log(`📈 總卡片數: ${totalCount} 張`);
  console.log(`📈 目標總數: ${tarotData.info.totalCards} 張`);
  console.log(
    `📈 完成度: ${((totalCount / tarotData.info.totalCards) * 100).toFixed(1)}%`
  );

  console.log('\n各花色統計:');
  Object.keys(tarotData.minorArcana).forEach(suit => {
    const count = tarotData.minorArcana[suit].length;
    console.log(`  ${suit}: ${count} 張`);
  });
}

showStatistics();

// 6. 功能性測試
console.log('\n🔧 6. 功能性測試');
console.log('='.repeat(50));

function testFunctionality() {
  // 測試卡片查找
  console.log('🔍 卡片查找測試:');

  // 按 ID 查找
  function findCardById(id) {
    // 在主牌中查找
    let card = tarotData.majorArcana.find(c => c.id === id);
    if (card) return card;

    // 在副牌中查找
    for (const suit of Object.keys(tarotData.minorArcana)) {
      card = tarotData.minorArcana[suit].find(c => c.id === id);
      if (card) return card;
    }
    return null;
  }

  const testIds = ['major_00', 'cups_01', 'wands_01', 'nonexistent'];
  testIds.forEach(id => {
    const card = findCardById(id);
    const status = card ? '✅' : '❌';
    const name = card ? `${card.name} (${card.nameEn})` : '未找到';
    console.log(`  ${status} ID "${id}": ${name}`);
  });

  // 測試花色過濾
  console.log('\n🎯 花色過濾測試:');
  const suits = ['major', 'cups', 'wands', 'swords', 'pentacles'];
  suits.forEach(suit => {
    let cards = [];
    if (suit === 'major') {
      cards = tarotData.majorArcana.filter(c => c.suit === suit);
    } else {
      cards = tarotData.minorArcana[suit] || [];
    }
    console.log(`  ✅ ${suit}: ${cards.length} 張卡片`);
  });
}

testFunctionality();

console.log('\n🎉 測試完成！');
console.log('='.repeat(50));
