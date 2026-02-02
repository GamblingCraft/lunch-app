// Файл: /middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Загружаем пользователя в store
  if (process.client) {
    authStore.loadUser()
  }

  // Получаем данные пользователя
  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.isAdmin

  // Проверяем все админские маршруты (любые пути, начинающиеся с /admin/)
  const isAdminRoute = to.path.startsWith('/admin') || to.path === '/admin'
  
  // Проверяем все кабинетные маршруты (любые пути, начинающиеся с /cabinet/)
  const isCabinetRoute = to.path.startsWith('/cabinet') || to.path === '/cabinet'
  
  const isProtectedRoute = isAdminRoute || isCabinetRoute
  
  // Для отладки
  if (process.client && isProtectedRoute) {
    console.log(`Проверка доступа к ${to.path}:`, {
      isAuthenticated,
      isAdmin,
      user: authStore.user
    })
  }
  
  // Если это защищенный маршрут и пользователь не авторизован
  if (isProtectedRoute && !isAuthenticated) {
    return navigateTo('/auth')
  }
  
  // Если пользователь авторизован, проверяем доступ к маршрутам
  if (isAuthenticated) {
    // Если обычный пользователь пытается зайти на любой админский маршрут
    if (isAdminRoute && !isAdmin) {
      console.warn(`Пользователь без прав админа пытается зайти на ${to.path}`)
      return navigateTo('/cabinet')
    }
    
    // Если админ пытается зайти на любой кабинетный маршрут
    if (isCabinetRoute && isAdmin) {
      console.warn(`Админ пытается зайти на ${to.path}`)
      return navigateTo('/admin')
    }
  }
})