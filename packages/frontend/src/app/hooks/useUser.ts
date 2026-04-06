import useSWR, { type KeyedMutator } from 'swr'

export type User = {
  userid: string
  name: string
}

export function useUser(): {
  user: User[]
  user_error: Error | undefined
  isLoading: boolean
  user_mutate: KeyedMutator<User[]>
} {
  const fetcher = async (url: string): Promise<User[]> => {
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
  const {
    data,
    error: user_error,
    isLoading,
    mutate: user_mutate
  } = useSWR<User[], Error>(`${API_URL}/getUserInfo`, fetcher)

  return { user: data || [], user_error, isLoading, user_mutate }
}
