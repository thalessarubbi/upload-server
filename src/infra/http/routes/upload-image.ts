import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

export const uploadImageRoute: FastifyPluginAsync = async server => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an image',
        description: 'Endpoint to upload an image file',
        body: z.object({
          name: z.string(),
          password: z.string().optional(),
        }),
        response: {
          201: z.object({ uploadId: z.string() }),
          409: z
            .object({ message: z.string() })
            .describe('Upload already exists'),
        },
      },
    },
    async (request, reply) => {
      await db.insert(schema.uploads).values({
        name: 'example.jpg',
        remoteKey: 'unique-remote-key',
        remoteUrl: 'https://example.com/uploads/example.jpg',
      })

      return reply.status(201).send({ uploadId: '<UPLOAD_ID>' })
    }
  )
}
