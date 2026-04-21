import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';

export class SuccessEnvelopeDto {
  @ApiProperty({ example: true, description: 'Whether the request succeeded' })
  success: boolean;

  @ApiProperty({ example: 200, type: Number, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({
    example: 'Data retrieved successfully',
    description: 'Human-readable status message',
  })
  message: string;
}

type PrimitiveType = 'string' | 'number' | 'boolean' | 'integer';

type EnvelopeOpts = {
  description?: string;
  isArray?: boolean;
  meta?: Type<any>;
  messageExample?: string;
  statusCodeExample?: number;
};

export function ApiOkEnvelope<TModel extends Type<any>>(
  model: TModel | PrimitiveType,
  opts: EnvelopeOpts = {},
) {
  const {
    description,
    isArray,
    meta,
    messageExample = 'Data retrieved successfully',
    statusCodeExample = 200,
  } = opts;

  const isPrimitive = typeof model === 'string';

  const dataSchema = isPrimitive
    ? isArray
      ? { type: 'array', items: { type: model } }
      : { type: model }
    : isArray
      ? { type: 'array', items: { $ref: getSchemaPath(model) } }
      : { $ref: getSchemaPath(model) };

  const baseEnvelope = {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      statusCode: { type: 'number', example: statusCodeExample },
      message: { type: 'string', example: messageExample },
    },
  };

  const properties: Record<string, any> = { data: dataSchema };
  if (meta) properties.meta = { $ref: getSchemaPath(meta) };

  const schema = {
    allOf: [baseEnvelope, { type: 'object', properties }],
  };

  const extraModels = isPrimitive
    ? [SuccessEnvelopeDto, ...(meta ? [meta] : [])]
    : [SuccessEnvelopeDto, model, ...(meta ? [meta] : [])];

  return applyDecorators(
    ApiExtraModels(...extraModels),
    ApiOkResponse({
      description,
      content: { 'application/json': { schema } },
    }),
  );
}
