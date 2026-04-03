import { pool } from '@/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'
import type { AddTodo, EditTodo } from '@/types'

export const getAllTodos = async () => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, content, created_at, updated_at, priority FROM todo ORDER BY id ASC'
    )
    return rows.map((row) => ({
      id: row.id,
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

export const getTodoId = async (id: number) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, content, created_at, updated_at, priority FROM todo WHERE id = ?',
      [id]
    )

    if (rows.length === 0) return null

    const row = rows[0]
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      priority: row.priority
    }
  } catch (error) {
    console.error('Error fetching todo by id:', error)
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
  const { title, content, id, priority } = data
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE todo SET title = ?, content = ?, updated_at = NOW(), priority = ? WHERE id = ?',
      [title, content, priority, id]
    )
    return result
  } catch (error) {
    console.error('Error updating todo:', error)
    throw error
  }
}

export const deleteTodo = async (id: number) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM todo WHERE id = ?',
      [id]
    )
    return result
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw error
  }
}
