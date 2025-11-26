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

export const updateTodo = async (
  no: number,
  title: string,
  content: string
) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE todo SET title = ?, content = ?, updated_at = NOW() WHERE no = ?',
      [title, content, no]
    )
    return result
  } catch (error) {
    console.error('Error updating todo:', error)
    throw error
  }
}

export const deleteTodo = async (no: number) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM todo WHERE no = ?',
      [no]
    )
    return result
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw error
  }
}
