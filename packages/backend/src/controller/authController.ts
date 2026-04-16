import type { FastifyPluginAsync, FastifyInstance } from 'fastify'

export const authController: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  fastify.get('/logout', async (request) => {
    request.session.delete()
  })

  fastify.get('/login', async (request, reply) => {
    try {
      const user_id = request.session.user_id
      if (!user_id) {
        return reply.status(200).send({ isLoggedIn: false })
      }
      return reply.status(200).send({ isLoggedIn: true })
    } catch (error) {
      console.error('POST /user error:', error)
      reply.status(500).send({ message: 'Failed to get user' })
    }
  })
}
