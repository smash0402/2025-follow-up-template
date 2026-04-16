import type { FastifyPluginAsync, FastifyInstance } from 'fastify'
import type { LoginUser, UserInfo } from '@shared/types'
import { addUserInfo, getUserById } from '@/service/userService'

export const userController: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  // ユーザー情報登録（POST）
  fastify.post<{ Body: UserInfo }>('/userInfo', async (request, reply) => {
    try {
      const body = request.body
      body.password = await fastify.bcrypt.hash(body.password)
      const result = await addUserInfo(body)

      request.session.set('userId', body.userid)

      reply.status(201).send({ message: 'user added', result })
    } catch (error) {
      console.error('POST /user error:', error)
      reply.status(500).send({ message: 'Failed to add user' })
    }
  })

  // ユーザー情報取得（一件）
  fastify.post<{ Params: { id: string }; Body: { password: string } }>(
    '/auth/login/:id',
    async (request, reply) => {
      try {
        const userid = request.params.id
        const user = await getUserById(userid)
        const login: LoginUser = {
          userid,
          password: request.body.password
        }
        if (!user) return reply.status(404).send({ message: 'User not found' })
        const match = await fastify.bcrypt.compare(
          login.password,
          user.password
        )
        if (!match) return reply.status(401).send({ message: 'passwordMiss' })

        request.session.userId = userid

        reply.status(200).send({ name: user.name })
      } catch (error) {
        console.error('POST /userInfo/:id error:', error)
        reply.status(500).send({ message: 'Failed to fetch user' })
      }
    }
  )
}
