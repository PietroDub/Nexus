import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRelationDto } from '../dto/relation/create-relation.dto.js';
import { UpdateRelationDto } from '../dto/relation/update-relation.dto.js';
import { Relation } from '../models/relation.model.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class RelationService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Relation[]> {
    return this.prisma.relation.findMany({
      where: { archivedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  }

  findOne(id: string): Promise<Relation | null> {
    return this.prisma.relation.findFirst({
      where: { id, archivedAt: null },
    });
  }

  async create(dto: CreateRelationDto): Promise<Relation> {
    await this.assertPlacement({
      graphId: dto.graphId,
      typeId: dto.typeId,
      sourceNodeId: dto.sourceNodeId,
      targetNodeId: dto.targetNodeId,
    });

    return this.prisma.relation.create({
      data: {
        graphId: dto.graphId,
        typeId: dto.typeId,
        sourceNodeId: dto.sourceNodeId,
        targetNodeId: dto.targetNodeId,
        directed: dto.directed,
        properties: dto.properties ?? {},
        createdBy: dto.createdBy,
      },
    });
  }

  async update(id: string, dto: UpdateRelationDto): Promise<Relation | null> {
    const existing = await this.findOne(id);
    if (!existing) {
      return null;
    }

    if (dto.typeId || dto.sourceNodeId || dto.targetNodeId) {
      await this.assertPlacement({
        graphId: existing.graphId,
        typeId: dto.typeId ?? existing.typeId,
        sourceNodeId: dto.sourceNodeId ?? existing.sourceNodeId,
        targetNodeId: dto.targetNodeId ?? existing.targetNodeId,
      });
    }

    return this.prisma.relation.update({
      where: { id },
      data: {
        typeId: dto.typeId,
        sourceNodeId: dto.sourceNodeId,
        targetNodeId: dto.targetNodeId,
        directed: dto.directed,
        properties: dto.properties,
        version: { increment: 1 },
      },
    });
  }

  async archive(id: string): Promise<boolean> {
    const existing = await this.findOne(id);
    if (!existing) {
      return false;
    }

    await this.prisma.relation.update({
      where: { id },
      data: { archivedAt: new Date() },
    });
    return true;
  }

  private async assertPlacement(input: {
    graphId: string;
    typeId: string;
    sourceNodeId: string;
    targetNodeId: string;
  }): Promise<void> {
    const graph = await this.prisma.graph.findUnique({
      where: { id: input.graphId },
    });
    if (!graph) {
      throw new BadRequestException('Graph does not exist');
    }

    const type = await this.prisma.relationType.findUnique({
      where: { id: input.typeId },
    });
    if (!type) {
      throw new BadRequestException('Relation type does not exist');
    }
    if (type.workspaceId !== graph.workspaceId) {
      throw new BadRequestException(
        'Relation type does not belong to this workspace',
      );
    }

    const endpoints = await this.prisma.node.findMany({
      where: {
        id: { in: [input.sourceNodeId, input.targetNodeId] },
        archivedAt: null,
      },
    });
    const byId = new Map(endpoints.map((node) => [node.id, node]));

    const source = byId.get(input.sourceNodeId);
    if (!source) {
      throw new BadRequestException('Source node does not exist');
    }
    if (source.graphId !== input.graphId) {
      throw new BadRequestException('Source node does not belong to this graph');
    }

    const target = byId.get(input.targetNodeId);
    if (!target) {
      throw new BadRequestException('Target node does not exist');
    }
    if (target.graphId !== input.graphId) {
      throw new BadRequestException('Target node does not belong to this graph');
    }
  }
}
