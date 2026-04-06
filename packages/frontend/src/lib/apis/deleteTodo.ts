export async function deleteTodo(id: number) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const res = await fetch(`${API_URL}/todo/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!res.ok) {
      const status = res.status
      const body = await res.text()
      throw new Error(`Delete failed: status ${status}, body: ${body}`)
    }

    return res.json()
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw error
  }
}
