import type { FastifyPluginAsync } from 'fastify'

export const uploadImageRoute: FastifyPluginAsync = async server => {
  server.post('/uploads', async (request, reply) => {
    const data = request.body

    // Handle image upload logic here

    return reply.status(201).send({ message: 'Image uploaded successfully' })
  })
}
