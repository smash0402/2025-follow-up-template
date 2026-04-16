import type { FastifyPluginAsync, FastifyInstance } from 'fastify'
import type {
  AddTodoRequest,
  UpdateTodoRequest,
  TodoState
} from '@shared/types'
import {
  getPublicTodos,
  getLoginUserTodos,
  findTodoById,
  addTodo,
  updateTodo,
  deleteTodo,
  changeTodoState
} from '@/service/todoService'

export const todoController: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  // 一覧取得（POST）
  fastify.post('/allTodo', async (request, reply) => {
    try {
      const userId = request.session.userId
      if (!userId) {
        const todos = await getPublicTodos()
        reply.status(200).send(todos)
      } else {
        const todos = await getLoginUserTodos(userId)
        reply.status(200).send(todos)
      }
    } catch (error) {
      console.error('POST /todo error:', error)
      reply.status(500).send({ message: 'Failed to add todo' })
    }
  })

  // 登録（POST）
  fastify.post<{ Body: AddTodoRequest }>('/todo', async (request, reply) => {
    try {
      const body = request.body
      const userId = request.session.userId
      if (!userId) {
        reply.code(404).send()
        return
      }

      request.session.userId = userId

      const result = await addTodo(body, userId, '未完了')
      reply.status(201).send({ message: 'Todo added', result })
    } catch (error) {
      console.error('POST /todo error:', error)
      reply.status(500).send({ message: 'Failed to add todo' })
    }
  })

  //一件取得(GET)
  fastify.get<{ Params: { id: number } }>(
    '/todo/:id',
    async (request, reply) => {
      try {
        const id = request.params.id
        const userId = request.session.userId
        if (!userId) {
          reply.code(404).send()
          return
        }
        const todo = await findTodoById(id)
        if (!todo) return reply.status(404).send({ message: 'Todo not found' })
        reply.status(200).send(todo)
      } catch (error) {
        console.error('GET /todo/:id error:', error)
        reply.status(500).send({ message: 'Failed to fetch todo' })
      }
    }
  )

  //Todoリスト編集
  fastify.put<{
    Params: { id: number }
    Body: Omit<UpdateTodoRequest, 'id'>
  }>('/todo/:id', async (request, reply) => {
    try {
      const id = request.params.id
      const userId = request.session.userId
      if (!userId) {
        reply.code(404).send()
        return
      }

      request.session.userId = userId

      const todo: UpdateTodoRequest = {
        id,
        title: request.body.title,
        content: request.body.content,
        priority: request.body.priority,
        publicStatus: request.body.publicStatus,
        deadline: request.body.deadline
      }

      const result = await updateTodo(todo)
      reply.status(200).send({ message: 'Todo updated', result })
    } catch (error) {
      console.error('PUT /todo/:id error:', error)
      reply.status(500).send({ message: 'Failed to update todo' })
    }
  })

  //Todoリスト削除(一件)
  fastify.delete<{ Params: { id: number } }>(
    '/todo/:id',
    async (request, reply) => {
      try {
        const id = request.params.id
        const userId = request.session.userId
        if (!userId) {
          reply.code(404).send()
          return
        }
        request.session.userId = userId

        const result = await deleteTodo(id)

        if (result.affectedRows === 0) {
          return reply.status(404).send({ message: 'Todo not found' })
        }

        reply.status(200).send({ message: 'Todo deleted' })
      } catch (error) {
        console.error('DELETE /todo/:id error:', error)
        reply.status(500).send({ message: 'Failed to delete todo' })
      }
    }
  )

  fastify.put<{
    Params: { id: number }
    Body: { todoState: TodoState }
  }>('/todo/isCompleteTodo/:id', async (request, reply) => {
    try {
      const id = request.params.id
      const { todoState } = request.body as { todoState: TodoState }
      const userId = request.session.userId
      if (!userId) {
        reply.code(404).send()
        return
      }

      const result = await changeTodoState(id, todoState)
      reply.status(200).send({ message: 'Todo updated', result })
    } catch (error) {
      console.error('PUT /todo/:id error:', error)
      reply.status(500).send({ message: 'Failed to update todo' })
    }
  })
}
