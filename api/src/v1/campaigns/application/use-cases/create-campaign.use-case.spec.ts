import { Test } from '@nestjs/testing';
import { CreateCampaignUseCase } from './create-campaign.use-case';
import { CampaignRepository } from '../../domain/repositories/campaign.repository.interface';
import { CategoryRepository } from '../../../categories/domain/repositories/category.repository.interface';
import { CampaignEntity, CampaignStatus } from '../../domain/entities/campaign.entity';

describe('CreateCampaignUseCase', () => {
  let createCampaignUseCase: CreateCampaignUseCase;
  let campaignRepository: jest.Mocked<CampaignRepository>;
  let categoryRepository: jest.Mocked<CategoryRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateCampaignUseCase,
        {
          provide: CampaignRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: CategoryRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    createCampaignUseCase = moduleRef.get<CreateCampaignUseCase>(CreateCampaignUseCase);
    campaignRepository = moduleRef.get(CampaignRepository) as jest.Mocked<CampaignRepository>;
    categoryRepository = moduleRef.get(CategoryRepository) as jest.Mocked<CategoryRepository>;
  });

  it('should create a campaign successfully', async () => {
    // Arrange
    const campaignData = {
      name: 'Test Campaign',
      status: CampaignStatus.ACTIVE,
      categoryId: 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000), // Tomorrow
    };
    
    const category = { id: 1, name: 'Test Category' };
    const expectedCampaign = new CampaignEntity(campaignData);
    
    categoryRepository.findById.mockResolvedValue(category);
    campaignRepository.create.mockResolvedValue(expectedCampaign);

    // Act
    const result = await createCampaignUseCase.execute(campaignData);

    // Assert
    expect(categoryRepository.findById).toHaveBeenCalledWith(1);
    expect(campaignRepository.create).toHaveBeenCalled();
    expect(result).toEqual(expectedCampaign);
  });

  it('should throw error if category not found', async () => {
    // Arrange
    const campaignData = {
      name: 'Test Campaign',
      status: CampaignStatus.ACTIVE,
      categoryId: 999, // Non-existent category
    };
    
    categoryRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(createCampaignUseCase.execute(campaignData)).rejects.toThrow('Category not found');
    expect(categoryRepository.findById).toHaveBeenCalledWith(999);
    expect(campaignRepository.create).not.toHaveBeenCalled();
  });

  it('should set status to EXPIRED if endDate is in the past', async () => {
    // Arrange
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    
    const campaignData = {
      name: 'Past Campaign',
      status: CampaignStatus.ACTIVE,
      categoryId: 1,
      startDate: new Date(pastDate.getTime() - 86400000),
      endDate: pastDate
    };
    
    const category = { id: 1, name: 'Test Category' };
    const expectedCampaign = new CampaignEntity({
      ...campaignData,
      status: CampaignStatus.EXPIRED
    });
    
    categoryRepository.findById.mockResolvedValue(category);
    campaignRepository.create.mockResolvedValue(expectedCampaign);

    // Act
    const result = await createCampaignUseCase.execute(campaignData);

    // Assert
    expect(result.status).toBe(CampaignStatus.EXPIRED);
  });
}); 