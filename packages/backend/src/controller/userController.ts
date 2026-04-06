import type { FastifyPluginAsync, FastifyInstance } from 'fastify'
import type { login, UserInfo } from '@shared/types'
import { getUser, addUserInfo, getUserById } from '@/service/userService'

export const userController: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  fastify.get('/getUserInfo', async (request, reply) => {
    try {
      const user_id = request.session.user_id
      if (!user_id) {
        reply.status(200).send([])
      }
      const user = await getUser(String(user_id))
      reply.status(200).send(user)
    } catch (error) {
      console.error('POST /user error:', error)
      reply.status(500).send({ message: 'Failed to get user' })
    }
  })

  // ユーザー情報登録（POST）
  fastify.post<{ Body: UserInfo }>('/userInfo', async (request, reply) => {
    try {
      const body = request.body
      body.password = await fastify.bcrypt.hash(body.password)
      const result = await addUserInfo(body)

      request.session.user_id = body.userid

      reply.status(201).send({ message: 'user added', result })
    } catch (error) {
      console.error('POST /user error:', error)
      reply.status(500).send({ message: 'Failed to add user' })
    }
  })

  // ユーザー情報取得（一件）
  fastify.post<{ Params: { id: string }; Body: { password: string } }>(
    '/userInfo/:id',
    async (request, reply) => {
      try {
        const userid = request.params.id
        const user = await getUserById(userid)
        const login: login = {
          userid,
          password: request.body.password
        }
        if (!user) return reply.status(404).send({ message: 'User not found' })
        const match = await fastify.bcrypt.compare(
          login.password,
          user.password
        )
        if (!match) return reply.status(401).send({ message: 'passwordMiss' })

        request.session.user_id = userid

        reply.status(200).send({ name: user.name })
      } catch (error) {
        console.error('POST /userInfo/:id error:', error)
        reply.status(500).send({ message: 'Failed to fetch user' })
      }
    }
  )
}
