// server/api/menu/[weekCode].get.ts (обновляем функцию getWeekPeriod)
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

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

export default defineEventHandler(async (event) => {
  const weekCode = getRouterParam(event, 'weekCode');
  
  if (!weekCode) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Week code is required'
    });
  }
  
  const dataDir = join(process.cwd(), 'data', 'menu');
  const filePath = join(dataDir, `${weekCode}.json`);
  
  try {
    // Если директории нет - создаем
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }
    
    // Если файл существует - читаем
    if (existsSync(filePath)) {
      const content = await readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      // Обновляем формат периода если нужно
      if (!data.week_period || !data.week_period.includes('.2024')) {
        data.week_period = getWeekPeriod(weekCode);
      }
      
      return data;
    }
    
    // Если файла нет - возвращаем пустое меню
    const emptyMenu = {
      week_code: weekCode,
      week_period: getWeekPeriod(weekCode),
      menu: {
        "Понедельник": { "Салат": [], "Суп": [], "Горячее": [], "Гарнир": [] },
        "Вторник": { "Салат": [], "Суп": [], "Горячее": [], "Гарнир": [] },
        "Среда": { "Салат": [], "Суп": [], "Горячее": [], "Гарнир": [] },
        "Четверг": { "Салат": [], "Суп": [], "Горячее": [], "Гарнир": [] },
        "Пятница": { "Салат": [], "Суп": [], "Горячее": [], "Гарнир": [] }
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return emptyMenu;
    
  } catch (error) {
    console.error('Error reading menu:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to read menu'
    });
  }
});