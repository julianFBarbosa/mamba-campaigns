import { CampaignEntity } from '../entities/campaign.entity';

export abstract class CampaignRepository {
  abstract create(campaign: CampaignEntity): Promise<CampaignEntity>;
  abstract findAll(): Promise<CampaignEntity[]>;
  abstract findById(id: number): Promise<CampaignEntity | null>;
  abstract update(id: number, campaign: Partial<CampaignEntity>): Promise<CampaignEntity | null>;
  abstract delete(id: number): Promise<boolean>;
} 