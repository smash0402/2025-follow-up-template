import useSWR from 'swr'

export type User = {
  userId: string
}

export function useUser(): {
  user: User | undefined
  user_error: Error | undefined
  isLoading: boolean
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
    error: user_error,
    isLoading
  } = useSWR<User, Error>(`${API_URL}/auth/login`, fetcher)

  return { user: data, user_error, isLoading }
}
