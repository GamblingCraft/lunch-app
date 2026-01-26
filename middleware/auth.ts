// Файл: /middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    // Проверяем авторизацию через localStorage
    const user = localStorage.getItem('user')
    
    // Защищенные маршруты
    const protectedRoutes = ['/admin', '/cabinet', '/dashboard']
    const isProtectedRoute = protectedRoutes.some(route => to.path.startsWith(route))
    
    if (isProtectedRoute && !user) {
      // Редирект на страницу авторизации
      return navigateTo('/auth')
    }
    
    // Проверка ролей
    if (user) {
      const userData = JSON.parse(user)
      
      // Если обычный пользователь пытается зайти в админку
      if (to.path.startsWith('/admin') && userData.is_admin !== true) {
        return navigateTo('/cabinet')
      }
      
      // Если админ пытается зайти в кабинет пользователя
      if (to.path.startsWith('/cabinet') && userData.is_admin === true) {
        return navigateTo('/admin')
      }
    }
  }
})