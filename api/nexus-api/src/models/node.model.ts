import type { Prisma } from '../generated/prisma/client.js';

export class Node {
  id: string;
  graphId: string;
  typeId: string;
  title: string;
  content: string;
  attributes: Prisma.JsonValue;
  createdBy: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}
