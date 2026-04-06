import type { UserInfo } from '@shared/types'

export async function addUserInfo(data: UserInfo) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const res = await fetch(`${API_URL}/userInfo`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      const status = res.status
      const body = await res.text()
      const message = `failed to fetch userinfo. error(status: ${status}, body: ${body}})`
      throw new Error(message)
    }
    return res.json()
  } catch (error) {
    console.error('Error posting userinfo:', error)
    throw error
  }
}
