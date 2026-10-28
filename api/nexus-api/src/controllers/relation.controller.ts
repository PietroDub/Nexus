import { Body, Controller, Get, Param, Post, Put, Delete, NotFoundException } from "@nestjs/common";
import { RelationService } from "../services/relation.service.js";
import { Relation } from "../models/relation.model.js";
import { CreateRelationDto } from "../dto/relation/create-relation.dto.js";
import { UpdateRelationDto } from "../dto/relation/update-relation.dto.js";

@Controller('relations') 
export class RelationController {
    constructor(private readonly relationService: RelationService) {}

    @Get()
    findAll(): Promise<Relation[]> {
        return this.relationService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Relation | null> {
        return this.relationService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateRelationDto): Promise<Relation> {
        return this.relationService.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateRelationDto): Promise<Relation | null> {
        return this.relationService.update(id, dto);
    }

    @Put(':id/archive')
    async archive(@Param('id') id: string): Promise<void> {
        const archived = await this.relationService.archive(id);
        if (!archived) {
            throw new NotFoundException(`Relation ${id} not found`);
        }
        return undefined;
    }
}