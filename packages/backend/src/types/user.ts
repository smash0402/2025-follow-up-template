import type { RowDataPacket } from 'mysql2'
import type { Todo } from '@/types'

export interface UserEntity extends Todo, RowDataPacket {}
