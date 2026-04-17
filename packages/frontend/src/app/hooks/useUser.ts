import useSWR, { type KeyedMutator } from 'swr'

export type User = {
  userId: string
}

export function useUser(): {
  user: User | undefined
  userError: Error | undefined
  isLoading: boolean
  userMutate: KeyedMutator<User>
} {
  const fetcher = async (url: string): Promise<User> => {
    const res = await fetch(url, {
      credentials: 'include'
    })
    if (!res.ok) {
      const status = res.status
      const body = await res.text()
      const message = `failed to fetch user. error(status: ${status}, body: ${body})`
      throw new Error(message)
    }
    return res.json()
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const {
    data,
    error: userError,
    isLoading,
    mutate: userMutate
  } = useSWR<User, Error>(`${API_URL}/auth/login`, fetcher)

  return { user: data, userError, isLoading, userMutate }
}
