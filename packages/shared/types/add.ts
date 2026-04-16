export type AddTodoRequest = {
  title: string
  content: string
  priority: '低' | '中' | '高'
  public_private: 'public' | 'private'
  deadline: string | null
}
