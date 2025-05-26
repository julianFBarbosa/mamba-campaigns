import { Injectable, Logger } from '@nestjs/common';
import { CampaignEntity, CampaignStatus } from '../../domain/entities/campaign.entity';
import { CampaignRepository } from '../../domain/repositories/campaign.repository.interface';
import { CategoryRepository } from '../../../categories/domain/repositories/category.repository.interface';

@Injectable()
export class CreateCampaignUseCase {
  private readonly logger = new Logger(CreateCampaignUseCase.name);

  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly categoryRepository: CategoryRepository
  ) { }

  async execute(campaignData: Partial<CampaignEntity>): Promise<CampaignEntity> {
    const campaign = new CampaignEntity(campaignData);

    const category = await this.categoryRepository.findById(campaign.categoryId);
    this.logger.debug(`Category found: ${JSON.stringify(category)}`);

    if (!category) {
      throw new Error('Category not found');
    }

    // Check if startDate is after endDate
    if (campaign?.startDate > campaign?.endDate) {
      throw new Error('Start date must be before or equal to end date');
    }

    // Check if endDate is in the past
    if (campaign.endDate && campaign.endDate < new Date()) {
      this.logger.debug('End date is in the past, setting status to EXPIRED');
      campaign.status = CampaignStatus.EXPIRED;
    }

    return this.campaignRepository.create(campaign);
  }
} 