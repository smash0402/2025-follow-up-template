import useSWR, { type KeyedMutator } from 'swr'

export type Todo = {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  priority: '低' | '中' | '高'
}

export function useTodos(): {
  todos: Todo[]
  error: Error | undefined
  isLoading: boolean
  mutate: KeyedMutator<Todo[]>
} {
  const fetcher = async (url: string): Promise<Todo[]> => {
    const res = await fetch(url)
    if (!res.ok) {
      const status = res.status
      const body = await res.text()
      const message = `failed to fetch todos. error(status: ${status}, body: ${body})`
      throw new Error(message)
    }
    return res.json()
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const { data, error, isLoading, mutate } = useSWR<Todo[], Error>(
    `${API_URL}/todo`,
    fetcher
  )

  return { todos: data || [], error, isLoading, mutate }
}
