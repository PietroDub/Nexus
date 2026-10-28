import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UpdateGraphDto } from '../dto/graph/update-graph.dto.js';
import { Graph } from '../models/graph.model.js';
import { GraphService } from '../services/graph.service.js';

@Controller('graphs')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Get()
  findAll(@Query('workspaceId') workspaceId?: string): Promise<Graph[]> {
    return this.graphService.findAll(workspaceId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Graph> {
    const graph = await this.graphService.findOne(id);
    if (!graph) {
      throw new NotFoundException(`Graph ${id} not found`);
    }
    return graph;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGraphDto,
  ): Promise<Graph> {
    const graph = await this.graphService.update(id, dto);
    if (!graph) {
      throw new NotFoundException(`Graph ${id} not found`);
    }
    return graph;
  }
}
