export type AddTodoRequest = {
  title: string
  content: string
  priority: '低' | '中' | '高'
  name: string
  public_private: 'public' | 'private'
  deadline: string | null
}
