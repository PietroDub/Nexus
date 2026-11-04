import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNodeDto } from '../dto/node/create-node.dto.js';
import { UpdateNodeDto } from '../dto/node/update-node.dto.js';
import { Node } from '../models/node.model.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class NodeService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(graphId?: string): Promise<Node[]> {
    return this.prisma.node.findMany({
      where: {
        archivedAt: null,
        ...(graphId ? { graphId } : {}),
        graph: { workspace: { archivedAt: null } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  findOne(id: string): Promise<Node | null> {
    return this.prisma.node.findFirst({
      where: {
        id,
        archivedAt: null,
        graph: { workspace: { archivedAt: null } },
      },
    });
  }

  async create(dto: CreateNodeDto): Promise<Node> {
    const graph = await this.assertGraphAndType(dto.graphId, dto.typeId);

    return this.prisma.$transaction(async (tx) => {
      const node = await tx.node.create({
        data: {
          title: dto.title,
          content: dto.content ?? '',
          graphId: dto.graphId,
          typeId: dto.typeId,
          createdBy: dto.createdBy,
          attributes: dto.attributes ?? {},
        },
      });

      await tx.auditEvent.create({
        data: {
          workspaceId: graph.workspaceId,
          actorId: dto.createdBy,
          entityType: 'node',
          entityId: node.id,
          action: 'NodeCreated',
          payload: {
            title: node.title,
            graphId: node.graphId,
            typeId: node.typeId,
          },
          requestId: randomUUID(),
        },
      });

      return node;
    });
  }

  async update(id: string, dto: UpdateNodeDto): Promise<Node | null> {
    const existing = await this.findOne(id);
    if (!existing) {
      return null;
    }

    const graph = dto.typeId
      ? await this.assertGraphAndType(existing.graphId, dto.typeId)
      : await this.requireActiveGraph(existing.graphId);

    return this.prisma.$transaction(async (tx) => {
      const node = await tx.node.update({
        where: { id },
        data: {
          title: dto.title,
          content: dto.content,
          typeId: dto.typeId,
          attributes: dto.attributes,
          version: { increment: 1 },
        },
      });

      await tx.auditEvent.create({
        data: {
          workspaceId: graph.workspaceId,
          actorId: existing.createdBy,
          entityType: 'node',
          entityId: node.id,
          action: 'NodeUpdated',
          payload: {
            title: dto.title,
            content: dto.content,
            typeId: dto.typeId,
            attributes: dto.attributes,
          },
          requestId: randomUUID(),
        },
      });

      return node;
    });
  }

  async archive(id: string): Promise<boolean> {
    const existing = await this.findOne(id);
    if (!existing) {
      return false;
    }

    const graph = await this.requireActiveGraph(existing.graphId);
    const now = new Date();

    await this.prisma.$transaction(async (tx) => {
      await tx.node.update({
        where: { id },
        data: { archivedAt: now },
      });

      await tx.relation.updateMany({
        where: {
          archivedAt: null,
          OR: [{ sourceNodeId: id }, { targetNodeId: id }],
        },
        data: { archivedAt: now },
      });

      await tx.auditEvent.create({
        data: {
          workspaceId: graph.workspaceId,
          actorId: existing.createdBy,
          entityType: 'node',
          entityId: id,
          action: 'NodeArchived',
          payload: {},
          requestId: randomUUID(),
        },
      });
    });

    return true;
  }

  private async requireActiveGraph(graphId: string) {
    const graph = await this.prisma.graph.findFirst({
      where: { id: graphId, workspace: { archivedAt: null } },
    });
    if (!graph) {
      throw new BadRequestException('Graph does not exist');
    }
    return graph;
  }

  private async assertGraphAndType(graphId: string, typeId: string) {
    const graph = await this.requireActiveGraph(graphId);

    const type = await this.prisma.nodeType.findUnique({
      where: { id: typeId },
    });
    if (!type) {
      throw new BadRequestException('Node type does not exist');
    }

    if (type.workspaceId !== graph.workspaceId) {
      throw new BadRequestException(
        'Node type does not belong to this workspace',
      );
    }

    return graph;
  }
}
