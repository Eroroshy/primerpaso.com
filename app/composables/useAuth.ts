import { ref } from 'vue'

const token = ref<string | null>(null)
const user = ref<any>(null)

export const useAuth = () => {
  const login = async (email: string, password: string) => {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })

    token.value = res.token
    user.value = res.user

    localStorage.setItem('token', res.token)
  }

  const loadUser = async () => {
    const saved = localStorage.getItem('token')

    if (saved) token.value = saved
    else return null

    try {
      const res = await $fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      user.value = res.user
      return res.user
    } catch {
      token.value = null
      localStorage.removeItem('token')
      return null
    }
  }

  return { token, user, login, loadUser }
}
