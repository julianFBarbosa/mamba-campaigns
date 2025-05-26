import { Injectable } from '@nestjs/common';
import { CampaignEntity } from '../../domain/entities/campaign.entity';
import { CampaignRepository } from '../../domain/repositories/campaign.repository.interface';
import { CampaignStatus } from '../../domain/entities/campaign.entity';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class CampaignRepositoryImpl extends CampaignRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(campaign: CampaignEntity): Promise<CampaignEntity> {
    return this.prisma.campaign.create({
      data: {
        ...campaign,
        status: campaign.status as CampaignStatus,
        startDate: campaign.startDate ?? new Date(campaign.startDate),
        endDate: campaign.endDate ?? new Date(campaign.endDate),
      }
    });
  }

  async findAll(): Promise<CampaignEntity[]> {
    return this.prisma.campaign.findMany({
      where: {
        deletedAt: null
      },
      include: {
        category: true
      }
    });
  }

  async findById(id: number): Promise<CampaignEntity | null> {
    return this.prisma.campaign.findUnique({
      where: { id },
      include: {
        category: true
      }
    });
  }

  async update(id: number, campaignData: Partial<CampaignEntity>): Promise<CampaignEntity | null> {
    console.log({ campaignData });

    return this.prisma.campaign.update({
      where: { id },
      data: {
        ...campaignData,
      }
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.prisma.campaign.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
    return !!result;
  }
} 