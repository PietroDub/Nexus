import { Body, Controller, Param, Put } from '@nestjs/common';
import { UpsertGraphViewLayoutItemDto } from '../dto/graph-view-layout/update-graph-view-layout.dto.js';
import { GraphViewLayout } from '../models/graph-view-layout.model.js';
import { GraphViewLayoutService } from '../services/graph-view-layout.service.js';

@Controller('views')
export class GraphViewLayoutController {
  constructor(
    private readonly graphViewLayoutService: GraphViewLayoutService,
  ) {}

  @Put(':id/layouts')
  upsertMany(
    @Param('id') viewId: string,
    @Body() items: UpsertGraphViewLayoutItemDto[],
  ): Promise<GraphViewLayout[]> {
    return this.graphViewLayoutService.upsertMany(viewId, items);
  }
}
