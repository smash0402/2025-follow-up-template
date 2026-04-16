import useSWR, { type KeyedMutator } from 'swr'
import type { Todo } from '@shared/types'

export function useTodos(): {
  todos: Todo[]
  error: Error | undefined
  mutate: KeyedMutator<Todo[]>
} {
  const fetcher = async (url: string): Promise<Todo[]> => {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })
    if (!res.ok) {
      const status = res.status
      const body = await res.text()
      const message = `failed to fetch todos. error(status: ${status}, body: ${body})`
      throw new Error(message)
    }
    return res.json()
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const { data, error, mutate } = useSWR<Todo[], Error>(
    `${API_URL}/allTodo`,
    fetcher
  )

  return { todos: data || [], error, mutate }
}
