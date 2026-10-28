import type { Prisma } from '../generated/prisma/client.js';

export type Viewport = {
  x: number;
  y: number;
  zoom: number;
};

export class GraphView {
  id: string;
  graphId: string;
  name: string;
  isDefault: boolean;
  viewport: Prisma.JsonValue;
  filters: Prisma.JsonValue;
  createdBy: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
