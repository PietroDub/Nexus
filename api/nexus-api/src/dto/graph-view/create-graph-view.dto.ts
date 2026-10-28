import type { Prisma } from '../../generated/prisma/client.js';

export class CreateGraphViewDto {
  graphId: string;
  name: string;
  createdBy: string;
  viewport?: Prisma.InputJsonValue;
  filters?: Prisma.InputJsonValue;
}
