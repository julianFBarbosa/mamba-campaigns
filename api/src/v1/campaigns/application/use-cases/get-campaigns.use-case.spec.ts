import { Test } from '@nestjs/testing';
import { GetCampaignsUseCase, GetCampaignByIdUseCase } from './get-campaigns.use-case';
import { CampaignRepository } from '../../domain/repositories/campaign.repository.interface';
import { CampaignEntity, CampaignStatus } from '../../domain/entities/campaign.entity';

describe('GetCampaignsUseCase', () => {
  let getCampaignsUseCase: GetCampaignsUseCase;
  let getCampaignByIdUseCase: GetCampaignByIdUseCase;
  let campaignRepository: jest.Mocked<CampaignRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetCampaignsUseCase,
        GetCampaignByIdUseCase,
        {
          provide: CampaignRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    getCampaignsUseCase = moduleRef.get<GetCampaignsUseCase>(GetCampaignsUseCase);
    getCampaignByIdUseCase = moduleRef.get<GetCampaignByIdUseCase>(GetCampaignByIdUseCase);
    campaignRepository = moduleRef.get(CampaignRepository) as jest.Mocked<CampaignRepository>;
  });

  describe('GetCampaignsUseCase', () => {
    it('should return all campaigns', async () => {
      // Arrange
      const campaigns = [
        new CampaignEntity({ id: 1, name: 'Campaign 1', status: CampaignStatus.ACTIVE, categoryId: 1 }),
        new CampaignEntity({ id: 2, name: 'Campaign 2', status: CampaignStatus.PAUSED, categoryId: 2 }),
      ];
      
      campaignRepository.findAll.mockResolvedValue(campaigns);

      // Act
      const result = await getCampaignsUseCase.execute();

      // Assert
      expect(campaignRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(campaigns);
      expect(result.length).toBe(2);
    });

    it('should return empty array when no campaigns exist', async () => {
      // Arrange
      campaignRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await getCampaignsUseCase.execute();

      // Assert
      expect(campaignRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe('GetCampaignByIdUseCase', () => {
    it('should return campaign by id', async () => {
      // Arrange
      const campaign = new CampaignEntity({ 
        id: 1, 
        name: 'Campaign 1', 
        status: CampaignStatus.ACTIVE,
        categoryId: 1 
      });
      
      campaignRepository.findById.mockResolvedValue(campaign);

      // Act
      const result = await getCampaignByIdUseCase.execute(1);

      // Assert
      expect(campaignRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(campaign);
    });

    it('should return null when campaign not found', async () => {
      // Arrange
      campaignRepository.findById.mockResolvedValue(null);

      // Act
      const result = await getCampaignByIdUseCase.execute(999);

      // Assert
      expect(campaignRepository.findById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });
}); 