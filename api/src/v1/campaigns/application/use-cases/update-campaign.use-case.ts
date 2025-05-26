import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CampaignEntity, CampaignStatus } from '../../domain/entities/campaign.entity';
import { CampaignRepository } from '../../domain/repositories/campaign.repository.interface';
import { CategoryRepository } from '../../../categories/domain/repositories/category.repository.interface';

@Injectable()
export class UpdateCampaignUseCase {
  private readonly logger = new Logger(UpdateCampaignUseCase.name);

  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly categoryRepository: CategoryRepository
  ) { }

  async execute(id: number, campaignData: Partial<CampaignEntity>): Promise<CampaignEntity | null> {
    if (!campaignData.categoryId) {
      throw new HttpException('Category Id is required', HttpStatus.BAD_REQUEST);
    }

    const category = await this.categoryRepository.findById(campaignData.categoryId);

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
    }

    const campaign = await this.campaignRepository.findById(id);

    if (!campaign) {
      throw new HttpException('Campaign not found', HttpStatus.BAD_REQUEST);
    }

    const updatedCampaign = { ...campaign, ...campaignData };

    if (updatedCampaign.startDate && updatedCampaign.endDate &&
      updatedCampaign.startDate > updatedCampaign.endDate) {
      this.logger.warn('Start date must be before or equal to end date');
      throw new HttpException('Start date must be before or equal to end date', HttpStatus.BAD_REQUEST);
    }

    if (new Date(updatedCampaign.endDate) < new Date(Date.now())) {
      this.logger.warn('End date is in the past, setting status to EXPIRED');
      campaignData.status = CampaignStatus.EXPIRED;
    }

    console.log('execute', { campaignData });

    return this.campaignRepository.update(id, campaignData);
  }
}