import type { LoginUser } from '@shared/types'

export async function login(data: LoginUser) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const res = await fetch(`${API_URL}/auth/login/${data.userid}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      const status = res.status
      if (status === 401 || status === 404) {
        alert('パスワードまたはユーザーが違います')
      }
      throw new Error('Failed to fetch user')
    }
    return res.json()
  } catch (error) {
    console.error('Error posting userinfo:', error)
    throw error
  }
}
