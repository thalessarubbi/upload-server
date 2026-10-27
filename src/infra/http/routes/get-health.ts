import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

export const getHealthRoute: FastifyPluginAsync = async server => {
  server.get(
    '/health',
    {
      schema: {
        summary: 'Get health status',
        description: 'Endpoint to get health status',
        tags: ['Health'],
        response: {
          200: z.object({
            status: z.enum(['ok', 'unhealthy']),
          }),
        },
      },
    },

    async (_, reply) => {
      return reply.status(200).send({ status: 'ok' })
    }
  )
}
