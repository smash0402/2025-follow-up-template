import Fastify from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { todoController } from '@/controller/todoController'

const fastify = Fastify({
  logger: true
})

fastify.register(fastifyCors, { origin: '*' })

fastify.register(todoController)

try {
  await fastify.listen({ port: 8000, host: '0.0.0.0' })
} catch (error) {
  fastify.log.error(error)
  process.exit(1)
}
