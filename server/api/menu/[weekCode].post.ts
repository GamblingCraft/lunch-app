// server/api/menu/[weekCode].post.ts (обновляем функцию getWeekPeriod)
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

// Функция для обновления списка недель
async function updateWeeksList(weekCode: string, weekPeriod: string) {
  const weeksFilePath = join(process.cwd(), 'data', 'weeks.json');
  
  let weeks = [];
  
  try {
    if (existsSync(weeksFilePath)) {
      const content = await readFile(weeksFilePath, 'utf-8');
      weeks = JSON.parse(content).weeks || [];
    }
    
    // Проверяем, есть ли уже такая неделя
    const existingIndex = weeks.findIndex((w: any) => w.week_code === weekCode);
    
    if (existingIndex >= 0) {
      // Обновляем существующую
      weeks[existingIndex] = {
        ...weeks[existingIndex],
        week_period: weekPeriod, // Обновляем период с новым форматом
        updated_at: new Date().toISOString()
      };
    } else {
      // Добавляем новую неделю
      weeks.push({
        id: weeks.length + 1,
        week_code: weekCode,
        week_period: weekPeriod,
        is_current: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    // Сохраняем обновленный список
    await writeFile(weeksFilePath, JSON.stringify({ weeks }, null, 2), 'utf-8');
    
  } catch (error) {
    console.error('Error updating weeks list:', error);
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
  
  const body = await readBody(event);
  
  if (!body || !body.menu) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Menu data is required'
    });
  }
  
  const dataDir = join(process.cwd(), 'data', 'menu');
  const filePath = join(dataDir, `${weekCode}.json`);
  
  try {
    // Создаем директорию если нет
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }
    
    // Сохраняем меню
    const menuData = {
      week_code: weekCode,
      week_period: getWeekPeriod(weekCode), // Используем новый формат
      menu: body.menu,
      updated_at: new Date().toISOString(),
      created_at: body.created_at || new Date().toISOString()
    };
    
    await writeFile(filePath, JSON.stringify(menuData, null, 2), 'utf-8');
    
    // Обновляем список недель
    await updateWeeksList(weekCode, getWeekPeriod(weekCode));
    
    return { 
      success: true, 
      message: 'Menu saved successfully',
      data: menuData
    };
    
  } catch (error) {
    console.error('Error saving menu:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save menu'
    });
  }
});