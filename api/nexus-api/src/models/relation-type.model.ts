export class RelationType {
  id: string;
  workspaceId: string;
  key: string;
  label: string;
  inverseLabel: string | null;
  directedDefault: boolean;
  acyclic: boolean;
  propertySchema: Record<string, unknown>;
  style: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
