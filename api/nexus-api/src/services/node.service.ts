import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { CreateNodeDto } from '../dto/node/create-node.dto.js';
import { UpdateNodeDto } from '../dto/node/update-node.dto.js';
import { Node } from '../models/node.model.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class NodeService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Node[]> {
    return this.prisma.node.findMany({
      where: { archivedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  }

  findOne(id: string): Promise<Node | null> {
    return this.prisma.node.findFirst({
      where: { id, archivedAt: null },
    });
  }

  async create(dto: CreateNodeDto): Promise<Node> {
    await this.assertGraphAndType(dto.graphId, dto.typeId);

    return this.prisma.node.create({
      data: {
        title: dto.title,
        content: dto.content ?? '',
        graphId: dto.graphId,
        typeId: dto.typeId,
        createdBy: dto.createdBy,
        attributes: dto.attributes ?? {},
      },
    });
  }

  async update(id: string, dto: UpdateNodeDto): Promise<Node | null> {
    const existing = await this.findOne(id);
    if (!existing) {
      return null;
    }

    if (dto.typeId) {
      await this.assertGraphAndType(existing.graphId, dto.typeId);
    }

    return this.prisma.node.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
        typeId: dto.typeId,
        attributes: dto.attributes,
      },
    });
  }

  async archive(id: string): Promise<boolean> {
    const existing = await this.findOne(id);
    if (!existing) {
      return false;
    }

    await this.prisma.node.update({
      where: { id },
      data: { archivedAt: new Date() },
    });
    return true;
  }

  private async assertGraphAndType(graphId: string, typeId: string) {
    const graph = await this.prisma.graph.findUnique({
      where: { id: graphId },
    });
    if (!graph) {
      throw new BadRequestException('Graph does not exist');
    }

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
  }
}
