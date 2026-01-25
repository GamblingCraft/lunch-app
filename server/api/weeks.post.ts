// server/api/weeks.post.ts
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  if (!body || !body.weeks) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Weeks data is required'
    });
  }
  
  const weeksFilePath = join(process.cwd(), 'data', 'weeks.json');
  
  try {
    // Создаем директорию если нет
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }
    
    // Сохраняем недели
    await writeFile(weeksFilePath, JSON.stringify({ weeks: body.weeks }, null, 2), 'utf-8');
    
    return { 
      success: true, 
      message: 'Weeks saved successfully',
      weeks: body.weeks
    };
    
  } catch (error) {
    console.error('Error saving weeks:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save weeks'
    });
  }
});