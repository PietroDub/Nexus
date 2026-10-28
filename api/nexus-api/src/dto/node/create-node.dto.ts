import type { Prisma } from '../../generated/prisma/client.js';

export class CreateNodeDto {
  title: string;
  content?: string;
  graphId: string;
  typeId: string;
  createdBy: string;
  attributes?: Prisma.InputJsonValue;
}
