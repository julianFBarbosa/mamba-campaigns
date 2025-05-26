import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, ValidationPipe } from '@nestjs/common';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { CreateCampaignUseCase } from '../application/use-cases/create-campaign.use-case';
import { GetCampaignsUseCase, GetCampaignByIdUseCase } from '../application/use-cases/get-campaigns.use-case';
import { UpdateCampaignUseCase } from '../application/use-cases/update-campaign.use-case';
import { DeleteCampaignUseCase } from '../application/use-cases/delete-campaign.use-case';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { CampaignEntity } from '../domain/entities/campaign.entity';

@ApiTags('campaigns')
@Controller("v1/campaigns")
export class CampaignsController {
    constructor(
        private readonly createCampaignUseCase: CreateCampaignUseCase,
        private readonly getCampaignsUseCase: GetCampaignsUseCase,
        private readonly getCampaignByIdUseCase: GetCampaignByIdUseCase,
        private readonly updateCampaignUseCase: UpdateCampaignUseCase,
        private readonly deleteCampaignUseCase: DeleteCampaignUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new campaign' })
    @ApiBody({ type: CreateCampaignDto })
    @ApiResponse({ 
        status: 201, 
        description: 'The campaign has been successfully created.',
        type: CampaignEntity
    })
    @ApiBadRequestResponse({ description: 'Invalid input data or category not found.' })
    async create(@Body(new ValidationPipe()) createCampaignDto: CreateCampaignDto) {
        try {
            return await this.createCampaignUseCase.execute(createCampaignDto);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all campaigns' })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns an array of campaigns.',
        type: [CampaignEntity]
    })
    async findAll() {
        return await this.getCampaignsUseCase.execute();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a campaign by ID' })
    @ApiParam({ name: 'id', description: 'The ID of the campaign to retrieve' })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns the campaign with the specified ID.',
        type: CampaignEntity
    })
    @ApiNotFoundResponse({ description: 'Campaign not found.' })
    async findOne(@Param('id') id: number) {
        const campaign = await this.getCampaignByIdUseCase.execute(id);
        if (!campaign) {
            throw new HttpException('Campaign not found', HttpStatus.NOT_FOUND);
        }
        return campaign;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a campaign' })
    @ApiParam({ name: 'id', description: 'The ID of the campaign to update' })
    @ApiBody({ type: UpdateCampaignDto })
    @ApiResponse({ 
        status: 200, 
        description: 'The campaign has been successfully updated.',
        type: CampaignEntity
    })
    @ApiNotFoundResponse({ description: 'Campaign not found.' })
    @ApiBadRequestResponse({ description: 'Invalid input data or category not found.' })
    async update(@Param('id') id: number, @Body(new ValidationPipe()) updateCampaignDto: UpdateCampaignDto) {
        console.log({ updateCampaignDto });
        const updatedCampaign = await this.updateCampaignUseCase.execute(id, updateCampaignDto);
        if (!updatedCampaign) {
            throw new HttpException('Campaign not found', HttpStatus.NOT_FOUND);
        }
        return updatedCampaign;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a campaign' })
    @ApiParam({ name: 'id', description: 'The ID of the campaign to delete' })
    @ApiResponse({ 
        status: 200, 
        description: 'The campaign has been successfully deleted.',
        schema: {
            type: 'object',
            properties: {
                success: {
                    type: 'boolean',
                    example: true
                }
            }
        }
    })
    @ApiBadRequestResponse({ description: 'Error during deletion.' })
    async remove(@Param('id') id: number) {
        try {
            await this.deleteCampaignUseCase.execute(id);
            return { success: true };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}