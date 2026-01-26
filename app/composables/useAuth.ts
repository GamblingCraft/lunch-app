// Файл: /composables/useAuth.ts
export const useAuth = () => {
  const user = useState('user', () => null)
  const isAuthenticated = useState('isAuthenticated', () => false)
  
  const init = () => {
    if (process.client) {
      const userData = localStorage.getItem('user')
      if (userData) {
        user.value = JSON.parse(userData)
        isAuthenticated.value = true
      }
    }
  }
  
  const login = (userData: any) => {
    if (process.client) {
      localStorage.setItem('user', JSON.stringify(userData))
      user.value = userData
      isAuthenticated.value = true
    }
  }
  
  const logout = () => {
    if (process.client) {
      localStorage.removeItem('user')
      localStorage.removeItem('auth_token')
      user.value = null
      isAuthenticated.value = false
      navigateTo('/auth')
    }
  }
  
  const checkAuth = () => {
    if (process.client) {
      const userData = localStorage.getItem('user')
      return !!userData
    }
    return false
  }
  
  // Инициализируем при первом вызове
  init()
  
  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}