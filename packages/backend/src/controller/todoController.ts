import type { FastifyPluginAsync, FastifyInstance } from 'fastify'
import {
  getAllTodos,
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
  fastify.post('/todo', async (request, reply) => {
    console.log('request.body:', request.body)
    try {
      const { title, content } = request.body as {
        title: string
        content: string
      }
      const result = await addTodo(title, content)
      reply.status(201).send({ message: 'Todo added', result })
    } catch (error) {
      console.error('POST /todo error:', error)
      reply.status(500).send({ message: 'Failed to add todo' })
    }
  })

  //番号限定(編集ページ用)
  fastify.get('/todo/:no', async (request, reply) => {
    try {
      const { no } = request.params as { no: string }
      const todos = await getAllTodos()
      const todo = todos.find((todo) => todo.no === Number(no))
      if (!todo) return reply.status(404).send({ message: 'Todo not found' })
      reply.status(200).send(todo)
    } catch (error) {
      console.error('GET /todo/:no error:', error)
      reply.status(500).send({ message: 'Failed to fetch todo' })
    }
  })

  fastify.put('/todo/:no', async (request, reply) => {
    try {
      const { no } = request.params as { no: string }
      const { title, content } = request.body as {
        title: string
        content: string
      }
      const result = await updateTodo(Number(no), title, content)
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
