import useSWR from 'swr'
import type { Todo } from '@shared/types'

export function useGetEditTodo(id: number): {
  todo: Todo | undefined
  error: Error | undefined
} {
  const fetcher = async (url: string): Promise<Todo> => {
    const res = await fetch(url, {
      credentials: 'include'
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
  const { data, error } = useSWR<Todo, Error>(`${API_URL}/todo/${id}`, fetcher)

  if (data?.deadline != null) data.deadline = data?.deadline?.slice(0, 10)
  return { todo: data, error }
}
