import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateGraphDto } from '../dto/graph/update-graph.dto.js';
import { Graph } from '../models/graph.model.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GraphService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(workspaceId?: string): Promise<Graph[]> {
    return this.prisma.graph.findMany({
      where: {
        ...(workspaceId ? { workspaceId } : {}),
        workspace: { archivedAt: null },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  findOne(id: string): Promise<Graph | null> {
    return this.prisma.graph.findFirst({
      where: { id, workspace: { archivedAt: null } },
    });
  }

  async update(id: string, dto: UpdateGraphDto): Promise<Graph | null> {
    const existing = await this.findOne(id);
    if (!existing) {
      return null;
    }

    if (dto.name !== undefined && dto.name.trim() === '') {
      throw new BadRequestException('Name is required');
    }

    return this.prisma.graph.update({
      where: { id },
      data: { name: dto.name },
    });
  }
}
