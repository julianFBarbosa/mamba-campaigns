import { Test } from '@nestjs/testing';
import { DeleteCampaignUseCase } from './delete-campaign.use-case';
import { CampaignRepository } from '../../domain/repositories/campaign.repository.interface';

describe('DeleteCampaignUseCase', () => {
  let deleteCampaignUseCase: DeleteCampaignUseCase;
  let campaignRepository: jest.Mocked<CampaignRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteCampaignUseCase,
        {
          provide: CampaignRepository,
          useValue: {
            delete: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    deleteCampaignUseCase = moduleRef.get<DeleteCampaignUseCase>(DeleteCampaignUseCase);
    campaignRepository = moduleRef.get(CampaignRepository) as jest.Mocked<CampaignRepository>;
  });

  it('should delete campaign successfully', async () => {
    // Arrange
    const campaignId = 1;
    campaignRepository.delete.mockResolvedValue(true);

    // Act
    const result = await deleteCampaignUseCase.execute(campaignId);

    // Assert
    expect(campaignRepository.delete).toHaveBeenCalledWith(campaignId);
    expect(result).toBe(true);
  });

  it('should return false when campaign not deleted', async () => {
    // Arrange
    const campaignId = 999;
    campaignRepository.delete.mockResolvedValue(false);

    // Act
    const result = await deleteCampaignUseCase.execute(campaignId);

    // Assert
    expect(campaignRepository.delete).toHaveBeenCalledWith(campaignId);
    expect(result).toBe(false);
  });
}); 