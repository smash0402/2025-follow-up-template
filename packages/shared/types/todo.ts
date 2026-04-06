export const PRIORITY = { low: '低', middle: '中', high: '高' } as const

export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY]

export const TODOSTATE = {
  complete: '完了',
  incomplete: '未完了'
} as const

export type TodoState = (typeof TODOSTATE)[keyof typeof TODOSTATE]

export type Todo = {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  priority: Priority
  name: string
  public_private: 'public' | 'private'
  userid: string
  todoState: TodoState
  deadline: string | null
}
