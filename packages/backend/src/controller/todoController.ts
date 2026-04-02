import type { FastifyPluginAsync, FastifyInstance } from 'fastify'
import type { AddUser, EditUser } from '@/types'
import {
  getAllTodos,
  getTodoNo,
  addTodo,
  updateTodo,
  deleteTodo
} from '@/service/todoService'

export const todoController: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  // 一覧取得（GET）
  fastify.get('/todo', async (_, reply) => {
    const todos = await getAllTodos()
    reply.status(200).send(todos)
  })

  // 登録（POST）
  fastify.post<{ Body: AddUser }>('/todo', async (request, reply) => {
    console.log('request.body:', request.body)
    try {
      const body = request.body
      const result = await addTodo(body)
      reply.status(201).send({ message: 'Todo added', result })
    } catch (error) {
      console.error('POST /todo error:', error)
      reply.status(500).send({ message: 'Failed to add todo' })
    }
  })

  //番号限定(編集ページ用)
  fastify.get<{ Params: { no: number } }>(
    '/todo/:no',
    async (request, reply) => {
      try {
        const no = Number(request.params.no)
        const todo = await getTodoNo(no)
        if (!todo) return reply.status(404).send({ message: 'Todo not found' })
        reply.status(200).send(todo)
      } catch (error) {
        console.error('GET /todo/:no error:', error)
        reply.status(500).send({ message: 'Failed to fetch todo' })
      }
    }
  )

  fastify.put<{
    Params: { no: number }
    Body: Omit<EditUser, 'no'>
  }>('/todo/:no', async (request, reply) => {
    try {
      const no = Number(request.params.no)
      const check: EditUser = {
        no,
        title: request.body.title,
        content: request.body.content
      }

      const result = await updateTodo(check)
      reply.status(200).send({ message: 'Todo updated', result })
    } catch (error) {
      console.error('PUT /todo/:no error:', error)
      reply.status(500).send({ message: 'Failed to update todo' })
    }
  })

  fastify.delete('/todo/:no', async (request, reply) => {
    try {
      const { no } = request.params as { no: string }
      const result = await deleteTodo(Number(no))

      if (result.affectedRows === 0) {
        return reply.status(404).send({ message: 'Todo not found' })
      }

      reply.status(200).send({ message: 'Todo deleted' })
    } catch (error) {
      console.error('DELETE /todo/:no error:', error)
      reply.status(500).send({ message: 'Failed to delete todo' })
    }
  })
}
