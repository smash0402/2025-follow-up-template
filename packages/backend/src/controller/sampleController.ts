import type { FastifyPluginAsync, FastifyInstance } from 'fastify'
import { getAllUsers, addUser } from '@/service/sampleService'

export const sampleController: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  fastify.get('/sample', async (_, reply) => {
    const users = await getAllUsers()
    reply.status(200).send(users)
  })

  fastify.post('/sample', async (request, reply) => {
    try {
      const { id, title } = request.body as { id: string; title: string }

      const result = await addUser(id, title)
      reply.status(201).send({ message: 'User added', result })
    } catch (error) {
      console.error('POST /sample error:', error)
      reply.status(500).send({ message: 'Failed to add user' })
    }
  })
}
