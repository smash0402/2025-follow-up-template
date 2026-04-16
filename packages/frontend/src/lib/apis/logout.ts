export async function logout() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) throw new Error('Failed to fetch cookie')
    const data = await res.json()
    return data.userId
  } catch {}
}
