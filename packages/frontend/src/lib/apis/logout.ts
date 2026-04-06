export async function Logout() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const res = await fetch(`${API_URL}/logout`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) throw new Error('Failed to fetch cookie')
    const data = await res.json()
    return data.user_id
  } catch {}
}
