import useSWR from 'swr'

export type Todo = {
  no: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  priority: string
}

export function useTodos(): {
  todos: Todo[]
  error: Error | undefined
  isLoading: boolean
  mutate: any
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
