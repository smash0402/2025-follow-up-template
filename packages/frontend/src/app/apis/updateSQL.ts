export async function updateSQL(data: {
  no: number
  title: string
  content: string
}) {
  try {
    const res = await fetch(`http://localhost:8000/todo/${data.no}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.title,
        content: data.content
      })
    })

    if (!res.ok) {
      const status = res.status
      const body = await res.text()
      const message = `failed to update todo. error(status: ${status}, body: ${body}})`
      throw new Error(message)
    }

    return res.json()
  } catch (error) {
    console.error('Error updating todo:', error)
    throw error
  }
}
