import { jsonSchemaTransform } from 'fastify-type-provider-zod'

type TransformSwaggerSchemaData = Parameters<typeof jsonSchemaTransform>[0]

type ObjectJsonSchema = {
  type: 'object'
  required: string[]
  properties: Record<string, unknown>
}

export function transformSwaggerSchema(data: TransformSwaggerSchemaData) {
  const { schema, url } = jsonSchemaTransform(data)

  if (schema.consumes?.includes('multipart/form-data')) {
    const body = (schema.body ?? {
      type: 'object',
      required: [],
      properties: {},
    }) as ObjectJsonSchema

    body.properties.file = {
      type: 'string',
      format: 'binary',
    }

    body.required.push('file')

    schema.body = body
  }

  return { schema, url }
}
