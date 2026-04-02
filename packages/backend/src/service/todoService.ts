import { pool } from '@/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'
import type { AddTodo, EditTodo } from '@/types'

export const getAllTodos = async () => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT no, title, content, created_at, updated_at, priority FROM todo ORDER BY no ASC'
    )
    return rows.map((row) => ({
      no: row.no,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      priority: row.priority
    }))
  } catch (error) {
    console.error('Error fetching todo:', error)
    throw error
  }
}

export const getTodoNo = async (no: number) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT no, title, content, created_at, updated_at, priority FROM todo WHERE no = ?',
      [no]
    )

    if (rows.length === 0) return null

    const row = rows[0]
    return {
      no: row.no,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      priority: row.priority
    }
  } catch (error) {
    console.error('Error fetching todo by no:', error)
    throw error
  }
}

export const addTodo = async (data: AddTodo) => {
  const { title, content, priority } = data
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO todo (title, content, created_at, updated_at, priority) VALUES (?, ?, NOW(), NOW(), ?)',
      [title, content, priority]
    )
    return result
  } catch (error) {
    console.error('Error inserting todo:', error)
    throw error
  }
}

export const updateTodo = async (data: EditTodo) => {
  const { title, content, no, priority } = data
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE todo SET title = ?, content = ?, updated_at = NOW(), priority = ? WHERE no = ?',
      [title, content, priority, no]
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
