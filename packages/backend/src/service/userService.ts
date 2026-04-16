import { pool } from '@/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'
import type { UserInfo } from '@shared/types'

export const addUserInfo = async (data: UserInfo) => {
  const { userid, password, name } = data
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO user_infos (id, password, name) VALUES (?, ?,  ?)',
      [userid, password, name]
    )
    return result
  } catch (error) {
    console.error('Error inserting user:', error)
    throw error
  }
}

export const getUserById = async (id: string) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, password, name FROM user_infos WHERE id = ?',
      [id]
    )

    if (rows.length === 0) return null

    const row = rows[0]
    return {
      userid: row.userid,
      password: row.password,
      name: row.name
    }
  } catch (error) {
    console.error('Error fetching user by id:', error)
    throw error
  }
}
