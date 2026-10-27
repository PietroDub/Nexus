import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { CreateWorkspaceDto } from '../dto/workspace/create-workspace.dto.js';
import { UpdateWorkspaceDto } from '../dto/workspace/update-workspace.dto.js';
import { Workspace } from '../models/workspace.model.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { WORKSPACE_TEMPLATES } from '../workspace/workspace-templates.js';

const workspaceDetailInclude = {
  memberships: true,
  graphs: { include: { views: true } },
  nodeTypes: true,
  relationTypes: true,
} satisfies Prisma.WorkspaceInclude;

export type WorkspaceDetail = Prisma.WorkspaceGetPayload<{
  include: typeof workspaceDetailInclude;
}>;

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWorkspaceDto): Promise<WorkspaceDetail> {
    const template = WORKSPACE_TEMPLATES[dto.templateKey];
    if (!template) {
      throw new BadRequestException('Unknown template');
    }

    const owner = await this.prisma.user.findUnique({
      where: { id: dto.ownerId },
    });
    if (!owner) {
      throw new BadRequestException('Owner does not exist');
    }

    return this.prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: dto.name,
          templateKey: dto.templateKey,
          ownerId: dto.ownerId,
          memberships: {
            create: { userId: dto.ownerId, role: 'owner' },
          },
          graphs: {
            create: {
              name: dto.name,
              views: {
                create: {
                  name: 'Default',
                  isDefault: true,
                  createdBy: dto.ownerId,
                },
              },
            },
          },
          nodeTypes: { create: template.nodeTypes },
          relationTypes: { create: template.relationTypes },
        },
        include: workspaceDetailInclude,
      });

      await tx.auditEvent.create({
        data: {
          workspaceId: workspace.id,
          actorId: dto.ownerId,
          entityType: 'workspace',
          entityId: workspace.id,
          action: 'WorkspaceCreated',
          payload: { name: dto.name, templateKey: dto.templateKey },
          requestId: randomUUID(),
        },
      });

      return workspace;
    });
  }

  findAll(): Promise<Workspace[]> {
    return this.prisma.workspace.findMany({
      where: { archivedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  }

  findOne(id: string): Promise<WorkspaceDetail | null> {
    return this.prisma.workspace.findFirst({
      where: { id, archivedAt: null },
      include: workspaceDetailInclude,
    });
  }

  async update(
    id: string,
    dto: UpdateWorkspaceDto,
  ): Promise<Workspace | null> {
    const existing = await this.prisma.workspace.findFirst({
      where: { id, archivedAt: null },
    });
    if (!existing) {
      return null;
    }

    const workspace = await this.prisma.workspace.update({
      where: { id },
      data: { name: dto.name },
    });

    await this.prisma.auditEvent.create({
      data: {
        workspaceId: id,
        actorId: existing.ownerId,
        entityType: 'workspace',
        entityId: id,
        action: 'WorkspaceUpdated',
        payload: { name: dto.name },
        requestId: randomUUID(),
      },
    });

    return workspace;
  }

  async archive(id: string): Promise<boolean> {
    const existing = await this.prisma.workspace.findFirst({
      where: { id, archivedAt: null },
    });
    if (!existing) {
      return false;
    }

    await this.prisma.$transaction([
      this.prisma.workspace.update({
        where: { id },
        data: { archivedAt: new Date() },
      }),
      this.prisma.auditEvent.create({
        data: {
          workspaceId: id,
          actorId: existing.ownerId,
          entityType: 'workspace',
          entityId: id,
          action: 'WorkspaceArchived',
          payload: {},
          requestId: randomUUID(),
        },
      }),
    ]);

    return true;
  }
}
