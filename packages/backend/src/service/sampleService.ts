import { pool } from '@/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'
import type { User } from '@/types'

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users')
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      eMail: row.e_mail,
      createdAt: row.created_at.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export const addUser = async (id: string, title: string) => {
  try {
    // 自動で日付（created_at）を現在時刻に
    // number（連番）はDBの AUTO_INCREMENT を使う想定
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (id, title, created_at) VALUES (?, ?, NOW())',
      [id, title]
    )
    return result
  } catch (error) {
    console.error('Error inserting user:', error)
    throw error
  }
}
