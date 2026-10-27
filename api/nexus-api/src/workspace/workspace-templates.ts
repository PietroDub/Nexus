import { TemplateKey } from '../models/workspace.model.js';

type NodeTypeSeed = {
  key: string;
  label: string;
  description: string;
};

type RelationTypeSeed = {
  key: string;
  label: string;
  inverseLabel: string | null;
  directedDefault: boolean;
  acyclic: boolean;
};

export type WorkspaceTemplate = {
  nodeTypes: NodeTypeSeed[];
  relationTypes: RelationTypeSeed[];
};

export const WORKSPACE_TEMPLATES: Record<TemplateKey, WorkspaceTemplate> = {
  knowledge: {
    nodeTypes: [
      {
        key: 'concept',
        label: 'Concept',
        description: 'An idea or topic in a learning map.',
      },
      {
        key: 'project',
        label: 'Project',
        description: 'A place where concepts are applied.',
      },
    ],
    relationTypes: [
      {
        key: 'prerequisite',
        label: 'is a prerequisite of',
        inverseLabel: 'requires',
        directedDefault: true,
        acyclic: true,
      },
      {
        key: 'built_on',
        label: 'is built on',
        inverseLabel: 'underpins',
        directedDefault: true,
        acyclic: false,
      },
      {
        key: 'uses',
        label: 'uses',
        inverseLabel: 'is used by',
        directedDefault: true,
        acyclic: false,
      },
      {
        key: 'teaches',
        label: 'teaches',
        inverseLabel: 'is taught by',
        directedDefault: true,
        acyclic: false,
      },
      {
        key: 'applied_in',
        label: 'is applied in',
        inverseLabel: 'applies',
        directedDefault: true,
        acyclic: false,
      },
    ],
  },
  worldbuilding: {
    nodeTypes: [
      {
        key: 'person',
        label: 'Person',
        description: 'A character in the world.',
      },
      {
        key: 'place',
        label: 'Place',
        description: 'A location in the world.',
      },
      {
        key: 'faction',
        label: 'Faction',
        description: 'A house, guild, or political group.',
      },
      {
        key: 'event',
        label: 'Event',
        description: 'Something that happened in the timeline.',
      },
    ],
    relationTypes: [
      {
        key: 'governs',
        label: 'governs',
        inverseLabel: 'is governed by',
        directedDefault: true,
        acyclic: false,
      },
      {
        key: 'allied_with',
        label: 'is allied with',
        inverseLabel: null,
        directedDefault: false,
        acyclic: false,
      },
      {
        key: 'occupies',
        label: 'occupies',
        inverseLabel: 'is occupied by',
        directedDefault: true,
        acyclic: false,
      },
      {
        key: 'participated_in',
        label: 'participated in',
        inverseLabel: 'had participant',
        directedDefault: true,
        acyclic: false,
      },
      {
        key: 'caused',
        label: 'caused',
        inverseLabel: 'was caused by',
        directedDefault: true,
        acyclic: false,
      },
      {
        key: 'happens_in',
        label: 'happens in',
        inverseLabel: 'is setting of',
        directedDefault: true,
        acyclic: false,
      },
    ],
  },
};
