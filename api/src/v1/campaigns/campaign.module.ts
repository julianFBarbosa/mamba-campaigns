import { Module } from '@nestjs/common';
import { CampaignsController } from './controllers/campaign.controller';
import { CampaignRepository } from './domain/repositories/campaign.repository.interface';
import { CampaignRepositoryImpl } from './infrastructure/repositories/campaign.repository';
import { CreateCampaignUseCase } from './application/use-cases/create-campaign.use-case';
import { GetCampaignsUseCase, GetCampaignByIdUseCase } from './application/use-cases/get-campaigns.use-case';
import { UpdateCampaignUseCase } from './application/use-cases/update-campaign.use-case';
import { DeleteCampaignUseCase } from './application/use-cases/delete-campaign.use-case';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryRepository } from '../categories/domain/repositories/category.repository.interface';
import { CategoryRepositoryImpl } from '../categories/infrastructure/repositories/category.repository';

@Module({
  controllers: [CampaignsController],
  providers: [
    {
      provide: CampaignRepository,
      useClass: CampaignRepositoryImpl,
    },
    {
      provide: CategoryRepository,
      useClass: CategoryRepositoryImpl,
    },
    CreateCampaignUseCase,
    GetCampaignsUseCase,
    GetCampaignByIdUseCase,
    UpdateCampaignUseCase,
    DeleteCampaignUseCase,
    PrismaService
  ],
})
export class CampaignsModule { }