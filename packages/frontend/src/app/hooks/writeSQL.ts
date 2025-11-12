export async function writeSQL(data: { title: string; content: string }) {
  try {
    const write = await fetch('http://localhost:8000/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!write.ok) {
      const status = write.status
      const body = await write.text()
      const message = `failed to fetch users. error(status: ${status}, body: ${body}})`
      throw new Error(message)
    }
    return write.json()
  } catch (error) {
    console.error('Error posting todo:', error)
    throw error
  }
}
