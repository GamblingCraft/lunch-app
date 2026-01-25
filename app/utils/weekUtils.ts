// utils/weekUtils.ts

/**
 * Генерация кода недели в формате YYYY-Www
 */
export function generateWeekCode(date?: Date): string {
  const targetDate = date || new Date();
  const year = targetDate.getFullYear();
  
  // Получаем номер недели
  const firstDayOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = (targetDate.getTime() - firstDayOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

/**
 * Получение периода недели (например, "25.11.2024 - 01.12.2024")
 */
export function getWeekPeriod(weekCode: string): string {
  if (!weekCode) return '';
  
  const [year, week] = weekCode.split('-W').map(Number);
  
  // Находим понедельник указанной недели
  const januaryFirst = new Date(year, 0, 1);
  const daysOffset = (week - 1) * 7;
  const monday = new Date(januaryFirst);
  monday.setDate(januaryFirst.getDate() + daysOffset - januaryFirst.getDay() + 1);
  
  // Находим пятницу
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  
  // Форматируем даты с годом в каждой дате
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  
  return `${formatDate(monday)} - ${formatDate(friday)}`;
}

/**
 * Генерация следующей недели от текущей
 */
export function generateNextWeek(): { week_code: string; week_period: string } {
  const nextWeekDate = new Date();
  nextWeekDate.setDate(nextWeekDate.getDate() + 7);
  
  const weekCode = generateWeekCode(nextWeekDate);
  return {
    week_code: weekCode,
    week_period: getWeekPeriod(weekCode)
  };
}

/**
 * Получение текущей недели
 */
export function getCurrentWeek(): { week_code: string; week_period: string } {
  const weekCode = generateWeekCode();
  return {
    week_code: weekCode,
    week_period: getWeekPeriod(weekCode)
  };
}

/**
 * Получение списка ближайших недель
 */
export function getUpcomingWeeks(count: number = 4): Array<{ week_code: string; week_period: string; is_current: boolean }> {
  const weeks = [];
  const currentWeek = getCurrentWeek();
  
  // Добавляем текущую неделю
  weeks.push({
    ...currentWeek,
    is_current: true
  });
  
  // Добавляем следующие недели
  for (let i = 1; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() + (i * 7));
    const weekCode = generateWeekCode(date);
    
    weeks.push({
      week_code: weekCode,
      week_period: getWeekPeriod(weekCode),
      is_current: false
    });
  }
  
  return weeks;
}