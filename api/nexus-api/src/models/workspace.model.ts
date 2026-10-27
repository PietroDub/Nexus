export type TemplateKey = 'knowledge' | 'worldbuilding';

export class Workspace {
  id: string;
  name: string;
  ownerId: string;
  templateKey: TemplateKey;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}
