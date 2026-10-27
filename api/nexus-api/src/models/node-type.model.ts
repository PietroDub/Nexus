export class NodeType {
  id: string;
  workspaceId: string;
  key: string;
  label: string;
  description: string;
  attributeSchema: Record<string, unknown>;
  style: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
