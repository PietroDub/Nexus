export class Node {
  id: string;
  graphId: string;
  typeId: string;
  title: string;
  content: string;
  attributes: Record<string, unknown>;
  createdBy: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}
