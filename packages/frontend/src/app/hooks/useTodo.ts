import useSWR from 'swr'

export type Todo = {
  no: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export function useTodos(): {
  todos: Todo[]
  error: Error | undefined
  isLoading: boolean
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

  const { data, error, isLoading } = useSWR<Todo[], Error>(
    'http://localhost:8000/todo',
    fetcher
  )

  return { todos: data || [], error, isLoading }
}
