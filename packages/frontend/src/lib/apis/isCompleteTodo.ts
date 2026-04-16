import type { TodoState } from '@shared/types'

export async function isCompleteTodo(id: number, todoState: TodoState) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const res = await fetch(`${API_URL}/todo/isCompleteTodo/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        todoState: todoState
      })
    })

    if (!res.ok) {
      const status = res.status
      const body = await res.text()
      const message = `failed to update todo. error(status: ${status}, body: ${body}})`
      throw new Error(message)
    }

    return res.json()
  } catch (error) {
    console.error('Error updating todo:', error)
    throw error
  }
}
