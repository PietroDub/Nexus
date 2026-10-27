export class Relation {
  id: string;
  graphId: string;
  typeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  directed: boolean;
  properties: Record<string, unknown>;
  createdBy: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}
