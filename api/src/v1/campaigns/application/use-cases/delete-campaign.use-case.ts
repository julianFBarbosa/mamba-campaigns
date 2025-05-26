import { Injectable } from '@nestjs/common';
import { CampaignRepository } from '../../domain/repositories/campaign.repository.interface';

@Injectable()
export class DeleteCampaignUseCase {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  async execute(id: number): Promise<boolean> {
    return this.campaignRepository.delete(id);
  }
} 