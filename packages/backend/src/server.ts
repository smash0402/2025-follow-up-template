import Fastify from 'fastify'
import cors from '@fastify/cors'
import { todoController } from '@/controller/todoController'

const fastify = Fastify({
  logger: true
})

await fastify.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})

fastify.register(todoController)

try {
  await fastify.listen({ port: 8000, host: '0.0.0.0' })
} catch (error) {
  fastify.log.error(error)
  process.exit(1)
}
