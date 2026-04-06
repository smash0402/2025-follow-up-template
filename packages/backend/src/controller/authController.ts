import type { FastifyPluginAsync, FastifyInstance } from 'fastify'

export const authController: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  fastify.get('/logout', async (request) => {
    request.session.delete()
  })
}
