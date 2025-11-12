import type { FastifyPluginAsync, FastifyInstance } from 'fastify'
import { getAllTodos, addTodo } from '@/service/todoService'

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
}
