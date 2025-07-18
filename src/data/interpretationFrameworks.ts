import { InterpretationFrameworks } from '../types';

/**
 * 不同牌數的解讀框架定義
 * 包含1-9張牌的位置含義
 */
export const interpretationFrameworks: InterpretationFrameworks = {
  1: {
    name: '單牌指引',
    description: '單張塔羅牌提供簡單直接的指引',
    positions: [{ name: '核心訊息', description: '當前最重要的指引或建議' }],
  },
  2: {
    name: '二牌交叉',
    description: '兩張牌的交叉解讀，顯示問題的兩個面向',
    positions: [
      { name: '當前情況', description: '目前面臨的狀況或問題' },
      { name: '建議行動', description: '解決問題的建議方向' },
    ],
  },
  3: {
    name: '三牌時間線',
    description: '過去、現在與未來的時間線解讀',
    positions: [
      { name: '過去', description: '影響現況的過去因素或事件' },
      { name: '現在', description: '當前的狀況和面臨的挑戰' },
      { name: '未來', description: '可能的發展方向或結果' },
    ],
  },
  4: {
    name: '四元素解讀',
    description: '從四大元素角度解讀當前情況',
    positions: [
      { name: '火 (意志)', description: '行動力、熱情和創造力' },
      { name: '水 (情感)', description: '情感、直覺和潛意識' },
      { name: '風 (思想)', description: '思考、溝通和決策' },
      { name: '土 (物質)', description: '實際情況、資源和穩定性' },
    ],
  },
  5: {
    name: '五芒星展開',
    description: '五芒星形狀的深度解讀',
    positions: [
      { name: '中心', description: '核心問題或主題' },
      { name: '火元素', description: '行動和熱情的影響' },
      { name: '水元素', description: '情感和直覺的影響' },
      { name: '風元素', description: '思考和溝通的影響' },
      { name: '土元素', description: '物質和實際的影響' },
    ],
  },
  6: {
    name: '六芒星展開',
    description: '六芒星形狀的全面解讀',
    positions: [
      { name: '過去影響', description: '過去對現況的影響' },
      { name: '現在狀況', description: '當前面臨的情況' },
      { name: '未來可能', description: '未來可能的發展' },
      { name: '意識層面', description: '你意識到的因素' },
      { name: '潛意識層面', description: '你尚未意識到的因素' },
      { name: '建議行動', description: '最佳的行動方向' },
    ],
  },
  7: {
    name: '七日展開',
    description: '未來一週的每日指引',
    positions: [
      { name: '週一', description: '週一的能量和指引' },
      { name: '週二', description: '週二的能量和指引' },
      { name: '週三', description: '週三的能量和指引' },
      { name: '週四', description: '週四的能量和指引' },
      { name: '週五', description: '週五的能量和指引' },
      { name: '週六', description: '週六的能量和指引' },
      { name: '週日', description: '週日的能量和指引' },
    ],
  },
  8: {
    name: '八芒星展開',
    description: '八個方向的全面人生解讀',
    positions: [
      { name: '自我', description: '你的核心身份和自我認知' },
      { name: '財富', description: '物質資源和財務狀況' },
      { name: '關係', description: '人際關係和社交連結' },
      { name: '家庭', description: '家庭環境和根基' },
      { name: '創造力', description: '創意表達和娛樂' },
      { name: '健康', description: '身體健康和日常習慣' },
      { name: '智慧', description: '學習、知識和精神成長' },
      { name: '事業', description: '職業發展和社會貢獻' },
    ],
  },
  9: {
    name: '凱爾特十字展開',
    description: '傳統的凱爾特十字牌陣（使用9張牌的簡化版）',
    positions: [
      { name: '當前情況', description: '目前面臨的核心問題' },
      { name: '挑戰', description: '當前的主要障礙或挑戰' },
      { name: '過去基礎', description: '過去對現況的影響' },
      { name: '即將過去', description: '正在消退的能量或情況' },
      { name: '最佳結果', description: '可能達成的最佳結果' },
      { name: '即將到來', description: '正在形成的能量或情況' },
      { name: '自我認知', description: '你對自己和情況的看法' },
      { name: '外在環境', description: '外部環境和他人的影響' },
      { name: '希望與恐懼', description: '內心的期望和擔憂' },
    ],
  },
};

export default interpretationFrameworks;
