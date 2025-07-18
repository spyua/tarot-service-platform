/**
 * 日期相關工具函數
 */

/**
 * 格式化日期為 YYYY-MM-DD 字符串
 * @param date 日期對象
 * @returns 格式化的日期字符串
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 解析日期字符串為 Date 對象
 * @param dateString YYYY-MM-DD 格式的日期字符串
 * @returns Date 對象
 */
export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * 獲取今日日期字符串
 * @returns 今日日期 (YYYY-MM-DD)
 */
export function getTodayString(): string {
  return formatDate(new Date());
}

/**
 * 獲取昨日日期字符串
 * @returns 昨日日期 (YYYY-MM-DD)
 */
export function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDate(yesterday);
}

/**
 * 獲取指定天數前的日期字符串
 * @param days 天數
 * @returns 日期字符串 (YYYY-MM-DD)
 */
export function getDaysAgoString(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
}

/**
 * 檢查兩個日期是否為同一天
 * @param date1 第一個日期
 * @param date2 第二個日期
 * @returns 是否為同一天
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) === formatDate(date2);
}

/**
 * 檢查日期是否為今天
 * @param date 要檢查的日期
 * @returns 是否為今天
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * 檢查日期是否為昨天
 * @param date 要檢查的日期
 * @returns 是否為昨天
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
}

/**
 * 計算兩個日期之間的天數差
 * @param date1 第一個日期
 * @param date2 第二個日期
 * @returns 天數差（正數表示 date1 在 date2 之後）
 */
export function daysDifference(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒數
  const diffTime = date1.getTime() - date2.getTime();
  return Math.round(diffTime / oneDay);
}

/**
 * 獲取日期的友好顯示文字
 * @param date 日期
 * @returns 友好顯示文字
 */
export function getFriendlyDateText(date: Date): string {
  if (isToday(date)) {
    return '今天';
  } else if (isYesterday(date)) {
    return '昨天';
  } else {
    const diff = daysDifference(new Date(), date);
    if (diff > 0 && diff <= 7) {
      return `${diff}天前`;
    } else if (diff < 0 && diff >= -7) {
      return `${Math.abs(diff)}天後`;
    } else {
      return formatDate(date);
    }
  }
}

/**
 * 獲取日期的星期幾
 * @param date 日期
 * @returns 星期幾的中文名稱
 */
export function getWeekdayName(date: Date): string {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `星期${weekdays[date.getDay()]}`;
}

/**
 * 獲取月份的中文名稱
 * @param date 日期
 * @returns 月份的中文名稱
 */
export function getMonthName(date: Date): string {
  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];
  return months[date.getMonth()];
}

/**
 * 獲取完整的日期顯示文字
 * @param date 日期
 * @returns 完整的日期顯示文字
 */
export function getFullDateText(date: Date): string {
  const year = date.getFullYear();
  const month = getMonthName(date);
  const day = date.getDate();
  const weekday = getWeekdayName(date);
  
  return `${year}年${month}${day}日 ${weekday}`;
}

/**
 * 生成日期範圍陣列
 * @param startDate 開始日期
 * @param endDate 結束日期
 * @returns 日期陣列
 */
export function generateDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

/**
 * 獲取最近N天的日期陣列
 * @param days 天數
 * @returns 日期陣列（從今天開始往前推）
 */
export function getRecentDates(days: number): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date);
  }
  
  return dates;
}

/**
 * 檢查日期字符串是否有效
 * @param dateString 日期字符串
 * @returns 是否有效
 */
export function isValidDateString(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }
  
  const date = parseDate(dateString);
  return !isNaN(date.getTime()) && formatDate(date) === dateString;
}

/**
 * 獲取當前時間的問候語
 * @returns 問候語
 */
export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 6) {
    return '深夜好';
  } else if (hour < 12) {
    return '早安';
  } else if (hour < 18) {
    return '午安';
  } else if (hour < 22) {
    return '晚安';
  } else {
    return '夜深了';
  }
}