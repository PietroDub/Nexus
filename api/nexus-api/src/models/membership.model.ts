export type MembershipRole = 'owner' | 'editor' | 'viewer';

export class Membership {
  workspaceId: string;
  userId: string;
  role: MembershipRole;
  createdAt: Date;
}
