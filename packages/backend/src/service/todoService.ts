import { pool } from '@/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'
import type {
  AddTodoRequest,
  UpdateTodoRequest,
  TodoState
} from '@shared/types'

export const getPublicTodos = async () => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT todos.id, todos.title, todos.content, todos.created_at, todos.updated_at, todos.priority, user_infos.name, todos.public_private, todos.userid, todos.todoState, todos.deadline FROM todos JOIN user_infos ON todos.userid = user_infos.id  WHERE  todos.public_private = ? ORDER BY id ASC',
      ['public']
    )
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      priority: row.priority,
      name: row.name,
      publicPrivate: row.public_private,
      userid: row.userid,
      todoState: row.todoState,
      deadline: row.deadline
    }))
  } catch (error) {
    console.error('Error fetching todo:', error)
    throw error
  }
}

export const getLoginUserTodos = async (userId: string) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT todos.id, todos.title, todos.content, todos.created_at, todos.updated_at, todos.priority, user_infos.name, todos.public_private, todos.userid, todos.todoState, todos.deadline FROM todos JOIN user_infos ON todos.userid = user_infos.id WHERE todos.userid = ? OR todos.public_private = ? ORDER BY id ASC',
      [userId, 'public']
    )
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      priority: row.priority,
      name: row.name,
      publicPrivate: row.public_private,
      userid: row.userid,
      todoState: row.todoState,
      deadline: row.deadline
    }))
  } catch (error) {
    console.error('Error fetching todo:', error)
    throw error
  }
}

export const getTodoById = async (id: number) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, content, created_at, updated_at, priority, public_private, deadline FROM todos WHERE id = ?',
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
      priority: row.priority,
      public_private: row.public_private,
      deadline: row.deadline
    }
  } catch (error) {
    console.error('Error fetching todos by id:', error)
    throw error
  }
}

export const addTodo = async (
  data: AddTodoRequest,
  userid: string,
  todoState: '完了' | '未完了'
) => {
  const { title, content, priority, publicStatus, deadline } = data
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO todos (title, content, created_at, updated_at, priority, public_private, userid, todoState,deadline) VALUES (?, ?, NOW(), NOW(), ?, ?, ?, ?, ?)',
      [title, content, priority, publicStatus, userid, todoState, deadline]
    )
    return result
  } catch (error) {
    console.error('Error inserting todo:', error)
    throw error
  }
}

export const updateTodo = async (data: UpdateTodoRequest) => {
  const { title, content, id, priority, publicStatus, deadline } = data
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE todos SET title = ?, content = ?, updated_at = NOW(), priority = ?, public_private = ?, deadline = ? WHERE id = ?',
      [title, content, priority, publicStatus, deadline, id]
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
      'DELETE FROM todos WHERE id = ?',
      [id]
    )
    return result
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw error
  }
}

export const changeTodoState = async (id: number, todoState: TodoState) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE todos SET todoState = ? WHERE id = ?',
      [todoState, id]
    )
    return result
  } catch (error) {
    console.error('Error updating todo:', error)
    throw error
  }
}
