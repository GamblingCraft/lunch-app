// middleware/cabinet-auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  if (process.client) {
    authStore.loadUser()
  }
  
  // Немедленный редирект без показа страницы
  if (!authStore.isAuthenticated) {
    console.log(`Редирект с ${to.path} на /auth (не авторизован)`)
    return navigateTo('/auth')
  }
  
  if (authStore.isAdmin) {
    console.log(`Редирект с ${to.path} на /admin (админ)`)
    return navigateTo('/admin')
  }
})