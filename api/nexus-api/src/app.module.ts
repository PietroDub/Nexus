import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { NodeController } from './controllers/node.controller.js';
import { UserController } from './controllers/user.controller.js';
import { WorkspaceController } from './controllers/workspace.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { NodeService } from './services/node.service.js';
import { UserService } from './services/user.service.js';
import { WorkspaceService } from './services/workspace.service.js';

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
  ],
  providers: [AppService, UserService, WorkspaceService, NodeService],
})
export class AppModule {}
