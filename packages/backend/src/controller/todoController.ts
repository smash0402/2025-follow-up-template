import type { FastifyPluginAsync, FastifyInstance } from 'fastify'
import type { AddTodo, EditTodo } from '@/types'
import {
  getAllTodos,
  getTodoId,
  addTodo,
  updateTodo,
  deleteTodo
} from '@/service/todoService'

export const todoController: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  // 一覧取得（GET）
  fastify.get('/todo', async (_, reply) => {
    try {
      const todos = await getAllTodos()
      reply.status(200).send(todos)
    } catch (error) {
      console.error('POST /todo error:', error)
      reply.status(500).send({ message: 'Failed to add todo' })
    }
  })

  // 登録（POST）
  fastify.post<{ Body: AddTodo }>('/todo', async (request, reply) => {
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
  fastify.get<{ Params: { id: number } }>(
    '/todo/:id',
    async (request, reply) => {
      try {
        const id = Number(request.params.id)
        const todo = await getTodoId(id)
        if (!todo) return reply.status(404).send({ message: 'Todo not found' })
        reply.status(200).send(todo)
      } catch (error) {
        console.error('GET /todo/:id error:', error)
        reply.status(500).send({ message: 'Failed to fetch todo' })
      }
    }
  )

  fastify.put<{
    Params: { id: number }
    Body: Omit<EditTodo, 'id'>
  }>('/todo/:id', async (request, reply) => {
    try {
      const id = Number(request.params.id)
      const check: EditTodo = {
        id,
        title: request.body.title,
        content: request.body.content,
        priority: request.body.priority
      }

      const result = await updateTodo(check)
      reply.status(200).send({ message: 'Todo updated', result })
    } catch (error) {
      console.error('PUT /todo/:id error:', error)
      reply.status(500).send({ message: 'Failed to update todo' })
    }
  })

  fastify.delete('/todo/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const result = await deleteTodo(Number(id))

      if (result.affectedRows === 0) {
        return reply.status(404).send({ message: 'Todo not found' })
      }

      reply.status(200).send({ message: 'Todo deleted' })
    } catch (error) {
      console.error('DELETE /todo/:id error:', error)
      reply.status(500).send({ message: 'Failed to delete todo' })
    }
  })
}
