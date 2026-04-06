import type { AddTodo } from '@shared/types'

export async function addTodo(data: AddTodo) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
<<<<<<<< HEAD:packages/frontend/src/app/lib/apis/addTodo.ts
    const addTodoRes = await fetch(`${API_URL}/todo`, {
========
    const res = await fetch(`${API_URL}/todo`, {
>>>>>>>> 9021833 (ログイン機能,cookie,ハッシュ化,ミドルウェア追加):packages/frontend/src/lib/apis/addTodo.ts
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
<<<<<<<< HEAD:packages/frontend/src/app/lib/apis/addTodo.ts
    if (!addTodoRes.ok) {
      const status = addTodoRes.status
      const body = await addTodoRes.text()
      const message = `failed to fetch todo. error(status: ${status}, body: ${body}})`
      throw new Error(message)
    }
    return addTodoRes.json()
========
    if (!res.ok) {
      const status = res.status
      const body = await res.text()
      const message = `failed to fetch todo. error(status: ${status}, body: ${body}})`
      throw new Error(message)
    }
    return res.json()
>>>>>>>> 9021833 (ログイン機能,cookie,ハッシュ化,ミドルウェア追加):packages/frontend/src/lib/apis/addTodo.ts
  } catch (error) {
    console.error('Error posting todo:', error)
    throw error
  }
}
