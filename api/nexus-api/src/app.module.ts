import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { GraphController } from './controllers/graph.controller.js';
import { GraphViewController } from './controllers/graph-view.controller.js';
import { NodeController } from './controllers/node.controller.js';
import { RelationController } from './controllers/relation.controller.js';
import { UserController } from './controllers/user.controller.js';
import { WorkspaceController } from './controllers/workspace.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { GraphService } from './services/graph.service.js';
import { GraphViewService } from './services/graph-view.service.js';
import { NodeService } from './services/node.service.js';
import { RelationService } from './services/relation.service.js';
import { UserService } from './services/user.service.js';
import { WorkspaceService } from './services/workspace.service.js';
import { GraphViewLayoutService } from './services/graph-view-layout.service.js';
import { GraphViewLayoutController } from './controllers/graph-view-layout.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
  ],
  controllers: [
    AppController,
    UserController,
    WorkspaceController,
    NodeController,
    RelationController,
    GraphController,
    GraphViewController,
    GraphViewLayoutController,
  ],
  providers: [
    AppService,
    UserService,
    WorkspaceService,
    NodeService,
    RelationService,
    GraphService,
    GraphViewService,
    GraphViewLayoutService,
  ],
})
export class AppModule {}
