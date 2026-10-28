import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateGraphViewDto } from '../dto/graph-view/create-graph-view.dto.js';
import { UpdateGraphViewDto } from '../dto/graph-view/update-graph-view.dto.js';
import { GraphView } from '../models/graph-view.model.js';
import {
  GraphViewDetail,
  GraphViewService,
} from '../services/graph-view.service.js';

@Controller('views')
export class GraphViewController {
  constructor(private readonly graphViewService: GraphViewService) {}

  @Get()
  findAll(@Query('graphId') graphId?: string): Promise<GraphView[]> {
    return this.graphViewService.findAll(graphId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GraphViewDetail> {
    const view = await this.graphViewService.findOne(id);
    if (!view) {
      throw new NotFoundException(`View ${id} not found`);
    }
    return view;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateGraphViewDto): Promise<GraphView> {
    return this.graphViewService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGraphViewDto,
  ): Promise<GraphView> {
    const view = await this.graphViewService.update(id, dto);
    if (!view) {
      throw new NotFoundException(`View ${id} not found`);
    }
    return view;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    const deleted = await this.graphViewService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`View ${id} not found`);
    }
  }
}
