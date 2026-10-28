import type { Prisma } from '../../generated/prisma/client.js';

export class UpdateGraphViewDto {
  name?: string;
  viewport?: Prisma.InputJsonValue;
  filters?: Prisma.InputJsonValue;
  isDefault?: boolean;
}
