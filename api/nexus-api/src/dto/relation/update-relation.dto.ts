import type { Prisma } from '../../generated/prisma/client.js';

export class UpdateRelationDto {
    typeId?: string;
    sourceNodeId?: string;
    targetNodeId?: string;
    directed?: boolean;
    properties?: Prisma.InputJsonValue;
}