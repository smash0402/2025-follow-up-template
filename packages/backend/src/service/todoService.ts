import { pool } from '@/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'

export const getAllTodos = async () => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT no, title, content, created_at, updated_at FROM todo ORDER BY no ASC'
    )
    return rows.map((row) => ({
      no: row.no,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
  } catch (error) {
    console.error('Error fetching todo:', error)
    throw error
  }
}

export const addTodo = async (title: string, content: string) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO todo (title, content, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
      [title, content]
    )
    return result
  } catch (error) {
    console.error('Error inserting todo:', error)
    throw error
  }
}
