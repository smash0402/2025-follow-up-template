import type { UpdateTodoRequest } from '@shared/types'

export async function updateTodo(data: UpdateTodoRequest) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const res = await fetch(`${API_URL}/todo/${data.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        priority: data.priority,
        publicStatus: data.publicStatus,
        deadline: data.deadline
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
