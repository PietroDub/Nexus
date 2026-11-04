import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRelationDto } from '../dto/relation/create-relation.dto.js';
import { UpdateRelationDto } from '../dto/relation/update-relation.dto.js';
import { Relation } from '../models/relation.model.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class RelationService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(graphId?: string): Promise<Relation[]> {
    return this.prisma.relation.findMany({
      where: {
        archivedAt: null,
        ...(graphId ? { graphId } : {}),
        graph: { workspace: { archivedAt: null } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  findOne(id: string): Promise<Relation | null> {
    return this.prisma.relation.findFirst({
      where: {
        id,
        archivedAt: null,
        graph: { workspace: { archivedAt: null } },
      },
    });
  }

  async create(dto: CreateRelationDto): Promise<Relation> {
    await this.assertPlacement({
      graphId: dto.graphId,
      typeId: dto.typeId,
      sourceNodeId: dto.sourceNodeId,
      targetNodeId: dto.targetNodeId,
    });
    await this.assertAcyclicIfNeeded({
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
      const typeId = dto.typeId ?? existing.typeId;
      const sourceNodeId = dto.sourceNodeId ?? existing.sourceNodeId;
      const targetNodeId = dto.targetNodeId ?? existing.targetNodeId;

      await this.assertPlacement({
        graphId: existing.graphId,
        typeId,
        sourceNodeId,
        targetNodeId,
      });
      await this.assertAcyclicIfNeeded({
        graphId: existing.graphId,
        typeId,
        sourceNodeId,
        targetNodeId,
        excludeRelationId: id,
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
    const graph = await this.prisma.graph.findFirst({
      where: { id: input.graphId, workspace: { archivedAt: null } },
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
      throw new BadRequestException(
        'Source node does not belong to this graph',
      );
    }

    const target = byId.get(input.targetNodeId);
    if (!target) {
      throw new BadRequestException('Target node does not exist');
    }
    if (target.graphId !== input.graphId) {
      throw new BadRequestException(
        'Target node does not belong to this graph',
      );
    }
  }

  /**
   * Se o tipo for DAG (acyclic), recusa a aresta nova quando ela fecharia um ciclo.
   * Pergunta: já existe caminho target → … → source só com arestas deste tipo?
   * Se sim, gravar source → target formaria um anel.
   */
  private async assertAcyclicIfNeeded(input: {
    graphId: string;
    typeId: string;
    sourceNodeId: string;
    targetNodeId: string;
    /** No update: a aresta antiga não conta (estamos a movê-la). */
    excludeRelationId?: string;
  }): Promise<void> {
    const type = await this.prisma.relationType.findUnique({
      where: { id: input.typeId },
    });
    // uses, allied_with, etc.: ciclos são conteúdo normal — não valida.
    if (!type?.acyclic) {
      return;
    }

    // A → A é ciclo de comprimento 1.
    if (input.sourceNodeId === input.targetNodeId) {
      throw new BadRequestException('Acyclic type cannot self-loop');
    }

    // Subgrafo: só relations visíveis deste graph + deste type.
    const edges = await this.prisma.relation.findMany({
      where: {
        graphId: input.graphId,
        typeId: input.typeId,
        archivedAt: null,
        ...(input.excludeRelationId
          ? { id: { not: input.excludeRelationId } }
          : {}),
      },
      select: { sourceNodeId: true, targetNodeId: true },
    });

    // Lista de adjacência: de cada node, para onde as setas apontam.
    // Ex.: A→B, B→C  ⇒  { A: [B], B: [C] }
    const outgoing = new Map<string, string[]>();
    for (const edge of edges) {
      const next = outgoing.get(edge.sourceNodeId) ?? [];
      next.push(edge.targetNodeId);
      outgoing.set(edge.sourceNodeId, next);
    }

    // BFS a partir do TARGET da aresta que queres criar.
    const queue = [input.targetNodeId];
    const visited = new Set([input.targetNodeId]);

    while (queue.length > 0) {
      const current = queue.shift()!; // próximo node a expandir
      for (const next of outgoing.get(current) ?? []) {
        // Chegámos ao SOURCE → path target→…→source já existe → ciclo.
        if (next === input.sourceNodeId) {
          throw new BadRequestException(
            'This relation would create a cycle',
          );
        }
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
    // Saiu do while sem throw: não há caminho de volta — a aresta é segura.
  }
}


