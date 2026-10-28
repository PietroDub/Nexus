import type { Prisma } from '../generated/prisma/client.js';

export class Relation {
  id: string;
  graphId: string;
  typeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  directed: boolean;
  properties: Prisma.JsonValue;
  createdBy: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}
