import { pool } from '@/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'
import type { UserInfo } from '@shared/types'

export const getUser = async (userid: string) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT userid,  name FROM userInfos WHERE userid = ?',
      [userid]
    )
    return rows.map((row) => ({
      userid: row.userid,
      name: row.name
    }))
  } catch (error) {
    console.error('Error fetching todo:', error)
    throw error
  }
}

export const addUserInfo = async (data: UserInfo) => {
  const { userid, password, name } = data
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO userInfos (userid, password, name) VALUES (?, ?,  ?)',
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
      'SELECT userid, password, name FROM userInfos WHERE userid = ?',
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
    console.error('Error fetching user by userid:', error)
    throw error
  }
}
