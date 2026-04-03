import type { FastifyPluginAsync, FastifyInstance } from 'fastify'
import type { AddTodo, EditTodo } from '@/types'
import {
  getAllTodos,
  getTodoById,
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

  //一件取得(GET)
  fastify.get<{ Params: { id: number } }>(
    '/todo/:id',
    async (request, reply) => {
      try {
        const id = request.params.id
        const todo = await getTodoById(id)
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
      const todo: EditTodo = {
        id,
        title: request.body.title,
        content: request.body.content,
        priority: request.body.priority
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
}
