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
import { CreateNodeDto } from '../dto/node/create-node.dto.js';
import { UpdateNodeDto } from '../dto/node/update-node.dto.js';
import { Node } from '../models/node.model.js';
import { NodeService } from '../services/node.service.js';

@Controller('nodes')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Get()
  findAll(@Query('graphId') graphId?: string): Promise<Node[]> {
    return this.nodeService.findAll(graphId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Node> {
    const node = await this.nodeService.findOne(id);
    if (!node) {
      throw new NotFoundException(`Node ${id} not found`);
    }
    return node;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateNodeDto): Promise<Node> {
    return this.nodeService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateNodeDto,
  ): Promise<Node> {
    const node = await this.nodeService.update(id, dto);
    if (!node) {
      throw new NotFoundException(`Node ${id} not found`);
    }
    return node;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    const archived = await this.nodeService.archive(id);
    if (!archived) {
      throw new NotFoundException(`Node ${id} not found`);
    }
  }
}
