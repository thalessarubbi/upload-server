import { getUploads } from '@/app/functions/get-uploads'
import { unwrapEither } from '@/shared/either'
import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

const QuerySchema = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(['createdAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().optional().default(1),
  pageSize: z.coerce.number().optional().default(20),
})

type Query = z.infer<typeof QuerySchema>

export const getUploadsRoute: FastifyPluginAsync = async server => {
  server.get<{ Querystring: Query }>(
    '/uploads',
    {
      schema: {
        summary: 'Get uploads',
        description: 'Endpoint to get uploaded files',
        tags: ['Uploads'],
        querystring: QuerySchema,
        response: {
          200: z.object({
            uploads: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                remoteKey: z.string(),
                remoteUrl: z.string().url(),
                createdAt: z.date(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },

    async (request, reply) => {
      const { page, pageSize, searchQuery, sortBy, sortDirection } =
        request.query

      const result = await getUploads({
        page,
        pageSize,
        searchQuery,
        sortBy,
        sortDirection,
      })

      const { total, uploads } = unwrapEither(result)

      return reply.status(201).send({ uploads, total })
    }
  )
}
