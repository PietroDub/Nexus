export class AuditEvent {
  id: string;
  workspaceId: string;
  actorId: string | null;
  entityType: string;
  entityId: string;
  action: string;
  payload: Record<string, unknown>;
  requestId: string;
  createdAt: Date;
}
