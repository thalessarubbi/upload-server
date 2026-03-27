import { exportUploads } from '@/app/functions/export-uploads'
import { unwrapEither } from '@/shared/either'
import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

const QuerySchema = z.object({
  searchQuery: z.string().optional(),
})

type Query = z.infer<typeof QuerySchema>

export const exportUploadsRoute: FastifyPluginAsync = async server => {
  server.post<{ Querystring: Query }>(
    '/uploads/exports',
    {
      schema: {
        summary: 'Export uploads',
        description: 'Endpoint to export uploaded files as CSV',
        tags: ['Uploads'],
        querystring: QuerySchema,
        response: {
          200: z.object({
            report: z.string().url(),
          }),
        },
      },
    },

    async (request, reply) => {
      const { searchQuery } = request.query

      const result = await exportUploads({
        searchQuery,
      })

      const { reportUrl } = unwrapEither(result)

      return reply.status(201).send({ report: reportUrl })
    }
  )
}
