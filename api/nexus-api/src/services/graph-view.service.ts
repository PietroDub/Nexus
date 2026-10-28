import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { CreateGraphViewDto } from '../dto/graph-view/create-graph-view.dto.js';
import { UpdateGraphViewDto } from '../dto/graph-view/update-graph-view.dto.js';
import { GraphView } from '../models/graph-view.model.js';
import { PrismaService } from '../prisma/prisma.service.js';

const viewDetailInclude = {
  layouts: {
    where: { node: { archivedAt: null } },
  },
} satisfies Prisma.GraphViewInclude;

export type GraphViewDetail = Prisma.GraphViewGetPayload<{
  include: typeof viewDetailInclude;
}>;

@Injectable()
export class GraphViewService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(graphId?: string): Promise<GraphView[]> {
    return this.prisma.graphView.findMany({
      where: {
        ...(graphId ? { graphId } : {}),
        graph: { workspace: { archivedAt: null } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  findOne(id: string): Promise<GraphViewDetail | null> {
    return this.prisma.graphView.findFirst({
      where: { id, graph: { workspace: { archivedAt: null } } },
      include: viewDetailInclude,
    });
  }

  async create(dto: CreateGraphViewDto): Promise<GraphView> {
    if (dto.name.trim() === '') {
      throw new BadRequestException('Name is required');
    }
    this.assertViewport(dto.viewport);

    const graph = await this.requireActiveGraph(dto.graphId);

    const creator = await this.prisma.user.findUnique({
      where: { id: dto.createdBy },
    });
    if (!creator) {
      throw new BadRequestException('Creator does not exist');
    }

    return this.prisma.graphView.create({
      data: {
        graphId: graph.id,
        name: dto.name.trim(),
        createdBy: dto.createdBy,
        isDefault: false,
        viewport: dto.viewport,
        filters: dto.filters ?? {},
      },
    });
  }

  async update(
    id: string,
    dto: UpdateGraphViewDto,
  ): Promise<GraphView | null> {
    const existing = await this.findOne(id);
    if (!existing) {
      return null;
    }

    if (dto.name !== undefined && dto.name.trim() === '') {
      throw new BadRequestException('Name is required');
    }
    this.assertViewport(dto.viewport);

    if (dto.isDefault === false) {
      throw new BadRequestException(
        'Promote another view to default instead of unsetting this one',
      );
    }

    const graph = await this.requireActiveGraph(existing.graphId);

    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault === true) {
        await tx.graphView.updateMany({
          where: { graphId: existing.graphId, id: { not: id } },
          data: { isDefault: false },
        });
      }

      const view = await tx.graphView.update({
        where: { id },
        data: {
          name: dto.name?.trim(),
          viewport: dto.viewport,
          filters: dto.filters,
          isDefault: dto.isDefault,
          version: { increment: 1 },
        },
      });

      await tx.auditEvent.create({
        data: {
          workspaceId: graph.workspaceId,
          actorId: existing.createdBy,
          entityType: 'view',
          entityId: id,
          action: 'ViewUpdated',
          payload: {
            name: dto.name,
            isDefault: dto.isDefault,
          },
          requestId: randomUUID(),
        },
      });

      return view;
    });
  }

  async remove(id: string): Promise<boolean> {
    const existing = await this.findOne(id);
    if (!existing) {
      return false;
    }

    const count = await this.prisma.graphView.count({
      where: { graphId: existing.graphId },
    });
    if (count <= 1) {
      throw new BadRequestException('Cannot delete the last view of a graph');
    }
    if (existing.isDefault) {
      throw new BadRequestException(
        'Promote another view to default before deleting this one',
      );
    }

    await this.prisma.graphView.delete({ where: { id } });
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

  private assertViewport(value: Prisma.InputJsonValue | undefined) {
    if (value === undefined) {
      return;
    }
    if (
      value === null ||
      typeof value !== 'object' ||
      Array.isArray(value)
    ) {
      throw new BadRequestException('Viewport must be an object');
    }

    const viewport = value as { x?: unknown; y?: unknown; zoom?: unknown };
    if (
      typeof viewport.x !== 'number' ||
      typeof viewport.y !== 'number' ||
      typeof viewport.zoom !== 'number'
    ) {
      throw new BadRequestException('Viewport requires x, y, zoom as numbers');
    }
    if (
      !Number.isFinite(viewport.x) ||
      !Number.isFinite(viewport.y) ||
      !Number.isFinite(viewport.zoom)
    ) {
      throw new BadRequestException('Viewport values must be finite');
    }
    if (viewport.zoom <= 0) {
      throw new BadRequestException('Viewport zoom must be greater than 0');
    }
  }
}
