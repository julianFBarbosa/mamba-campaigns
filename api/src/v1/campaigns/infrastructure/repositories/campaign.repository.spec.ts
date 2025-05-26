import { Test } from '@nestjs/testing';
import { CampaignRepositoryImpl } from './campaign.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CampaignEntity, CampaignStatus } from '../../domain/entities/campaign.entity';

describe('CampaignRepositoryImpl', () => {
    let campaignRepository: CampaignRepositoryImpl;
    let prismaService: jest.Mocked<PrismaService>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                CampaignRepositoryImpl,
                {
                    provide: PrismaService,
                    useValue: {
                        campaign: {
                            create: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        campaignRepository = moduleRef.get<CampaignRepositoryImpl>(CampaignRepositoryImpl);
        prismaService = moduleRef.get(PrismaService) as jest.Mocked<PrismaService>;
    });

    describe('create', () => {
        it('should create a campaign', async () => {
            // Arrange
            const campaignData = new CampaignEntity({
                name: 'Test Campaign',
                status: CampaignStatus.ACTIVE,
                categoryId: 1,
            });

            const createdCampaign = { ...campaignData, id: 1 };
            jest.spyOn(prismaService.campaign, 'create').mockResolvedValue(createdCampaign);

            // Act
            const result = await campaignRepository.create(campaignData);

            // Assert
            expect(prismaService.campaign.create).toHaveBeenCalledWith({
                data: {
                    ...campaignData,
                    status: campaignData.status,
                },
            });
            expect(result).toEqual(createdCampaign);
        });
    });

    describe('findAll', () => {
        it('should return all non-deleted campaigns', async () => {
            const campaigns = [
                new CampaignEntity({ id: 1, name: 'Campaign 1', status: CampaignStatus.ACTIVE, categoryId: 1, deletedAt: null }),
                new CampaignEntity({ id: 2, name: 'Campaign 2', status: CampaignStatus.PAUSED, categoryId: 2, deletedAt: null }),
            ];

            jest.spyOn(prismaService.campaign, 'findMany').mockResolvedValue(campaigns);

            const result = await campaignRepository.findAll();

            expect(prismaService.campaign.findMany).toHaveBeenCalledWith({
                where: { deletedAt: null },
            });
            expect(result).toEqual(campaigns);
        });
    });

    describe('findById', () => {
        it('should find campaign by id', async () => {
            const campaign: CampaignEntity = new CampaignEntity({ id: 2, name: 'Campaign 2', status: CampaignStatus.PAUSED, categoryId: 2, deletedAt: null })

            jest.spyOn(prismaService.campaign, 'findUnique').mockResolvedValue(campaign);

            // Act
            const result = await campaignRepository.findById(1);

            // Assert
            expect(prismaService.campaign.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(result).toEqual(campaign);
        });

        it('should return null when campaign not found', async () => {
            const campaign: CampaignEntity = new CampaignEntity({ id: 99, name: 'Campaign 2', status: CampaignStatus.PAUSED, categoryId: 2, deletedAt: null })

            jest.spyOn(prismaService.campaign, 'findUnique').mockResolvedValue(null);

            const result = await campaignRepository.findById(999);

            expect(prismaService.campaign.findUnique).toHaveBeenCalledWith({
                where: { id: 999 },
            });
            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('should update campaign', async () => {
            // Arrange
            const campaignId = 1;
            const campaignData = {
                name: 'Updated Campaign',
                status: CampaignStatus.PAUSED,
            };

            const updatedCampaign: CampaignEntity = new CampaignEntity({ id: campaignId, name: 'Updated Campaign', status: CampaignStatus.PAUSED, categoryId: 1, deletedAt: null })

            jest.spyOn(prismaService.campaign, 'update').mockResolvedValue(updatedCampaign);

            // Act
            const result = await campaignRepository.update(campaignId, campaignData);

            // Assert
            expect(prismaService.campaign.update).toHaveBeenCalledWith({
                where: { id: campaignId },
                data: {
                    ...campaignData,
                },
            });
            expect(result).toEqual(updatedCampaign);
        });
    });

    describe('delete', () => {
        it('should soft delete campaign by setting deletedAt', async () => {
            // Arrange
            const campaignId = 1;
            const deletedCampaign: CampaignEntity = new CampaignEntity({ id: campaignId, name: 'Deleted Campaign', status: CampaignStatus.PAUSED, categoryId: 1, deletedAt: expect.any(Date) })

            jest.spyOn(prismaService.campaign, 'update').mockResolvedValue(deletedCampaign);

            // Act
            const result = await campaignRepository.delete(campaignId);

            // Assert
            expect(prismaService.campaign.update).toHaveBeenCalledWith({
                where: { id: campaignId },
                data: {
                    deletedAt: expect.any(Date),
                },
            });
            expect(result).toBe(true);
        });
    });
}); 