import type { AddTodo } from '@shared/types'

export async function addTodo(data: AddTodo) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const addTodoRes = await fetch(`${API_URL}/todo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!addTodoRes.ok) {
      const status = addTodoRes.status
      const body = await addTodoRes.text()
      const message = `failed to fetch todo. error(status: ${status}, body: ${body}})`
      throw new Error(message)
    }
    return addTodoRes.json()
  } catch (error) {
    console.error('Error posting todo:', error)
    throw error
  }
}
