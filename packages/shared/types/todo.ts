export const PRIORITY = { low: '低', middle: '中', high: '高' } as const

export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY]

export const TODOSTATE = {
  complete: '完了',
  incomplete: '未完了'
} as const

export type TodoState = (typeof TODOSTATE)[keyof typeof TODOSTATE]

export const PUBLICSTATUS = {
  public: 'public',
  private: 'private'
} as const

export type PublicStatus = (typeof PUBLICSTATUS)[keyof typeof PUBLICSTATUS]

export type Todo = {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  priority: Priority
  name: string
  publicStatus: PublicStatus
  userid: string
  todoState: TodoState
  deadline: string | null
}

export type AddTodoRequest = {
  title: string
  content: string
  priority: '低' | '中' | '高'
  publicStatus: 'public' | 'private'
  deadline: string | null
}

export type UpdateTodoRequest = {
  id: number
  title: string
  content: string
  priority: '低' | '中' | '高'
  publicStatus: 'public' | 'private'
  deadline: string | null
}
