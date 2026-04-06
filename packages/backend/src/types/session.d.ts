import '@fastify/secure-session'

declare module '@fastify/secure-session' {
  interface SessionData {
    user_id: string
  }
}
