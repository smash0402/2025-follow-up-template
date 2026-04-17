import '@fastify/mysql'

declare module 'fastify' {
  interface FastifyInstance {
    mysql: MySQLPromisePool
  }
}
