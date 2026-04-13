export async function getTodo(data: number) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${API_URL}/todo/${data}`)
  if (!res.ok) throw new Error('Failed to fetch todo')
  return res
}
