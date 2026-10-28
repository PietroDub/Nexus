import type { Prisma } from '../../generated/prisma/client.js';

export class UpdateNodeDto {
  title?: string;
  content?: string;
  typeId?: string;
  attributes?: Prisma.InputJsonValue;
}
