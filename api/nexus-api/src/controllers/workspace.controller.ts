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
} from '@nestjs/common';
import { CreateWorkspaceDto } from '../dto/workspace/create-workspace.dto.js';
import { UpdateWorkspaceDto } from '../dto/workspace/update-workspace.dto.js';
import { Workspace } from '../models/workspace.model.js';
import {
  WorkspaceDetail,
  WorkspaceService,
} from '../services/workspace.service.js';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  findAll(): Promise<Workspace[]> {
    return this.workspaceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WorkspaceDetail> {
    const workspace = await this.workspaceService.findOne(id);
    if (!workspace) {
      throw new NotFoundException(`Workspace ${id} not found`);
    }
    return workspace;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateWorkspaceDto): Promise<WorkspaceDetail> {
    return this.workspaceService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateWorkspaceDto,
  ): Promise<Workspace> {
    const workspace = await this.workspaceService.update(id, dto);
    if (!workspace) {
      throw new NotFoundException(`Workspace ${id} not found`);
    }
    return workspace;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    const archived = await this.workspaceService.archive(id);
    if (!archived) {
      throw new NotFoundException(`Workspace ${id} not found`);
    }
  }
}
