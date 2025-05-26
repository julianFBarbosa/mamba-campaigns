import { Injectable } from '@nestjs/common';
import { CampaignEntity } from '../../domain/entities/campaign.entity';
import { CampaignRepository } from '../../domain/repositories/campaign.repository.interface';

@Injectable()
export class GetCampaignsUseCase {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  async execute(): Promise<CampaignEntity[]> {
    return this.campaignRepository.findAll();
  }
}

@Injectable()
export class GetCampaignByIdUseCase {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  async execute(id: number): Promise<CampaignEntity | null> {
    return this.campaignRepository.findById(id);
  }
} 