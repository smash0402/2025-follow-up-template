import type { FastifyPluginAsync, FastifyInstance } from 'fastify'
import type { AddTodo, EditTodo } from '@shared/types'
import {
  getPublicTodo,
  getLoginUserTodo,
  findTodoById,
  addTodo,
  updateTodo,
  deleteTodo,
  completeTodo,
  incompleteTodo
} from '@/service/todoService'

export const todoController: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  // 一覧取得（POST）
  fastify.post('/allTodo', async (request, reply) => {
    try {
      const { name } = request.body as { name: string }
      const user_id = request.session.user_id
      if (!user_id) {
        const todos = await getPublicTodo()
        reply.status(200).send(todos)
      } else {
        const todos = await getLoginUserTodo(name)
        reply.status(200).send(todos)
      }
    } catch (error) {
      console.error('POST /todo error:', error)
      reply.status(500).send({ message: 'Failed to add todo' })
    }
  })

  // 登録（POST）
  fastify.post<{ Body: AddTodo }>('/todo', async (request, reply) => {
    try {
      const body = request.body
      const user_id = request.session.user_id
      if (!user_id) {
        reply.code(404).send()
        return
      }

      request.session.user_id = user_id

      const result = await addTodo(body, user_id, '未完了')
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
        const user_id = request.session.user_id
        if (!user_id) {
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
    Body: Omit<EditTodo, 'id'>
  }>('/todo/:id', async (request, reply) => {
    try {
      const id = request.params.id
      const user_id = request.session.user_id
      if (!user_id) {
        reply.code(404).send()
        return
      }

      request.session.user_id = user_id

      const todo: EditTodo = {
        id,
        title: request.body.title,
        content: request.body.content,
        priority: request.body.priority,
        public_private: request.body.public_private,
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
        const user_id = request.session.user_id
        if (!user_id) {
          reply.code(404).send()
          return
        }
        request.session.user_id = user_id

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

  fastify.put('/todo/complete', async (request, reply) => {
    try {
      const { id } = request.body as { id: number }
      const user_id = request.session.user_id
      if (!user_id) {
        reply.code(404).send()
        return
      }

      const result = await completeTodo(id)
      reply.status(200).send({ message: 'Todo updated', result })
    } catch (error) {
      console.error('PUT /todo/:id error:', error)
      reply.status(500).send({ message: 'Failed to update todo' })
    }
  })

  fastify.put('/todo/incomplete', async (request, reply) => {
    try {
      const { id } = request.body as { id: number }
      const user_id = request.session.user_id
      if (!user_id) {
        reply.code(404).send()
        return
      }

      const result = await incompleteTodo(id)
      reply.status(200).send({ message: 'Todo updated', result })
    } catch (error) {
      console.error('PUT /todo/:id error:', error)
      reply.status(500).send({ message: 'Failed to update todo' })
    }
  })
}
