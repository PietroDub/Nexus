import { TemplateKey } from '../../models/workspace.model.js';

export class CreateWorkspaceDto {
  name: string;
  templateKey: TemplateKey;
  ownerId: string;
}
