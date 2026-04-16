import type { FastifyPluginAsync, FastifyInstance } from 'fastify'

export const authController: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  fastify.get('/auth/logout', async (request) => {
    request.session.delete()
  })

  fastify.get('/auth/login', async (request, reply) => {
    try {
      const userId = request.session.userId
      if (!userId) {
        return reply.status(200).send([])
      }
      return reply.status(200).send({ userId: userId })
    } catch (error) {
      console.error('POST /user error:', error)
      reply.status(500).send({ message: 'Failed to get user' })
    }
  })
}
