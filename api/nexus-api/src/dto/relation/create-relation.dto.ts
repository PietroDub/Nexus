import type { Prisma } from '../../generated/prisma/client.js';

export class CreateRelationDto {
    graphId: string;
    typeId: string;
    sourceNodeId: string;
    targetNodeId: string;
    directed: boolean;
    properties?: Prisma.InputJsonValue;
    createdBy: string;
}