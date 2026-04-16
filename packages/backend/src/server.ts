import Fastify from 'fastify'
import cors from '@fastify/cors'
import { todoController } from '@/controller/todoController'
import { userController } from '@/controller/userController'
import { authController } from '@/controller/authController'
import fastifyBcrypt from 'fastify-bcrypt'
import session from '@fastify/secure-session'
import fs from 'node:fs'
import path from 'node:path'

const fastify = Fastify({
  logger: false
})

fastify.register(session, {
  sessionName: 'session',
  cookieName: 'userId',
  key: fs.readFileSync(path.join(process.cwd(), 'secret-key')),
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24
  }
})

await fastify.register(cors, {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})

fastify.register(fastifyBcrypt, {
  saltWorkFactor: 12
})

fastify.register(todoController)

fastify.register(userController)

fastify.register(authController)

try {
  await fastify.listen({ port: 8000, host: '0.0.0.0' })
} catch (error) {
  fastify.log.error(error)
  process.exit(1)
}
