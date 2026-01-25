// server/api/weeks.get.ts (обновляем функцию getWeekPeriod)
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

function generateWeekCode(date?: Date): string {
  const targetDate = date || new Date();
  const year = targetDate.getFullYear();
  const firstDayOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = (targetDate.getTime() - firstDayOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

function getWeekPeriod(weekCode: string): string {
  if (!weekCode) return '';
  
  try {
    const [year, week] = weekCode.split('-W').map(Number);
    const januaryFirst = new Date(year, 0, 1);
    const daysOffset = (week - 1) * 7;
    const monday = new Date(januaryFirst);
    monday.setDate(januaryFirst.getDate() + daysOffset - januaryFirst.getDay() + 1);
    
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
  } catch (error) {
    return weekCode;
  }
}

export default defineEventHandler(async () => {
  const weeksFilePath = join(process.cwd(), 'data', 'weeks.json');
  
  try {
    if (existsSync(weeksFilePath)) {
      const content = await readFile(weeksFilePath, 'utf-8');
      const data = JSON.parse(content);
      
      // Обновляем флаг is_current
      const currentWeekCode = generateWeekCode();
      const updatedWeeks = data.weeks?.map((week: any) => ({
        ...week,
        week_period: getWeekPeriod(week.week_code), // Обновляем формат периода
        is_current: week.week_code === currentWeekCode
      })) || [];
      
      return { weeks: updatedWeeks };
    }
    
    // Если файла нет, создаем текущую неделю
    const currentWeekCode = generateWeekCode();
    const weeks = [{
      id: 1,
      week_code: currentWeekCode,
      week_period: getWeekPeriod(currentWeekCode),
      is_current: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }];
    
    // Сохраняем в файл
    await writeFile(weeksFilePath, JSON.stringify({ weeks }, null, 2), 'utf-8');
    
    return { weeks };
    
  } catch (error) {
    console.error('Error reading weeks:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to read weeks'
    });
  }
});