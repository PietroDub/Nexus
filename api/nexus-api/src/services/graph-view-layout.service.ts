import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpsertGraphViewLayoutItemDto } from '../dto/graph-view-layout/update-graph-view-layout.dto.js';
import { GraphViewLayout } from '../models/graph-view-layout.model.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GraphViewLayoutService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertMany(
    viewId: string,
    items: UpsertGraphViewLayoutItemDto[],
  ): Promise<GraphViewLayout[]> {
    if (!Array.isArray(items)) {
      throw new BadRequestException(
        'Body must be an array of { nodeId, x, y }',
      );
    }

    const view = await this.prisma.graphView.findFirst({
      where: { id: viewId, graph: { workspace: { archivedAt: null } } },
    });
    if (!view) {
      throw new NotFoundException(`View ${viewId} not found`);
    }

    for (const item of items) {
      if (!Number.isFinite(item.x) || !Number.isFinite(item.y)) {
        throw new BadRequestException('Layout x and y must be finite numbers');
      }
    }

    await this.assertNodesInGraph(
      view.graphId,
      items.map((item) => item.nodeId),
    );

    if (items.length === 0) {
      return [];
    }

    return this.prisma.$transaction(
      items.map((item) =>
        this.prisma.graphViewLayout.upsert({
          where: {
            viewId_nodeId: { viewId, nodeId: item.nodeId },
          },
          create: {
            viewId,
            nodeId: item.nodeId,
            x: item.x,
            y: item.y,
          },
          update: { x: item.x, y: item.y },
        }),
      ),
    );
  }

  private async assertNodesInGraph(graphId: string, nodeIds: string[]) {
    const uniqueIds = [...new Set(nodeIds)];
    if (uniqueIds.length === 0) {
      return;
    }

    const nodes = await this.prisma.node.findMany({
      where: { id: { in: uniqueIds }, archivedAt: null },
    });
    const byId = new Map(nodes.map((node) => [node.id, node]));

    for (const nodeId of uniqueIds) {
      const node = byId.get(nodeId);
      if (!node) {
        throw new BadRequestException('Node does not exist');
      }
      if (node.graphId !== graphId) {
        throw new BadRequestException('Node does not belong to this graph');
      }
    }
  }
}
