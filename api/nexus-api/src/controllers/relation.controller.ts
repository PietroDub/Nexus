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
import { CreateRelationDto } from '../dto/relation/create-relation.dto.js';
import { UpdateRelationDto } from '../dto/relation/update-relation.dto.js';
import { Relation } from '../models/relation.model.js';
import { RelationService } from '../services/relation.service.js';

@Controller('relations')
export class RelationController {
  constructor(private readonly relationService: RelationService) {}

  @Get()
  findAll(@Query('graphId') graphId?: string): Promise<Relation[]> {
    return this.relationService.findAll(graphId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Relation> {
    const relation = await this.relationService.findOne(id);
    if (!relation) {
      throw new NotFoundException(`Relation ${id} not found`);
    }
    return relation;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateRelationDto): Promise<Relation> {
    return this.relationService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRelationDto,
  ): Promise<Relation> {
    const relation = await this.relationService.update(id, dto);
    if (!relation) {
      throw new NotFoundException(`Relation ${id} not found`);
    }
    return relation;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    const archived = await this.relationService.archive(id);
    if (!archived) {
      throw new NotFoundException(`Relation ${id} not found`);
    }
  }
}
